import { ChevronRight, MessageSquare, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ConversationDto } from "../types/chat.types";
import { MAX_CHAT_BADGE_COUNT } from "../constants/chat.constants";
import { formatChatDate } from "../utils/chatDate";

interface ConversationSidebarItemProps {
  conversation: ConversationDto;
  isSelected: boolean;
  onSelect: (conversationId: number) => void;
}

const PREVIEW_MAX_LENGTH = 60;

export default function ConversationSidebarItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationSidebarItemProps) {
  const hasUnread = conversation.unreadCount > 0;
  const preview =
    conversation.lastMessage?.slice(0, PREVIEW_MAX_LENGTH) ??
    "بدء محادثة جديدة";
  const time = conversation.lastMessageAt
    ? formatChatDate(conversation.lastMessageAt)
    : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      aria-label={`محادثة مع ${conversation.studentName}`}
      className={`
        flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors
        ${isSelected
          ? "border-teal bg-teal-soft text-teal-dark"
          : "border-transparent text-body hover:border-line hover:bg-paper"}
      `}
    >
      <div className="flex size-8 flex-none items-center justify-center rounded-lg bg-white/60 text-teal-dark">
        <User className="size-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`truncate ${
              isSelected ? "font-bold" : "font-medium"
            }`}
          >
            {conversation.studentName}
          </span>
          {hasUnread && (
            <Badge variant="outline" className="px-2 text-xs">
              {conversation.unreadCount > MAX_CHAT_BADGE_COUNT
                ? `${MAX_CHAT_BADGE_COUNT}+`
                : conversation.unreadCount}
            </Badge>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-body-mute/90">{preview}</p>
        <div className="mt-0.5 flex items-center gap-1 text-[0.65rem] leading-none text-body-mute/70">
          {time && <span>{time}</span>}
          <ChevronRight className="size-3 opacity-40" />
        </div>
      </div>
      <MessageSquare className="size-4 shrink-0 opacity-50" />
    </button>
  );
}
