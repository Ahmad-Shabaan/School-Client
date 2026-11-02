export const CHAT_MESSAGES_PAGE_SIZE = 20;
export const CHAT_CONVERSATIONS_PAGE_SIZE = 20;
export const MAX_CHAT_MESSAGE_LENGTH = 2000;
export const CHAT_MESSAGES_STALE_TIME = 60_000;
export const CHAT_MESSAGES_GC_TIME = 1_800_000;
export const CHAT_CONVERSATIONS_STALE_TIME = 30_000;
export const CHAT_CONVERSATIONS_GC_TIME = 1_800_000;
export const CHAT_UNREAD_COUNT_STALE_TIME = 30_000;
export const MAX_CHAT_BADGE_COUNT = 99;

export const CHAT_QUERY_KEY = {
  all: () => ["chat"] as const,
  student: () => [...CHAT_QUERY_KEY.all(), "student"] as const,
  conversation: () => [...CHAT_QUERY_KEY.student(), "conversation"] as const,
  messagesAll: () => [...CHAT_QUERY_KEY.student(), "messages"] as const,
  unreadCount: () => [...CHAT_QUERY_KEY.student(), "unread-count"] as const,
  admin: () => [...CHAT_QUERY_KEY.all(), "admin"] as const,
  conversationsAll: () => [...CHAT_QUERY_KEY.admin(), "conversations"] as const,
  conversations: () =>
    [...CHAT_QUERY_KEY.conversationsAll(), "list"] as const,
  conversationDetailsAll: () =>
    [...CHAT_QUERY_KEY.admin(), "conversation-details"] as const,
  conversationDetail: (conversationId: number) =>
    [...CHAT_QUERY_KEY.conversationDetailsAll(), conversationId] as const,
  conversationMessagesAll: () =>
    [...CHAT_QUERY_KEY.admin(), "conversation-messages"] as const,
  conversationMessages: (conversationId: number) =>
    [...CHAT_QUERY_KEY.conversationMessagesAll(), conversationId] as const,
};

export const CHAT_HUB_PATH = "/hubs/chat";
export const CHAT_MESSAGE_SENT_EVENT = "MessageSent";
export const CHAT_MESSAGES_READ_EVENT = "MessagesRead";
