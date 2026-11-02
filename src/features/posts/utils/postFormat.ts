import { getRelativeTime } from "@/features/notifications/utils/relativeTime";

export const formatRelativeTime = (isoDate: string): string =>
  getRelativeTime(isoDate);

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
};
