import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  appendMessageToCache,
  flattenChatMessages,
  markMessagesRead,
  type ChatMessagesData,
} from "../utils/chatCache";
import {
  CHAT_QUERY_KEY,
} from "../constants/chat.constants";
import {
  onChatReconnected,
  onMessageSent,
  onMessagesRead,
} from "../services/chatHub";
import {
  useMyConversation,
  useMyMessages,
  useMyUnreadChatCount,
  useSendStudentMessage,
  useMarkMyMessagesAsRead,
} from "../hooks/useChat";
import ChatMessageBubble from "../components/ChatMessageBubble";
import ChatComposer from "../components/ChatComposer";
import ChatSkeleton from "../components/ChatSkeleton";
import ChatEmptyState from "../components/ChatEmptyState";
import type {
  ChatMessageDto,
  ChatUnreadCountResponse,
  ConversationResponse,
} from "../types/chat.types";

const LOAD_MORE_LABEL = "تحميل رسائل أقدم";
const SCROLL_NEAR_BOTTOM_THRESHOLD = 80;
const MARK_READ_DEBOUNCE_MS = 2_000;

export default function StudentChat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? null;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: conversationResponse, isLoading, isError, error } =
    useMyConversation();

  const { data: messagesData, isFetching, fetchNextPage, hasNextPage } =
    useMyMessages(true);

  const { data: unreadCountResponse } = useMyUnreadChatCount(true);

  const sendStudentMessage = useSendStudentMessage();
  const { mutate: markIncomingRead } = useMarkMyMessagesAsRead();

  const containerRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const initialMarkHandledRef = useRef(false);
  const unreadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showLoadMoreError, setShowLoadMoreError] = useState(false);

  const conversation = conversationResponse?.data;
  const conversationId = conversation?.id;
  const messages: ChatMessageDto[] = flattenChatMessages(messagesData);
  const unreadCount =
    unreadCountResponse?.data ?? conversation?.unreadCount ?? 0;

  const isAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    return (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + SCROLL_NEAR_BOTTOM_THRESHOLD
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      atBottomRef.current = isAtBottom();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isAtBottom]);

  // ── Mark incoming admin messages as read when opening the conversation ──
  useEffect(() => {
    // The initial read is handled exactly once per conversation; live
    // messages are marked through the debounced path instead.
    if (initialMarkHandledRef.current) return;
    if (!conversationId || !userId || !unreadCountResponse) return;

    initialMarkHandledRef.current = true;

    if (unreadCount > 0) {
      markIncomingRead(userId);
    }
  }, [
    conversationId,
    unreadCount,
    unreadCountResponse,
    userId,
    markIncomingRead,
  ]);

  const preserveScrollRef = useRef(false);
  const scrollHeightBeforeRef = useRef(0);

  const loadOlderMessages = useCallback(() => {
    if (!hasNextPage || isFetching || !containerRef.current) return;
    preserveScrollRef.current = true;
    scrollHeightBeforeRef.current = containerRef.current.scrollHeight;
    void fetchNextPage().catch(() => {
      setShowLoadMoreError(true);
    });
  }, [hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (preserveScrollRef.current && scrollHeightBeforeRef.current > 0) {
      container.scrollTop =
        container.scrollHeight - scrollHeightBeforeRef.current;
      preserveScrollRef.current = false;
      scrollHeightBeforeRef.current = 0;
    } else if (atBottomRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messagesData, messages.length]);

  const scheduleMarkRead = useCallback(() => {
    if (unreadTimerRef.current) {
      clearTimeout(unreadTimerRef.current);
    }
    unreadTimerRef.current = setTimeout(() => {
      if (atBottomRef.current && userId) {
        markIncomingRead(userId);
      }
      unreadTimerRef.current = null;
    }, MARK_READ_DEBOUNCE_MS);
  }, [userId, markIncomingRead]);

  // ── SignalR: new message ──
  useEffect(() => {
    if (!conversationId || !userId) return undefined;

    const unsubscribeMessageSent = onMessageSent((message) => {
      if (message.conversationId !== conversationId) return;
      if (message.senderId === userId) return;

      const messagesKey = CHAT_QUERY_KEY.messagesAll();
      const cachedMessages =
        queryClient.getQueryData<ChatMessagesData>(messagesKey);

      if (!cachedMessages || cachedMessages.pages.length === 0) {
        void queryClient.invalidateQueries({ queryKey: messagesKey });
      } else {
        queryClient.setQueryData<ChatMessagesData>(messagesKey, (cached) => {
          const next = appendMessageToCache(cached, message);
          return next ?? cached;
        });
      }

      queryClient.setQueryData<ChatUnreadCountResponse>(
        CHAT_QUERY_KEY.unreadCount(),
        (previous) =>
          previous ? { ...previous, data: previous.data + 1 } : previous,
      );

      if (isAtBottom()) {
        scheduleMarkRead();
      }
    });

    const unsubscribeMessagesRead = onMessagesRead((payload) => {
      if (payload.conversationId !== conversationId) return;
      if (payload.readerId === userId) return;

      const messagesKey = CHAT_QUERY_KEY.messagesAll();
      const readAt = payload.readAtUtc;
      queryClient.setQueryData<ChatMessagesData>(messagesKey, (cached) => {
        const next = markMessagesRead(
          cached,
          (message) => message.senderId === userId,
          readAt,
        );
        return next ?? cached;
      });

      queryClient.setQueryData<ChatUnreadCountResponse>(
        CHAT_QUERY_KEY.unreadCount(),
        (previous) => (previous ? { ...previous, data: 0 } : previous),
      );

      queryClient.setQueryData<ConversationResponse>(
        CHAT_QUERY_KEY.conversation(),
        (cachedConversation) =>
          cachedConversation
            ? {
                ...cachedConversation,
                data: { ...cachedConversation.data, unreadCount: 0 },
              }
            : cachedConversation,
      );
    });

    const unsubscribeReconnected = onChatReconnected(() => {
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.messagesAll(),
      });
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.unreadCount(),
      });
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.conversation(),
      });
    });

    return () => {
      unsubscribeMessageSent();
      unsubscribeMessagesRead();
      unsubscribeReconnected();
      if (unreadTimerRef.current) {
        clearTimeout(unreadTimerRef.current);
        unreadTimerRef.current = null;
      }
    };
  }, [conversationId, userId, queryClient, isAtBottom, scheduleMarkRead]);

  const handleSend = async (content: string) => {
    setShowLoadMoreError(false);
    await sendStudentMessage.mutateAsync(content);
  };

  const isSending = sendStudentMessage.isPending;
  const hasMessages = messages.length > 0;

  if (isLoading) {
    return (
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-5 sm:py-12">
          <ChatSkeleton count={4} tone="brand" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="w-full flex-1">
        <AppError
          message={handleErrorMessage(error).title}
          link="العودة إلى الملف الشخصي"
          to="/student"
          onRetry={() => {
            navigate("/student", { replace: false });
          }}
        />
      </main>
    );
  }

  if (!conversation || !isAuthenticated || !userId) {
    return (
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-5 sm:py-12">
          <ChatEmptyState
            heading="لم يتم العثور على محادثة"
            description="لم تتمكن من فتح محادثة مع فريق الإدارة. حاول مرة أخرى لاحقًا."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex max-h-[calc(100svh-4.25rem)] min-h-0 w-full flex-1 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex size-8 flex-none items-center justify-center rounded-lg bg-teal-soft text-teal-dark font-extrabold">
            <span className="text-sm">إدارة</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink leading-tight">
              محادثة مع فريق الإدارة
            </h2>
            <p className="text-[0.7rem] leading-none text-body-mute">
              الطالب: {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            غير مقروء: {unreadCount}
          </Badge>
        )}
      </header>

      <div
        ref={containerRef}
        className="min-h-40 flex-1 overflow-y-auto p-3 sm:p-4 pb-12"
        onScroll={() => {
          atBottomRef.current = isAtBottom();
        }}
      >
        {isFetching && !hasMessages && (
          <div className="h-full flex flex-col items-center justify-center pt-10">
            <ChatSkeleton count={3} tone="brand" />
          </div>
        )}

        {!hasMessages && !isFetching && (
          <div className="h-full flex flex-col items-center justify-center pt-10">
            <ChatEmptyState
              heading="لا توجد رسائل بعد"
              description="ابدأ محادثة مع فريق الإدارة بإرسال رسالتك الأولى في الأسفل."
            />
          </div>
        )}

        {hasMessages && (
          <div className="space-y-2">
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isMine={message.senderId === userId}
              />
            ))}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={loadOlderMessages}
                  disabled={isFetching}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetching && <Spinner className="size-4" />}
                  {LOAD_MORE_LABEL}
                </button>
              </div>
            )}
          </div>
        )}

        {showLoadMoreError && (
          <p className="text-center text-xs text-error-dim mt-2">
            تعذر تحميل الرسائل الأقدم، حاول المحاولة مرة أخرى.
          </p>
        )}
      </div>

      <div className="border-t border-line bg-white">
        <ChatComposer
          onSend={handleSend}
          isSending={isSending}
          disabled={!conversationId}
          placeholder="اكتب رسالتك لفريق الإدارة..."
        />
      </div>
    </main>
  );
}
