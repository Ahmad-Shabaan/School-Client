import {
  Check,
  ClipboardCheck,
  BookOpen,
  BellOff,
  Loader2,
  ShieldAlert,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATION_TYPE_LABELS } from "../constants/notification.constants";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../hooks/useNotifications";
import { getRelativeTime } from "../utils/relativeTime";
import type {
  NotificationDto,
  NotificationType,
} from "../types/notification.types";

const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  Lesson: BookOpen,
  Exam: ClipboardCheck,
  Assignment: Check,
};

type NotificationPanelProps = {
  onClose: () => void;
};

const NotificationSkeletons = () => (
  <ul aria-hidden="true">
    {[0, 1, 2].map((index) => (
      <li
        key={index}
        className="flex animate-pulse flex-col gap-2 border-b border-line px-4 py-3"
      >
        <span className="h-3.5 w-1/2 rounded bg-line" />
        <span className="h-3 w-full rounded bg-line" />
        <span className="h-3 w-1/4 rounded bg-line" />
      </li>
    ))}
  </ul>
);

const NotificationItem = ({
  notification,
}: {
  notification: NotificationDto;
}) => {
  const TypeIcon = TYPE_ICONS[notification.type] ?? TYPE_ICONS.Lesson;
  const typeLabel = NOTIFICATION_TYPE_LABELS[notification.type]?.ar ?? "";

  const { mutate: markRead, isPending: isMarking } =
    useMarkNotificationAsRead();
  const { mutate: remove, isPending: isDeleting } = useDeleteNotification();

  return (
    <li
      className={cn(
        "group relative flex items-start gap-3 border-b border-line px-4 py-3 text-sm text-body last:border-b-0",
        !notification.isRead && "bg-teal-soft",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-7 flex-none items-center justify-center rounded-full",
          notification.isRead
            ? "bg-line text-body-mute"
            : "bg-teal text-gold-soft",
        )}
      >
        <TypeIcon className="size-4" />
      </span>

      <button
        type="button"
        onClick={() => {
          if (!notification.isRead){
            markRead({ id: notification.id });
          }
        }}
        title={notification.isRead ? undefined : "تحديد كمقروء"}
        className="min-w-0 flex-1 cursor-pointer text-start"
      >
        <div className="flex items-center gap-2">
          <span className="truncate font-bold text-teal-dark">
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className="size-2 flex-none rounded-full bg-gold" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 whitespace-pre-line text-body">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-body-mute">
          <span>{typeLabel}</span>
          <span aria-hidden="true">•</span>
          <span>{getRelativeTime(notification.createdAt)}</span>
        </div>
      </button>

      <span className="flex flex-none items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        {!notification.isRead && (
          <button
            type="button"
            aria-label="تحديد كمقروء"
            disabled={isMarking}
            onClick={() => markRead({ id: notification.id })}
            className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] text-teal-dark transition-colors hover:bg-line disabled:opacity-50"
          >
            {isMarking ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </button>
        )}
        <button
          type="button"
          aria-label="حذف الإشعار"
          disabled={isDeleting}
          onClick={() => remove({ id: notification.id })}
          className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] text-error-dim transition-colors hover:bg-error/10 disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </button>
      </span>
    </li>
  );
};

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotifications(true);

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  return (
    <div
      role="dialog"
      aria-label="الإشعارات"
      dir="rtl"
      className="overflow-hidden rounded-[10px] border border-line bg-white text-start font-tajawal shadow-[0_8px_24px_rgba(22,48,42,0.12)]"
    >
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-3">
        <span className="font-bold text-teal-dark">الإشعارات</span>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={isMarkingAll}
              onClick={() => markAllRead()}
              className="flex cursor-pointer items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:opacity-50"
            >
              {isMarkingAll && <Loader2 className="size-3.5 animate-spin" />}
              تحديد الكل كمقروء
            </button>
          )}
          <button
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full text-body-mute transition-colors hover:bg-line sm:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <NotificationSkeletons />
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 px-6 py-8 text-center text-sm text-error-dim">
          <ShieldAlert className="size-6" />
          <span>تعذر تحميل الإشعارات. حاول مرة أخرى.</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <BellOff className="size-6 text-body-mute" />
          <span className="text-sm font-bold text-teal-dark">
            لا توجد إشعارات
          </span>
          <span className="text-xs text-body-mute">
            ستصلك الإشعارات هنا عند حدوث جديد
          </span>
        </div>
      ) : (
        <>
          <ul className="max-h-[360px] min-w-0 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>

          {hasNextPage && (
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-line bg-paper px-4 py-2.5 text-xs font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:opacity-60"
            >
              {isFetchingNextPage && (
                <Loader2 className="size-3.5 animate-spin" />
              )}
              تحميل المزيد
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
