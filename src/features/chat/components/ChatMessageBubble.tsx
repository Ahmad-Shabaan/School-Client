import type { ChatMessageDto } from "../types/chat.types";
import { formatChatTime } from "../utils/chatDate";

interface ChatMessageBubbleProps {
  message: ChatMessageDto;
  isMine: boolean;
}

export default function ChatMessageBubble({
  message,
  isMine,
}: ChatMessageBubbleProps) {
  const isRead = message.readAt != null;
  const time = formatChatTime(message.createdAt);

  return (
    <div
      className="w-full flex gap-2 pt-1.5"
      style={{ textAlign: isMine ? "end" : "start" }}
    >
      <div
        className={`
          inline-block max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-6
          shadow-sm
          ${isMine
            ? "bg-gold-soft text-teal-dark border border-gold/40"
            : "bg-white border border-line text-body"
          }
        `.trim()}
      >
        <p className="whitespace-pre-line break-words">{message.content}</p>
        <div className="flex items-baseline gap-1 mt-1 text-[0.65rem] leading-none">
          <span className={isMine ? "text-teal-dark/60" : "text-body-mute/70"}>
            {time}
          </span>
          {isMine && isRead && (
            <>
              <span className="opacity-50">·</span>
              <span className="text-gold/70 font-extrabold">seen</span>
            </>
          )}
          {!isMine && (
            <span className="text-body-mute/70">{message.senderName}</span>
          )}
        </div>
      </div>
    </div>
  );
}
