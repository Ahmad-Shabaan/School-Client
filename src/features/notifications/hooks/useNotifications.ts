import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import {
  NOTIFICATIONS_GC_TIME,
  NOTIFICATIONS_QUERY_KEY,
  NOTIFICATIONS_STALE_TIME,
  UNREAD_COUNT_STALE_TIME,
} from "../constants/notification.constants";
import {
  deleteNotificationApi,
  getNotificationsApi,
  getUnreadNotificationsCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "../services/notificationApi";
import type {
  MutationParams,
  NotificationDto,
  NotificationsListResponse,
  UnreadNotificationsCountResponse,
} from "../types/notification.types";

type NotificationListData = InfiniteData<NotificationsListResponse> | undefined;
type UnreadCountData = UnreadNotificationsCountResponse | undefined;

type MutationContext = {
  prevList: NotificationListData;
  prevCount: UnreadCountData;
};

const LIST_KEY = NOTIFICATIONS_QUERY_KEY.list();
const UNREAD_KEY = NOTIFICATIONS_QUERY_KEY.unreadCount();

const findNotification = (
  list: NotificationListData,
  id: string,
): NotificationDto | undefined =>
  list?.pages.flatMap((page) => page.data).find((n) => n.id === id);

/** ── Notifications list (paginated, load-more) ─────────────── */
export const useNotifications = (enabled: boolean) =>
  useInfiniteQuery<NotificationsListResponse, AxiosError>({
    queryKey: LIST_KEY,
    queryFn: ({ pageParam }) => getNotificationsApi(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      return pagination.pageIndex + 1 < pagination.totalPages
        ? pagination.pageIndex + 1
        : undefined;
    },
    enabled,
    staleTime: NOTIFICATIONS_STALE_TIME,
    gcTime: NOTIFICATIONS_GC_TIME,
    refetchOnWindowFocus: false,
  });

/** ── Unread count ──────────────────────────────────────────── */
export const useUnreadNotificationsCount = (enabled: boolean) =>
  useQuery<UnreadNotificationsCountResponse, AxiosError>({
    queryKey: UNREAD_KEY,
    queryFn: getUnreadNotificationsCountApi,
    enabled,
    staleTime: UNREAD_COUNT_STALE_TIME,
    gcTime: NOTIFICATIONS_GC_TIME,
  });

/** Shared mutation lifecycle: optimistic list/count updates with rollback. */
type ApplyOptimistic = (
  list: NotificationListData,
  params: MutationParams | void,
) => { list: NotificationListData; unreadDelta: number };

const useNotificationMutation = (
  mutationFn: (params: MutationParams) => Promise<unknown>,
  applyOptimistic: ApplyOptimistic,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError,
    MutationParams | void,
    MutationContext
  >({
    mutationFn: (params) => mutationFn(params as MutationParams),
    mutationKey: [...NOTIFICATIONS_QUERY_KEY.all(), "actions"],
    onMutate: async (params) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: LIST_KEY }),
        queryClient.cancelQueries({ queryKey: UNREAD_KEY }),
      ]);
      const prevList = queryClient.getQueryData<NotificationListData>(LIST_KEY);
      const prevCount = queryClient.getQueryData<UnreadCountData>(UNREAD_KEY);
      const { list, unreadDelta } = applyOptimistic(prevList, params);
      queryClient.setQueryData<NotificationListData>(LIST_KEY, list);
      if (unreadDelta !== 0) {
        queryClient.setQueryData<UnreadCountData>(UNREAD_KEY, (count) =>
          count
            ? { ...count, data: Math.max(0, count.data + unreadDelta) }
            : count,
        );
      }
      return { prevList, prevCount };
    },
    onError: (error, _params, context) => {
      if (context) {
        queryClient.setQueryData<NotificationListData>(LIST_KEY, context.prevList);
        queryClient.setQueryData<UnreadCountData>(UNREAD_KEY, context.prevCount);
      }
      toast.error(handleErrorMessage(error).title);
    },
  });
};

/** ── Mark one notification as read ─────────────────────────── */
export function useMarkNotificationAsRead() {
  return useNotificationMutation(markNotificationAsReadApi, (list, params) => {
    if (!params || !list) return { list, unreadDelta: 0 };
    const wasUnread = !findNotification(list, params.id)?.isRead;
    const pages = list.pages.map((page) => ({
      ...page,
      data: page.data.map((notification) =>
        notification.id === params.id
          ? { ...notification, isRead: true }
          : notification,
      ),
    }));
    return {
      list: wasUnread ? { ...list, pages } : list,
      unreadDelta: wasUnread ? -1 : 0,
    };
  });
}

/** ── Mark all notifications as read ────────────────────────── */
export function useMarkAllNotificationsAsRead() {
  return useNotificationMutation(markAllNotificationsAsReadApi, (list) => {
    if (!list) return { list, unreadDelta: 0 };
    const unreadCount = list.pages
      .flatMap((page) => page.data)
      .filter((notification) => !notification.isRead).length;
    if (unreadCount === 0) return { list, unreadDelta: 0 };
    const pages = list.pages.map((page) => ({
      ...page,
      data: page.data.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    }));
    return { list: { ...list, pages }, unreadDelta: -unreadCount };
  });
}

/** ── Delete one notification ───────────────────────────────── */
export function useDeleteNotification() {
  return useNotificationMutation(deleteNotificationApi, (list, params) => {
    if (!params || !list) return { list, unreadDelta: 0 };
    const wasUnread = !findNotification(list, params.id)?.isRead;
    let removed = false;
    const pages = list.pages.map((page) => {
      if (removed || !page.data.some((n) => n.id === params.id)) return page;
      removed = true;
      return {
        ...page,
        data: page.data.filter((n) => n.id !== params.id),
        pagination: page.pagination
          ? {
              ...page.pagination,
              totalCount: page.pagination.totalCount - 1,
            }
          : page.pagination,
      };
    });
    if (!removed) return { list, unreadDelta: 0 };
    return { list: { ...list, pages }, unreadDelta: wasUnread ? -1 : 0 };
  });
}
