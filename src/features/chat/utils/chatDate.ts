const TIMEZONE_PATTERN = /(?:Z|[+-]\d{2}:?\d{2})$/i;

/**
 * The API returns UTC timestamps without a timezone designator (the backend
 * serializes `DateTime` values whose kind is `Unspecified`). Without the
 * normalization below the browser would read them as local time and shift
 * every timestamp by the client offset.
 */
export const parseChatDate = (value: string): Date => {
  const trimmed = value.trim();

  if (!trimmed) return new Date(Number.NaN);

  const normalized = TIMEZONE_PATTERN.test(trimmed) ? trimmed : `${trimmed}Z`;

  return new Date(normalized);
};

export const formatChatTime = (value: string): string => {
  const date = parseChatDate(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatChatDate = (value: string): string => {
  const date = parseChatDate(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};
