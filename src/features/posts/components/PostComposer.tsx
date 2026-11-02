import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/store/hooks";
import { MAX_POST_LENGTH } from "../constants/posts.constants";
import { getInitials } from "../utils/postFormat";

interface PostComposerProps {
  onSubmit: (content: string) => Promise<unknown>;
  isSubmitting: boolean;
}

const PostComposer = ({ onSubmit, isSubmitting }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const user = useAppSelector((state) => state.auth.user);
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
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-line bg-white p-4 shadow-[0_4px_12px_rgba(22,48,42,0.03)] sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-teal-soft to-gold-soft text-sm font-extrabold text-teal-dark">
          {getInitials(
            user ? `${user.firstName} ${user.lastName}` : "",
          )}
        </span>

        <div className="min-w-0 flex-1">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={MAX_POST_LENGTH}
            rows={4}
            placeholder="شارك فكرة أو سؤالاً مع زملائك..."
            aria-label="نص المنشور"
            disabled={isSubmitting}
            className="min-h-28 resize-y border-line bg-paper/60 focus-visible:bg-white"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-body-mute">
              {content.length}/{MAX_POST_LENGTH}
            </span>

            <Button
              type="submit"
              variant="brand"
              disabled={!canSubmit}
              className="px-4"
            >
              {isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
              نشر المنشور
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostComposer;
