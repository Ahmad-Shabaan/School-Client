import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { config } from "@/config/env";
import { store } from "@/store/store";
import {
  NOTIFICATIONS_HUB_PATH,
  NOTIFICATION_CREATED_EVENT,
} from "../constants/notification.constants";
import type { NotificationDto } from "../types/notification.types";

type NotificationListener = (notification: NotificationDto) => void;
type ReconnectedListener = () => void;

const listeners = new Set<NotificationListener>();
const reconnectedListeners = new Set<ReconnectedListener>();

let connection: HubConnection | null = null;
let connectedUserId: string | null = null;

const hubUrl = () =>
  `${config.apiUrl.replace(/\/api\/?$/, "")}${NOTIFICATIONS_HUB_PATH}`;

const isPayloadValid = (payload: unknown): payload is NotificationDto =>
  typeof payload === "object" &&
  payload !== null &&
  typeof (payload as NotificationDto).id === "string" &&
  typeof (payload as NotificationDto).title === "string" &&
  typeof (payload as NotificationDto).message === "string" &&
  typeof (payload as NotificationDto).createdAt === "string";

export const getNotificationsConnectionState = (): HubConnectionState =>
  connection?.state ?? HubConnectionState.Disconnected;

export function onNotificationCreated(
  listener: NotificationListener,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function onReconnected(listener: ReconnectedListener): () => void {
  reconnectedListeners.add(listener);
  return () => reconnectedListeners.delete(listener);
}

/** Starts (or re-uses) the connection for the given user, exactly one at a time. */
export async function ensureNotificationsConnection(
  userId: string,
): Promise<void> {
  if (
    connection &&
    connectedUserId === userId &&
    connection.state !== HubConnectionState.Disconnected
  ) {
    return;
  }

  // Different authenticated user → drop the previous session connection.
  if (connection) {
    const stale = connection;
    connection = null;
    connectedUserId = null;
    await stale.stop().catch(() => undefined);
  }

  const built = new HubConnectionBuilder()
    .withUrl(hubUrl(), {
      accessTokenFactory: () => store.getState().auth.accessToken ?? "",
    })
    .withAutomaticReconnect()
    .build();

  built.on(NOTIFICATION_CREATED_EVENT, (payload: unknown) => {
    if (!isPayloadValid(payload)) return;
    listeners.forEach((listener) => listener(payload));
  });

  built.onreconnected(() => reconnectedListeners.forEach((l) => l()));

  built.onclose(() => {
    if (connection === built) {
      connection = null;
      connectedUserId = null;
    }
  });

  connection = built;
  connectedUserId = userId;

  try {
    await built.start();
  } catch {
    if (connection === built) {
      connection = null;
      connectedUserId = null;
    }
  }
}

export function stopNotificationsConnection(): void {
  const active = connection;
  connection = null;
  connectedUserId = null;
  if (active && active.state !== HubConnectionState.Disconnected) {
    active.stop().catch(() => undefined);
  }
}
