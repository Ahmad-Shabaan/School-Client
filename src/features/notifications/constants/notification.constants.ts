import type { NotificationType } from "../types/notification.types";

export const NOTIFICATIONS_STALE_TIME = 60_000;
export const NOTIFICATIONS_GC_TIME = 1_800_000;
export const UNREAD_COUNT_STALE_TIME = 30_000;

export const NOTIFICATIONS_PAGE_SIZE = 10;

export const NOTIFICATIONS_QUERY_KEY = {
  all: () => ["notifications"] as const,
  list: () => [...NOTIFICATIONS_QUERY_KEY.all(), "list"] as const,
  unreadCount: () =>
    [...NOTIFICATIONS_QUERY_KEY.all(), "unread-count"] as const,
};

export const NOTIFICATIONS_HUB_PATH = "/hubs/notifications";
export const NOTIFICATION_CREATED_EVENT = "NotificationCreated";
export const MAX_BADGE_COUNT = 99;

export const NOTIFICATION_TYPE_LABELS: Record<
  NotificationType,
  { ar: string; en: string }
> = {
  Lesson: { ar: "درس جديد", en: "New lesson" },
  Exam: { ar: "اجتياز اختبار", en: "Exam passed" },
  Assignment: { ar: "تسليم تقرير", en: "Report submitted" },
};
