import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { adminChatPath } from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  useAdminConversation,
  useAdminConversationMessages,
  useSendAdminMessage,
  useMarkConversationAsRead,
} from "../hooks/useChat";
import {
  appendMessageToCache,
  flattenChatMessages,
  markMessagesRead,
  type ChatMessagesData,
} from "../utils/chatCache";
import { CHAT_QUERY_KEY } from "../constants/chat.constants";
import {
  onChatReconnected,
  onMessageSent,
  onMessagesRead,
} from "../services/chatHub";
import ChatMessageBubble from "../components/ChatMessageBubble";
import ChatComposer from "../components/ChatComposer";
import ChatSkeleton from "../components/ChatSkeleton";
import ChatEmptyState from "../components/ChatEmptyState";
import type {
  ChatMessageDto,
  ConversationDto,
  ConversationResponse,
} from "../types/chat.types";

const LOAD_MORE_LABEL = "Load older messages";
const SCROLL_NEAR_BOTTOM_THRESHOLD = 80;
const MARK_READ_DEBOUNCE_MS = 2_000;

interface AdminChatConversationProps {
  conversationId: number;
  initialConversation?: ConversationDto;
}

export default function AdminChatConversation({
  conversationId,
  initialConversation,
}: AdminChatConversationProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);

  const {
    data: conversationResponse,
    isLoading,
    isError,
    error,
  } = useAdminConversation(conversationId);

  const {
    data: messagesData,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useAdminConversationMessages(conversationId);

  const sendAdminMessage = useSendAdminMessage();
  const { mutate: markConversationRead } = useMarkConversationAsRead();

  const containerRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const initialMarkHandledRef = useRef(false);
  const unreadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preserveScrollRef = useRef(false);
  const scrollHeightBeforeRef = useRef(0);
  const [showLoadMoreError, setShowLoadMoreError] = useState(false);

  const conversation = conversationResponse?.data ?? initialConversation;
  const conversationTitle = conversation?.studentName ?? "طالب";
  const conversationUnreadCount = conversation?.unreadCount ?? 0;
  const studentId = conversation?.studentId ?? "";
  const messages: ChatMessageDto[] = flattenChatMessages(messagesData);

  const isAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    return (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + SCROLL_NEAR_BOTTOM_THRESHOLD
    );
  }, []);

  const scheduleMarkRead = useCallback(() => {
    if (unreadTimerRef.current) {
      clearTimeout(unreadTimerRef.current);
    }

    unreadTimerRef.current = setTimeout(() => {
      if (atBottomRef.current && studentId && userId) {
        markConversationRead({ conversationId, studentId });
      }
      unreadTimerRef.current = null;
    }, MARK_READ_DEBOUNCE_MS);
  }, [conversationId, studentId, userId, markConversationRead]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleScroll = () => {
      atBottomRef.current = isAtBottom();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isAtBottom]);

  // ── Mark incoming student messages as read when opening the conversation ──
  useEffect(() => {
    // The initial read is handled exactly once per conversation; live
    // messages are marked through the debounced path instead.
    if (initialMarkHandledRef.current) return;
    if (!conversation || !studentId || !userId) return;

    initialMarkHandledRef.current = true;

    if (conversationUnreadCount <= 0) return;

    markConversationRead(
      { conversationId, studentId },
      {
        onSuccess: () => {
          const detailKey = CHAT_QUERY_KEY.conversationDetail(conversationId);
          queryClient.setQueryData(
            detailKey,
            (cached: ConversationResponse | undefined) =>
              cached
                ? {
                    ...cached,
                    data: { ...cached.data, unreadCount: 0 },
                  }
                : cached,
          );
        },
      },
    );
  }, [
    conversation,
    conversationId,
    conversationUnreadCount,
    studentId,
    userId,
    markConversationRead,
    queryClient,
  ]);

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

  // ── SignalR: live updates scoped to this conversation only ──
  useEffect(() => {
    if (!userId) return undefined;

    const unsubscribeMessageSent = onMessageSent((message) => {
      if (message.conversationId !== conversationId) return;

      const messagesKey = CHAT_QUERY_KEY.conversationMessages(conversationId);
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

      const detailKey = CHAT_QUERY_KEY.conversationDetail(conversationId);
      queryClient.setQueryData(
        detailKey,
        (cached: ConversationResponse | undefined) => {
          if (!cached) return cached;
          return {
            ...cached,
            data: {
              ...cached.data,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
              // The backend counts unread *student* messages only.
              unreadCount:
                message.senderId === studentId
                  ? cached.data.unreadCount + 1
                  : cached.data.unreadCount,
            },
          };
        },
      );

      if (message.senderId !== userId && isAtBottom()) {
        scheduleMarkRead();
      }
    });

    const unsubscribeMessagesRead = onMessagesRead((payload) => {
      if (payload.conversationId !== conversationId) return;
      if (payload.readerId !== studentId) return;

      const messagesKey = CHAT_QUERY_KEY.conversationMessages(conversationId);
      queryClient.setQueryData<ChatMessagesData>(messagesKey, (cached) => {
        const next = markMessagesRead(
          cached,
          (message) => message.senderId === userId,
          payload.readAtUtc,
        );
        return next ?? cached;
      });
    });

    const unsubscribeReconnected = onChatReconnected(() => {
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.conversationMessages(conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.conversationDetail(conversationId),
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
  }, [
    conversationId,
    userId,
    studentId,
    queryClient,
    isAtBottom,
    scheduleMarkRead,
  ]);

  const handleSend = async (content: string) => {
    setShowLoadMoreError(false);
    await sendAdminMessage.mutateAsync({ conversationId, content });
  };

  const isSending = sendAdminMessage.isPending;
  const hasMessages = messages.length > 0;

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center pt-10">
        <ChatSkeleton count={4} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center pt-10">
        <AppError
          message={handleErrorMessage(error).title}
          link="العودة إلى صندوق الرسائل"
          to={adminChatPath()}
          onRetry={() => {
            navigate(adminChatPath());
          }}
        />
      </div>
    );
  }

  if (!conversation || !userId) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center pt-10">
        <ChatEmptyState
          heading="تعذر تحميل المحادثة"
          description="تم اختيار محادثة غير صالحة أو لم يتم العثور عليها."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0">
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 flex-none items-center justify-center rounded-lg border border-line bg-white/60 text-teal-dark">
            <span className="text-[0.75rem] font-bold">
              {conversationTitle.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight text-ink">
              {conversationTitle}
            </h3>
            <p className="text-[0.7rem] leading-none text-body-mute">
              {messages.length} رسالة · غير مقروء: {conversationUnreadCount}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-body-mute sm:flex">
          {conversationUnreadCount > 0 && (
            <Badge variant="outline" className="px-2 py-0.5">
              غير مقروء
            </Badge>
          )}
        </div>
      </header>

      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-y-auto p-3 pb-12 sm:p-4"
        onScroll={() => {
          atBottomRef.current = isAtBottom();
        }}
      >
        {isFetching && !hasMessages && (
          <div className="flex h-full flex-col items-center justify-center pt-10">
            <ChatSkeleton count={3} />
          </div>
        )}

        {!hasMessages && !isFetching && (
          <div className="flex h-full flex-col items-center justify-center pt-10">
            <ChatEmptyState
              heading="لا توجد رسائل بعد"
              description={`ابدأ المحادثة بالرد على ${conversationTitle}.`}
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
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isFetching && <Spinner className="size-4" />}
                  {LOAD_MORE_LABEL}
                </button>
              </div>
            )}
          </div>
        )}

        {showLoadMoreError && (
          <p className="mt-2 text-center text-xs text-error-dim">
            تعذر تحميل الرسائل الأقدم، يرجى المحاولة مرة أخرى.
          </p>
        )}
      </div>

      <div className="border-t border-line bg-white">
        <ChatComposer
          onSend={handleSend}
          isSending={isSending}
          disabled={!conversationId}
          placeholder={`أرسل رداً إلى ${conversationTitle}...`}
        />
      </div>
    </div>
  );
}
