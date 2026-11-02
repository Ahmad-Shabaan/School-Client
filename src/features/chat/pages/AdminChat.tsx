import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAdminConversations } from "../hooks/useChat";
import {
  sortConversationsByLastActivity,
  updateConversations,
  type ConversationsData,
} from "../utils/chatCache";
import { CHAT_QUERY_KEY } from "../constants/chat.constants";
import { adminChatPath } from "@/config/routes";
import { onChatReconnected, onMessageSent } from "../services/chatHub";
import ChatSkeleton from "../components/ChatSkeleton";
import ChatEmptyState from "../components/ChatEmptyState";
import ConversationSidebarItem from "../components/ConversationSidebarItem";
import AdminChatConversation from "./AdminChatConversation";
import type { ConversationDto } from "../types/chat.types";

const MOBILE_BREAKPOINT = 1024;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = () => setIsMobile(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isMobile ?? false;
}

function flattenConversations(
  pages: { data: ConversationDto[] }[] | undefined,
): ConversationDto[] {
  if (!pages) return [];
  const seen = new Set<number>();
  const result: ConversationDto[] = [];
  for (const page of pages) {
    for (const conversation of page.data) {
      if (seen.has(conversation.id)) continue;
      seen.add(conversation.id);
      result.push(conversation);
    }
  }
  return result;
}

export default function AdminChat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conversationId: conversationIdParam } = useParams<{
    conversationId?: string;
  }>();
  const selectedId = conversationIdParam ? Number(conversationIdParam) : null;
  const isMobile = useIsMobile();

  const {
    data: conversationsData,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAdminConversations();

  const conversations = useMemo(
    () => flattenConversations(conversationsData?.pages),
    [conversationsData],
  );

  const selectedConversation = useMemo(
    () =>
      selectedId != null
        ? conversations.find((item) => item.id === selectedId) ?? null
        : null,
    [conversations, selectedId],
  );

  const handleSelectConversation = useCallback(
    (id: number) => {
      navigate(adminChatPath(id));
    },
    [navigate],
  );

  // ── Live sidebar updates: preview, unread count and ordering ──
  useEffect(() => {
    const unsubscribe = onMessageSent((message) => {
      const listKey = CHAT_QUERY_KEY.conversations();
      const cached = queryClient.getQueryData<ConversationsData>(listKey);

      const isKnown = cached?.pages.some((page) =>
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

    const unsubscribeReconnected = onChatReconnected(() => {
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEY.conversations(),
      });
    });

    return () => {
      unsubscribe();
      unsubscribeReconnected();
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="page-container flex flex-col min-h-0">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
          <ChatSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container flex flex-col min-h-0">
        <AppError
          message={handleErrorMessage(error).title}
          link="العودة إلى لوحة التحكم"
          to="/admin/dashboard"
          onRetry={() => {
            navigate("/admin/dashboard");
          }}
        />
      </div>
    );
  }

  if (isMobile && selectedId) {
    return (
      <div className="flex h-[calc(100svh-4rem)] min-h-0 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-line bg-white px-4 py-3">
          <Link
            to={adminChatPath()}
            className="flex cursor-pointer items-center gap-2 text-sm font-bold text-teal-dark"
          >
            <span className="text-[0.75rem]">←</span>
            <span>Inbox</span>
          </Link>
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {selectedConversation?.studentName ?? "محادثة"}
          </Badge>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">
          {selectedId != null ? (
            <AdminChatConversation
              key={selectedId}
              conversationId={selectedId}
              initialConversation={selectedConversation ?? undefined}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center pt-10">
              <ChatEmptyState
                heading="اختر طالباً"
                description="اختر محادثة من القائمة لعرض رسائلها والرد عليها."
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  const conversationsList = (
    <ConversationsListView
      conversations={conversations}
      selectedId={selectedId}
      onSelect={handleSelectConversation}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => {
        void fetchNextPage();
      }}
    />
  );

  return (
    <div className="page-container flex h-[calc(100svh-4rem)] min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 flex-none items-center justify-center rounded-xl bg-teal-soft font-extrabold text-teal-dark">
            <span className="text-sm">دعم</span>
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight text-ink">Inbox</h2>
            <p className="text-[0.7rem] leading-none text-body-mute">
              Student conversations with the support team
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-body-mute sm:flex">
          <span>{conversations.length} conversations</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 lg:hidden">
        <div className="flex w-full flex-col border-r border-line">
          {conversationsList}
        </div>
      </div>

      <div className="hidden min-h-0 flex-1 overflow-hidden lg:flex">
        <div className="flex w-full flex-col border-r border-line lg:w-[420px]">
          {conversationsList}
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          {selectedId != null ? (
            <AdminChatConversation
              key={selectedId}
              conversationId={selectedId}
              initialConversation={selectedConversation ?? undefined}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center pt-10">
              <ChatEmptyState
                heading="اختر طالباً من القائمة"
                description="حدد محادثة لعرض رسائلها والرد على الطالب في الوقت الفعلي."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationsListView({
  conversations,
  selectedId,
  onSelect,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  conversations: ConversationDto[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-10 text-center">
            <ChatEmptyState
              heading="لا توجد محادثات"
              description="عندما يرسل طالب رسالة للمرة الأولى، ستظهر محادثته هنا."
            />
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <ConversationSidebarItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-teal-dark transition-colors hover:bg-teal-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetchingNextPage && <Spinner className="size-4" />}
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
