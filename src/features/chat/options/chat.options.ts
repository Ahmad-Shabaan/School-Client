import {
  infiniteQueryOptions,
  queryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import {
  CHAT_CONVERSATIONS_GC_TIME,
  CHAT_CONVERSATIONS_STALE_TIME,
  CHAT_MESSAGES_GC_TIME,
  CHAT_MESSAGES_STALE_TIME,
  CHAT_QUERY_KEY,
  CHAT_UNREAD_COUNT_STALE_TIME,
} from "../constants/chat.constants";
import {
  getAdminConversationApi,
  getAdminConversationMessagesApi,
  getConversationsApi,
  getMyConversationApi,
  getMyMessagesApi,
  getMyUnreadCountApi,
} from "../services/chatService";
import type {
  ChatMessagesListResponse,
  ChatUnreadCountResponse,
  ConversationsListResponse,
  ConversationResponse,
} from "../types/chat.types";

// ── Student ──────────────────────────────────────────────────

export const myConversationQueryOptions = () =>
  queryOptions<ConversationResponse, ApiErrorResponse>({
    queryKey: CHAT_QUERY_KEY.conversation(),
    queryFn: getMyConversationApi,
    staleTime: CHAT_MESSAGES_STALE_TIME,
    gcTime: CHAT_MESSAGES_GC_TIME,
    refetchOnWindowFocus: false,
  });

export const myUnreadCountQueryOptions = (enabled: boolean) =>
  queryOptions<ChatUnreadCountResponse, ApiErrorResponse>({
    queryKey: CHAT_QUERY_KEY.unreadCount(),
    queryFn: getMyUnreadCountApi,
    enabled,
    staleTime: CHAT_UNREAD_COUNT_STALE_TIME,
    gcTime: CHAT_MESSAGES_GC_TIME,
  });

export const myMessagesQueryOptions = (enabled: boolean) =>
  infiniteQueryOptions<
    ChatMessagesListResponse,
    ApiErrorResponse,
    InfiniteData<ChatMessagesListResponse, number>,
    ReturnType<typeof CHAT_QUERY_KEY.messagesAll>,
    number
  >({
    queryKey: CHAT_QUERY_KEY.messagesAll(),
    queryFn: ({ pageParam }) => getMyMessagesApi(pageParam),
    initialPageParam: 0,
    enabled,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      return pagination.pageIndex + 1 < pagination.totalPages
        ? pagination.pageIndex + 1
        : undefined;
    },
    staleTime: CHAT_MESSAGES_STALE_TIME,
    gcTime: CHAT_MESSAGES_GC_TIME,
    refetchOnWindowFocus: false,
  });

// ── Admin ────────────────────────────────────────────────────

export const adminConversationsQueryOptions = () =>
  infiniteQueryOptions<
    ConversationsListResponse,
    ApiErrorResponse,
    InfiniteData<ConversationsListResponse, number>,
    ReturnType<typeof CHAT_QUERY_KEY.conversations>,
    number
  >({
    queryKey: CHAT_QUERY_KEY.conversations(),
    queryFn: ({ pageParam }) => getConversationsApi(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      return pagination.pageIndex + 1 < pagination.totalPages
        ? pagination.pageIndex + 1
        : undefined;
    },
    staleTime: CHAT_CONVERSATIONS_STALE_TIME,
    gcTime: CHAT_CONVERSATIONS_GC_TIME,
    refetchOnWindowFocus: false,
  });

export const adminConversationOptions = (conversationId: number) =>
  queryOptions<ConversationResponse, ApiErrorResponse>({
    queryKey: CHAT_QUERY_KEY.conversationDetail(conversationId),
    queryFn: () => getAdminConversationApi(conversationId),
    enabled: Number.isFinite(conversationId) && conversationId > 0,
    staleTime: CHAT_CONVERSATIONS_STALE_TIME,
    gcTime: CHAT_CONVERSATIONS_GC_TIME,
    refetchOnWindowFocus: false,
  });

export const adminConversationMessagesOptions = (conversationId: number) =>
  infiniteQueryOptions<
    ChatMessagesListResponse,
    ApiErrorResponse,
    InfiniteData<ChatMessagesListResponse, number>,
    ReturnType<typeof CHAT_QUERY_KEY.conversationMessages>,
    number
  >({
    queryKey: CHAT_QUERY_KEY.conversationMessages(conversationId),
    queryFn: ({ pageParam }) =>
      getAdminConversationMessagesApi(conversationId, pageParam),
    initialPageParam: 0,
    enabled: Number.isFinite(conversationId) && conversationId > 0,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      return pagination.pageIndex + 1 < pagination.totalPages
        ? pagination.pageIndex + 1
        : undefined;
    },
    staleTime: CHAT_MESSAGES_STALE_TIME,
    gcTime: CHAT_MESSAGES_GC_TIME,
    refetchOnWindowFocus: false,
  });
