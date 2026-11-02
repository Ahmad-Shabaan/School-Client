import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  type InfiniteData,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type Mock } from "vitest";

vi.mock("@/features/notifications/services/notificationHub", () => ({
  ensureNotificationsConnection: vi.fn().mockResolvedValue(undefined),
  stopNotificationsConnection: vi.fn(),
  onNotificationCreated: vi.fn(() => () => undefined),
  onReconnected: vi.fn(() => () => undefined),
}));

import { toast } from "sonner";
import { ROLES } from "@/config/constants";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { setCredentials, clearAuth } from "@/features/auth/store/authSlice";
import useNotificationsConnection from "./useNotificationsConnection";
import {
  ensureNotificationsConnection,
  onNotificationCreated,
  stopNotificationsConnection,
} from "../services/notificationHub";
import { NOTIFICATIONS_QUERY_KEY } from "../constants/notification.constants";
import type {
  NotificationDto,
  NotificationsListResponse,
  UnreadNotificationsCountResponse,
} from "../types/notification.types";

const LIST_KEY = NOTIFICATIONS_QUERY_KEY.list();
const UNREAD_KEY = NOTIFICATIONS_QUERY_KEY.unreadCount();
const ensureConnection = ensureNotificationsConnection as unknown as Mock;

const notification = (id: string, isRead = false): NotificationDto => ({
  id,
  title: `Title ${id}`,
  message: `Message ${id}`,
  type: "Lesson",
  isRead,
  createdAt: "2026-10-31T09:00:00Z",
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
  return { queryClient, wrapper };
};

const seedCaches = (queryClient: QueryClient) => {
  const firstPage: NotificationsListResponse = {
    success: true,
    message: "",
    data: [notification("n1"), notification("n2")],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
      totalCount: 2,
      totalPages: 1,
    },
  };
  queryClient.setQueryData<InfiniteData<NotificationsListResponse>>(LIST_KEY, {
    pages: [firstPage],
    pageParams: [0],
  });
  queryClient.setQueryData<UnreadNotificationsCountResponse>(UNREAD_KEY, {
    success: true,
    message: "",
    data: 2,
  });
};

const loginAs = () =>
  act(() => {
    store.dispatch(
      setCredentials({
        accessToken: "token",
        expiresAt: "2026-12-31T00:00:00Z",
        user: {
          id: "u1",
          firstName: "Test",
          lastName: "User",
          email: "test@school.com",
          roles: [ROLES.Student],
        },
      }),
    );
  });

describe("useNotificationsConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, "success").mockImplementation(() => "toast");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    act(() => {
      store.dispatch(clearAuth());
    });
  });

  it("starts the SignalR connection for an authenticated user", () => {
    const { queryClient, wrapper } = createWrapper();
    seedCaches(queryClient);

    loginAs();
    const { unmount } = renderHook(() => useNotificationsConnection(), {
      wrapper,
    });

    expect(ensureConnection).toHaveBeenCalledWith("u1");
    unmount();
  });

  it("stops the connection after logout", () => {
    const { queryClient, wrapper } = createWrapper();
    seedCaches(queryClient);

    loginAs();
    const { unmount } = renderHook(() => useNotificationsConnection(), {
      wrapper,
    });

    ensureConnection.mockClear();
    act(() => {
      store.dispatch(clearAuth());
    });

    expect(stopNotificationsConnection).toHaveBeenCalled();
    unmount();
  });

  it("adds an incoming notification to cache, updates unread count and toasts", async () => {
    const { queryClient, wrapper } = createWrapper();
    seedCaches(queryClient);

    loginAs();
    renderHook(() => useNotificationsConnection(), { wrapper });

    expect(onNotificationCreated).toHaveBeenCalled();
    const listener = (onNotificationCreated as unknown as Mock).mock
      .calls[0][0] as (notification: NotificationDto) => void;

    await act(async () => {
      listener(notification("n9"));
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    const count = queryClient.getQueryData<UnreadNotificationsCountResponse>(
      UNREAD_KEY,
    );
    expect(count?.data).toBe(3);

    const list =
      queryClient.getQueryData<InfiniteData<NotificationsListResponse>>(
        LIST_KEY,
      );
    expect(list?.pages[0].data.some((n) => n.id === "n9")).toBe(true);
    expect(list?.pages[0].pagination?.totalCount).toBe(3);
  });

  it("ignores duplicate notifications", async () => {
    const { queryClient, wrapper } = createWrapper();
    seedCaches(queryClient);

    loginAs();
    renderHook(() => useNotificationsConnection(), { wrapper });

    const listener = (onNotificationCreated as unknown as Mock).mock
      .calls[0][0] as (notification: NotificationDto) => void;

    await act(async () => {
      listener(notification("n1"));
    });

    const count = queryClient.getQueryData<UnreadNotificationsCountResponse>(
      UNREAD_KEY,
    );
    expect(count?.data).toBe(2);
  });
});
