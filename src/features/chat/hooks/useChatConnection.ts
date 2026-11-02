import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CHAT_QUERY_KEY } from "../constants/chat.constants";
import {
  ensureChatConnection,
  onChatReconnected,
  onMessageSent,
  onMessagesRead,
  stopChatConnection,
} from "../services/chatHub";
import {
  sortConversationsByLastActivity,
  updateConversations,
  type ConversationsData,
} from "../utils/chatCache";
import type {
  ChatUnreadCountResponse,
} from "../types/chat.types";

/**
 * Keeps the single chat SignalR connection alive for the whole authenticated
 * session AND owns the app-wide realtime cache updates:
 * - the student unread-count badge (valid on every page, not only /chat),
 * - the admin inbox sidebar preview/unread/ordering.
 *
 * Mounted once under the authenticated route guard (RoleRoute →
 * ChatConnection), so the connection + listeners follow the session
 * lifecycle instead of being re-created per page. Pages keep only their
 * pane-level handlers (message list, read receipts, conversation detail),
 * which avoids duplicate cache writes.
 */
export default function useChatConnection() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      stopChatConnection();
      return;
    }

    // ── Cross-cutting sync for every page (badges, sidebar) ──────────────
    const offMessageSent = onMessageSent((message) => {
      // Incoming (not self-sent) messages raise the student unread badge.
      if (message.senderId !== userId) {
        queryClient.setQueryData<ChatUnreadCountResponse>(
          CHAT_QUERY_KEY.unreadCount(),
          (previous) =>
            previous ? { ...previous, data: previous.data + 1 } : previous,
        );
      }

      // Admin inbox sidebar: only update conversations already visible in
      // the cache; unknown ones arrive on the next server refetch.
      const listKey = CHAT_QUERY_KEY.conversations();
      const cachedList = queryClient.getQueryData<ConversationsData>(listKey);
      if (!cachedList) return;

      const isKnown = cachedList.pages.some((page) =>
        page.data.some(
          (conversation) => conversation.id === message.conversationId,
        ),
      );
      if (!isKnown) {
        void queryClient.invalidateQueries({ queryKey: listKey });
        return;
      }

      queryClient.setQueryData<ConversationsData>(listKey, (current) => {
        if (!current) return current;

        const updated = updateConversations(current, (conversation) =>
          conversation.id === message.conversationId
            ? {
                ...conversation,
                lastMessage: message.content,
                lastMessageAt: message.createdAt,
                // The backend counts unread *student* messages only.
                unreadCount:
                  message.senderId === conversation.studentId
                    ? conversation.unreadCount + 1
                    : conversation.unreadCount,
              }
            : conversation,
        );

        return updated ? sortConversationsByLastActivity(updated) : current;
      });
    });

    const offMessagesRead = onMessagesRead((payload) => {
      // When the student of the conversation reads, the admin inbox badge
      // and preview counters clear. (The student's own badge is cleared by
      // their mark-as-read mutation, and read events for them are never
      // delivered to them anyway.)
      const listKey = CHAT_QUERY_KEY.conversations();
      const cachedList = queryClient.getQueryData<ConversationsData>(listKey);
      if (!cachedList) return;

      const conversation = cachedList.pages
        .flatMap((page) => page.data)
        .find((candidate) => candidate.id === payload.conversationId);

      if (!conversation) return;
      if (payload.readerId !== conversation.studentId) return;
      if (conversation.unreadCount === 0) return;

      const next = updateConversations(cachedList, (candidate) =>
        candidate.id === payload.conversationId
          ? { ...candidate, unreadCount: 0 }
          : candidate,
      );
      if (next) {
        queryClient.setQueryData(listKey, next);
      }
    });

    const offReconnected = onChatReconnected(() => {
      // Server truth wins after a reconnect: refresh the shared surfaces.
      void queryClient.refetchQueries({
        queryKey: CHAT_QUERY_KEY.unreadCount(),
        stale: true,
      });
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.conversations(),
      });
    });

    void ensureChatConnection(userId);

    return () => {
      offMessageSent();
      offMessagesRead();
      offReconnected();
    };
  }, [isAuthenticated, userId, queryClient]);
}
