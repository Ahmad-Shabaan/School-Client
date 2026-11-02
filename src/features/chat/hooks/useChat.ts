import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { CHAT_QUERY_KEY } from "../constants/chat.constants";
import {
  adminConversationMessagesOptions,
  adminConversationOptions,
  adminConversationsQueryOptions,
  myConversationQueryOptions,
  myMessagesQueryOptions,
  myUnreadCountQueryOptions,
} from "../options/chat.options";
import {
  markConversationMessagesAsReadApi,
  markMyMessagesAsReadApi,
  sendAdminMessageApi,
  sendStudentMessageApi,
} from "../services/chatService";
import type { ConversationResponse } from "../types/chat.types";
import {
  appendMessageToCache,
  markMessagesRead,
  sortConversationsByLastActivity,
  updateConversations,
  type ChatMessagesData,
  type ConversationsData,
} from "../utils/chatCache";

// ── Student queries ─────────────────────────────────────────

export const useMyConversation = () =>
  useQuery(myConversationQueryOptions());

export const useMyMessages = (enabled: boolean) =>
  useInfiniteQuery(myMessagesQueryOptions(enabled));

export const useMyUnreadChatCount = (enabled: boolean) =>
  useQuery(myUnreadCountQueryOptions(enabled));

// ── Admin queries ───────────────────────────────────────────

export const useAdminConversations = () =>
  useInfiniteQuery(adminConversationsQueryOptions());

export const useAdminConversation = (conversationId: number) =>
  useQuery(adminConversationOptions(conversationId));

export const useAdminConversationMessages = (conversationId: number) =>
  useInfiniteQuery(adminConversationMessagesOptions(conversationId));

// ── Student mutations ───────────────────────────────────────

export const useSendStudentMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendStudentMessageApi,
    onSuccess: (response) => {
      const messagesKey = CHAT_QUERY_KEY.messagesAll();
      const cached = queryClient.getQueryData<ChatMessagesData>(messagesKey);

      if (cached) {
        const next = appendMessageToCache(cached, response.data);
        if (next !== cached) {
          queryClient.setQueryData(messagesKey, next);
        }
      } else {
        void queryClient.invalidateQueries({ queryKey: messagesKey });
      }

      queryClient.setQueryData<ConversationResponse>(
        CHAT_QUERY_KEY.conversation(),
        (cachedConversation) =>
          cachedConversation
            ? {
                ...cachedConversation,
                data: {
                  ...cachedConversation.data,
                  lastMessage: response.data.content,
                  lastMessageAt: response.data.createdAt,
                },
              }
            : cachedConversation,
      );
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useMarkMyMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, string>({
    mutationFn: () => markMyMessagesAsReadApi(),
    mutationKey: [...CHAT_QUERY_KEY.student(), "mark-as-read"],
    onSuccess: (_response, currentUserId) => {
      const messagesKey = CHAT_QUERY_KEY.messagesAll();

      const cachedMessages =
        queryClient.getQueryData<ChatMessagesData>(messagesKey);

      if (cachedMessages) {
        const readAt = new Date().toISOString();
        const next = markMessagesRead(
          cachedMessages,
          (message) => message.senderId !== currentUserId,
          readAt,
        );

        if (next !== cachedMessages) {
          queryClient.setQueryData(messagesKey, next);
        }
      }

      queryClient.setQueryData(
        CHAT_QUERY_KEY.unreadCount(),
        (previous) => (previous ? { ...previous, data: 0 } : previous),
      );
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

// ── Admin mutations ─────────────────────────────────────────

export const useSendAdminMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: number;
      content: string;
    }) => sendAdminMessageApi(conversationId, content),
    onSuccess: (response, { conversationId }) => {
      const messagesKey = CHAT_QUERY_KEY.conversationMessages(conversationId);
      const cachedMessages =
        queryClient.getQueryData<ChatMessagesData>(messagesKey);

      if (cachedMessages) {
        const next = appendMessageToCache(cachedMessages, response.data);
        if (next !== cachedMessages) {
          queryClient.setQueryData(messagesKey, next);
        }
      } else {
        void queryClient.invalidateQueries({ queryKey: messagesKey });
      }

      const listKey = CHAT_QUERY_KEY.conversations();
      const cachedList = queryClient.getQueryData<ConversationsData>(listKey);

      if (cachedList) {
        const updated = updateConversations(cachedList, (conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: response.data.content,
                lastMessageAt: response.data.createdAt,
              }
            : conversation,
        );

        if (updated) {
          queryClient.setQueryData(
            listKey,
            sortConversationsByLastActivity(updated),
          );
        }
      }

      queryClient.setQueryData<ConversationResponse>(
        CHAT_QUERY_KEY.conversationDetail(conversationId),
        (cachedConversation) =>
          cachedConversation
            ? {
                ...cachedConversation,
                data: {
                  ...cachedConversation.data,
                  lastMessage: response.data.content,
                  lastMessageAt: response.data.createdAt,
                },
              }
            : cachedConversation,
      );
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, { conversationId: number; studentId: string }>({
    mutationFn: ({ conversationId }) =>
      markConversationMessagesAsReadApi(conversationId),
    onSuccess: (_response, { conversationId, studentId }) => {
      const messagesKey =
        CHAT_QUERY_KEY.conversationMessages(conversationId);

      const cachedMessages =
        queryClient.getQueryData<ChatMessagesData>(messagesKey);

      if (cachedMessages) {
        const readAt = new Date().toISOString();
        const next = markMessagesRead(
          cachedMessages,
          (message) => message.senderId === studentId,
          readAt,
        );

        if (next !== cachedMessages) {
          queryClient.setQueryData(messagesKey, next);
        }
      }

      const listKey = CHAT_QUERY_KEY.conversations();
      const cachedList = queryClient.getQueryData<ConversationsData>(listKey);

      if (cachedList) {
        const next = updateConversations(cachedList, (conversation) =>
          conversation.id === conversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation,
        );

        if (next) {
          queryClient.setQueryData(listKey, next);
        }
      }
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};
