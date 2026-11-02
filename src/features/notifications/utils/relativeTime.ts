export const getRelativeTime = (isoDate: string): string => {
  const created = new Date(isoDate).getTime();
  if (Number.isNaN(created)) return "";

  const diffMinutes = Math.max(0, Math.floor((Date.now() - created) / 60_000));

  if (diffMinutes < 1) return "الأ";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `منذ ${weeks} أسبوع`;
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
};
