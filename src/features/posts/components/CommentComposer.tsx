import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { MAX_COMMENT_LENGTH } from "../constants/posts.constants";

interface CommentComposerProps {
  onSubmit: (content: string) => Promise<unknown>;
  isSubmitting: boolean;
  placeholder?: string;
  submitLabel?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

const CommentComposer = ({
  onSubmit,
  isSubmitting,
  placeholder = "اكتب تعليقاً...",
  submitLabel = "تعليق",
  onCancel,
  autoFocus = false,
}: CommentComposerProps) => {
  const [content, setContent] = useState("");
  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      await onSubmit(trimmedContent);
      setContent("");
    } catch {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={MAX_COMMENT_LENGTH}
        rows={2}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={isSubmitting}
        autoFocus={autoFocus}
        className="min-h-16 border-line bg-paper/60 text-sm focus-visible:bg-white"
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-body-mute hover:bg-line/60 hover:text-ink"
          >
            إلغاء
          </Button>
        )}
        <Button
          type="submit"
          variant="brand"
          size="sm"
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <Send className="size-3.5" />
          )}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default CommentComposer;
