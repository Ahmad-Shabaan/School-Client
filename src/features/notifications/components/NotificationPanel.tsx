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

export type NotificationVariant = "student" | "admin";

const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  Lesson: BookOpen,
  Exam: ClipboardCheck,
  Assignment: Check,
};

type NotificationPanelProps = {
  onClose: () => void;
  variant?: NotificationVariant;
};

const PANEL_STYLES: Record<
  NotificationVariant,
  {
    root: string;
    header: string;
    headerTitle: string;
    markAll: string;
    skeletonRow: string;
    skeletonBone: string;
    item: string;
    itemUnread: string;
    iconUnread: string;
    iconRead: string;
    itemTitle: string;
    dot: string;
    itemMessage: string;
    actionRead: string;
    actionDelete: string;
    errorText: string;
    emptyTitle: string;
    emptyText: string;
    loadMore: string;
  }
> = {
  student: {
    root: "overflow-hidden rounded-[10px] border border-line bg-white text-start font-tajawal shadow-[0_8px_24px_rgba(22,48,42,0.12)]",
    header: "border-b border-line bg-paper",
    headerTitle: "font-bold text-teal-dark",
    markAll:
      "cursor-pointer items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:opacity-50",
    skeletonRow: "border-b border-line",
    skeletonBone: "bg-line",
    item: "border-b border-line text-body",
    itemUnread: "bg-teal-soft",
    iconUnread: "bg-teal text-gold-soft",
    iconRead: "bg-line text-body-mute",
    itemTitle: "text-teal-dark",
    dot: "bg-gold",
    itemMessage: "text-body",
    actionRead: "text-teal-dark hover:bg-line",
    actionDelete: "text-error-dim hover:bg-error/10",
    errorText: "text-error-dim",
    emptyTitle: "text-teal-dark",
    emptyText: "text-body-mute",
    loadMore:
      "items-center gap-2 border-t border-line bg-paper text-xs font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:opacity-60",
  },
  admin: {
    root: "overflow-hidden rounded-xl border border-border bg-popover text-start shadow-lg",
    header: "border-b border-border/60 bg-accent/40",
    headerTitle: "text-sm font-semibold text-foreground",
    markAll:
      "cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50",
    skeletonRow: "border-b border-border/60",
    skeletonBone: "bg-muted",
    item: "border-b border-border/60 text-foreground",
    itemUnread: "bg-primary/5",
    iconUnread: "bg-primary/10 text-primary",
    iconRead: "bg-muted text-muted-foreground",
    itemTitle: "text-foreground",
    dot: "bg-primary",
    itemMessage: "text-muted-foreground",
    actionRead: "text-primary hover:bg-muted",
    actionDelete: "text-destructive hover:bg-destructive/10",
    errorText: "text-destructive",
    emptyTitle: "text-foreground",
    emptyText: "text-muted-foreground",
    loadMore:
      "items-center gap-2 border-t border-border/60 text-xs font-bold text-primary transition-colors hover:bg-accent/40 disabled:opacity-60",
  },
};

const NotificationSkeletons = ({ styles }: { styles: (typeof PANEL_STYLES)[NotificationVariant] }) => (
  <ul aria-hidden="true">
    {[0, 1, 2].map((index) => (
      <li
        key={index}
        className={`flex animate-pulse flex-col gap-2 px-4 py-3 ${styles.skeletonRow}`}
      >
        <span className={`h-3.5 w-1/2 rounded ${styles.skeletonBone}`} />
        <span className={`h-3 w-full rounded ${styles.skeletonBone}`} />
        <span className={`h-3 w-1/4 rounded ${styles.skeletonBone}`} />
      </li>
    ))}
  </ul>
);

const NotificationItem = ({
  notification,
  styles,
}: {
  notification: NotificationDto;
  styles: (typeof PANEL_STYLES)[NotificationVariant];
}) => {
  const TypeIcon = TYPE_ICONS[notification.type] ?? TYPE_ICONS.Lesson;
  const typeLabel = NOTIFICATION_TYPE_LABELS[notification.type]?.ar ?? "";

  const { mutate: markRead, isPending: isMarking } =
    useMarkNotificationAsRead();
  const { mutate: remove, isPending: isDeleting } = useDeleteNotification();

  return (
    <li
      className={cn(
        "group relative flex items-start gap-3 px-4 py-3 text-sm last:border-b-0",
        styles.item,
        !notification.isRead && styles.itemUnread,
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-7 flex-none items-center justify-center rounded-full",
          notification.isRead ? styles.iconRead : styles.iconUnread,
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
          <span className={cn("truncate font-bold", styles.itemTitle)}>
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className={cn("size-2 flex-none rounded-full", styles.dot)} />
          )}
        </div>
        <p className={cn("mt-0.5 line-clamp-2 whitespace-pre-line", styles.itemMessage)}>
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
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-[8px] disabled:opacity-50",
              styles.actionRead,
            )}
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
          className={cn(
            "flex size-8 cursor-pointer items-center justify-center rounded-[8px] disabled:opacity-50",
            styles.actionDelete,
          )}
        >
          {isDeleting ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </button>
      </span>
    </li>
  );
};

const NotificationPanel = ({
  onClose,
  variant = "student",
}: NotificationPanelProps) => {
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

  const styles = PANEL_STYLES[variant];

  return (
    <div
      role="dialog"
      aria-label="الإشعارات"
      dir="rtl"
      className={styles.root}
    >
      <div className={cn("flex items-center justify-between px-4 py-3", styles.header)}>
        <span className={styles.headerTitle}>الإشعارات</span>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={isMarkingAll}
              onClick={() => markAllRead()}
              className={cn("flex", styles.markAll)}
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
        <NotificationSkeletons styles={styles} />
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 px-6 py-8 text-center text-sm">
          <ShieldAlert className={cn("size-6", styles.errorText)} />
          <span className={styles.errorText}>
            تعذر تحميل الإشعارات. حاول مرة أخرى.
          </span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <BellOff className={cn("size-6", styles.emptyText)} />
          <span className={cn("text-sm font-bold", styles.emptyTitle)}>
            لا توجد إشعارات
          </span>
          <span className={cn("text-xs", styles.emptyText)}>
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
                styles={styles}
              />
            ))}
          </ul>

          {hasNextPage && (
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              className={cn("flex w-full cursor-pointer px-4 py-2.5", styles.loadMore)}
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
