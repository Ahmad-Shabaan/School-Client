import { useEffect } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import {
  NOTIFICATIONS_PAGE_SIZE,
  NOTIFICATIONS_QUERY_KEY,
} from "../constants/notification.constants";
import type {
  NotificationDto,
  NotificationsListResponse,
  UnreadNotificationsCountResponse,
} from "../types/notification.types";
import {
  ensureNotificationsConnection,
  onNotificationCreated,
  onReconnected,
  stopNotificationsConnection,
} from "../services/notificationHub";

const LIST_KEY = NOTIFICATIONS_QUERY_KEY.list();
const UNREAD_KEY = NOTIFICATIONS_QUERY_KEY.unreadCount();

/**
 * Owns the single SignalR connection for the whole app.
 * Mount exactly once under the authenticated route guard so the lifecycle
 * follows the authenticated session (starts on login/account change,
 * stops on logout).
 */
export default function useNotificationsConnection() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const userId = useAppSelector((s) => s.auth.user?.id ?? null);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      stopNotificationsConnection();
      return;
    }

    const insertNotification = (notification: NotificationDto) => {
      const cachedList =
        queryClient.getQueryData<InfiniteData<NotificationsListResponse>>(
          LIST_KEY,
        );

      if (cachedList) {
        const firstPage = cachedList.pages[0];
        const isDuplicate = cachedList.pages
          .flatMap((page) => page.data)
          .some((n) => n.id === notification.id);

        if (isDuplicate) return;

        queryClient.setQueryData<InfiniteData<NotificationsListResponse>>(
          LIST_KEY,
          {
            ...cachedList,
            pages: [
              {
                ...firstPage,
                data: [notification, ...firstPage.data].slice(
                  0,
                  NOTIFICATIONS_PAGE_SIZE,
                ),
                pagination: firstPage.pagination
                  ? {
                      ...firstPage.pagination,
                      totalCount: firstPage.pagination.totalCount + 1,
                    }
                  : firstPage.pagination,
              },
              ...cachedList.pages.slice(1),
            ],
          },
        );
      }

      if (!notification.isRead) {
        queryClient.setQueryData<UnreadNotificationsCountResponse>(
          UNREAD_KEY,
          (prev) =>
            prev ? { ...prev, data: Math.max(0, prev.data + 1) } : prev,
        );
      }

      toast.success(notification.title, { description: notification.message });
    };

    const unsubscribe = onNotificationCreated(insertNotification);

    const refetchAfterReconnect = onReconnected(() => {
      queryClient.refetchQueries({ queryKey: UNREAD_KEY });
      queryClient.refetchQueries({ queryKey: LIST_KEY, stale: true });
    });

    void ensureNotificationsConnection(userId);

    return () => {
      unsubscribe();
      refetchAfterReconnect();
    };
  }, [isAuthenticated, userId, queryClient]);
}
