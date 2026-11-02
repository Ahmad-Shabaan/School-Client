import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { MAX_CHAT_MESSAGE_LENGTH } from "../constants/chat.constants";

interface ChatComposerProps {
  onSend: (content: string) => Promise<void>;
  isSending: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatComposer({
  onSend,
  isSending,
  disabled = false,
  placeholder = "اكتب رسالتك...",
}: ChatComposerProps) {
  const [content, setContent] = useState("");
  const submittingRef = useRef(false);

  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !isSending && !disabled;

  const send = async () => {
    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;

    try {
      await onSend(trimmedContent);
      setContent("");
    } catch {
      // The mutation already surfaces the failure to the user.
    } finally {
      submittingRef.current = false;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await send();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-line bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 flex-none shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-soft to-gold-soft text-sm font-extrabold text-teal-dark sm:size-10">
          {"أ"}
        </span>
        <div className="min-w-0 flex-1">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={MAX_CHAT_MESSAGE_LENGTH}
            rows={1}
            placeholder={placeholder}
            aria-label="رسالة"
            disabled={disabled || isSending}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-[140px] resize-none border-line bg-paper/60 focus-visible:bg-white"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs text-body-mute">
              {content.length}/{MAX_CHAT_MESSAGE_LENGTH}
            </span>
            <Button
              type="submit"
              variant="brand"
              disabled={!canSubmit}
              className="px-4"
            >
              {isSending ? (
                <Spinner className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
