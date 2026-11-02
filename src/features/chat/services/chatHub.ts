import {
  type HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { config } from "@/config/env";
import { store } from "@/store/store";
import {
  CHAT_HUB_PATH,
  CHAT_MESSAGES_READ_EVENT,
  CHAT_MESSAGE_SENT_EVENT,
} from "../constants/chat.constants";
import type { ChatMessageDto } from "../types/chat.types";

type MessageSentListener = (message: ChatMessageDto) => void;

export interface ChatReadPayload {
  conversationId: number;
  readerId: string;
  readAtUtc: string;
}

type MessagesReadListener = (payload: ChatReadPayload) => void;
type ReconnectedListener = () => void;

const messageSentListeners = new Set<MessageSentListener>();
const messagesReadListeners = new Set<MessagesReadListener>();
const reconnectedListeners = new Set<ReconnectedListener>();

const RECONNECT_RETRY_DELAY_MS = 5_000;

let connection: HubConnection | null = null;
let connectedUserId: string | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const hubUrl = () =>
  `${config.apiUrl.replace(/\/api\/?$/, "")}${CHAT_HUB_PATH}`;

const isMessagePayload = (payload: unknown): payload is ChatMessageDto => {
  if (typeof payload !== "object" || payload === null) return false;

  const message = payload as ChatMessageDto;
  return (
    typeof message.id === "number" &&
    typeof message.conversationId === "number" &&
    typeof message.senderId === "string" &&
    typeof message.senderName === "string" &&
    typeof message.content === "string" &&
    typeof message.createdAt === "string" &&
    (message.readAt === null || typeof message.readAt === "string")
  );
};

const toReadPayload = (
  conversationId: unknown,
  readerId: unknown,
  readAtUtc: unknown,
): ChatReadPayload | null => {
  if (
    typeof conversationId !== "number" ||
    typeof readerId !== "string" ||
    typeof readAtUtc !== "string"
  ) {
    return null;
  }

  return { conversationId, readerId, readAtUtc };
};

export const onMessageSent = (
  listener: MessageSentListener,
): (() => void) => {
  messageSentListeners.add(listener);
  return () => messageSentListeners.delete(listener);
};

export const onMessagesRead = (
  listener: MessagesReadListener,
): (() => void) => {
  messagesReadListeners.add(listener);
  return () => messagesReadListeners.delete(listener);
};

export const onChatReconnected = (
  listener: ReconnectedListener,
): (() => void) => {
  reconnectedListeners.add(listener);
  return () => reconnectedListeners.delete(listener);
};

export async function ensureChatConnection(userId: string): Promise<void> {
  if (
    connection &&
    connectedUserId === userId &&
    connection.state !== HubConnectionState.Disconnected
  ) {
    return;
  }

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

  built.on(CHAT_MESSAGE_SENT_EVENT, (payload: unknown) => {
    if (!isMessagePayload(payload)) return;
    messageSentListeners.forEach((listener) => listener(payload));
  });

  built.on(
    CHAT_MESSAGES_READ_EVENT,
    (conversationId: unknown, readerId: unknown, readAtUtc: unknown) => {
      const payload = toReadPayload(conversationId, readerId, readAtUtc);
      if (!payload) return;
      messagesReadListeners.forEach((listener) => listener(payload));
    },
  );

  built.onreconnected(() =>
    reconnectedListeners.forEach((listener) => listener()),
  );

  built.onclose(() => {
    if (connection !== built) return;

    connection = null;
    connectedUserId = null;

    // `withAutomaticReconnect` gives up after a few attempts, so schedule a
    // new connection while the session is still active.
    scheduleReconnect(userId);
  });

  connection = built;
  connectedUserId = userId;

  try {
    await built.start();

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (connection !== built) {
      await built.stop().catch(() => undefined);
    }
  } catch {
    if (connection === built) {
      connection = null;
      connectedUserId = null;
    }

    scheduleReconnect(userId);
  }
}

function scheduleReconnect(userId: string): void {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void ensureChatConnection(userId);
  }, RECONNECT_RETRY_DELAY_MS);
}

export function stopChatConnection(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  const active = connection;
  connection = null;
  connectedUserId = null;

  if (active && active.state !== HubConnectionState.Disconnected) {
    active.stop().catch(() => undefined);
  }
}
