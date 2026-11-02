import { useState } from "react";
import { Check, Pencil, Reply, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { MAX_COMMENT_LENGTH } from "../constants/posts.constants";
import type { CommentDto } from "../types/post.types";
import { formatDateTime, formatRelativeTime, getInitials } from "../utils/postFormat";
import CommentComposer from "./CommentComposer";

interface CommentItemProps {
  comment: CommentDto;
  currentUserId?: string;
  canModerate: boolean;
  isReply?: boolean;
  onUpdate: (commentId: number, content: string) => Promise<unknown>;
  onDelete: (commentId: number) => Promise<unknown>;
  onReply: (parentCommentId: number, content: string) => Promise<unknown>;
  isUpdating: boolean;
  isDeleting: boolean;
  isReplying: boolean;
}

const CommentItem = ({
  comment,
  currentUserId,
  canModerate,
  isReply = false,
  onUpdate,
  onDelete,
  onReply,
  isUpdating,
  isDeleting,
  isReplying,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const isAuthor = currentUserId === comment.authorId;
  const canDelete = isAuthor || canModerate;
  const trimmedDraft = draft.trim();

  const startEditing = () => {
    setDraft(comment.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!trimmedDraft || isUpdating) return;

    try {
      await onUpdate(comment.id, trimmedDraft);
      setIsEditing(false);
    } catch {
      return;
    }
  };

  const handleReply = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplyOpen(false);
  };

  return (
    <li className={cn("text-sm", isReply && "text-[0.925rem]")}>
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex flex-none items-center justify-center rounded-full bg-teal-soft font-extrabold text-teal-dark",
            isReply ? "size-7 text-[10px]" : "size-8 text-xs",
          )}
        >
          {getInitials(comment.authorName)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-extrabold text-teal-dark">
              {comment.authorName}
            </span>
            <time
              dateTime={comment.createdAt}
              title={formatDateTime(comment.createdAt)}
              className="text-xs text-body-mute"
            >
              {formatRelativeTime(comment.createdAt)}
            </time>
            {comment.updatedAt && (
              <span className="text-[11px] text-body-mute">تم التعديل</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={MAX_COMMENT_LENGTH}
                rows={2}
                autoFocus
                aria-label="تعديل نص التعليق"
                className="min-h-16 bg-paper/60 text-sm focus-visible:bg-white"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                  className="text-body-mute hover:bg-line/60 hover:text-ink"
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  variant="brand"
                  size="xs"
                  onClick={() => void handleSave()}
                  disabled={!trimmedDraft || isUpdating}
                >
                  {isUpdating ? (
                    <Spinner className="size-3" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  حفظ
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap break-words leading-7 text-body">
              {comment.content}
            </p>
          )}

          {!isEditing && (
            <div className="mt-1.5 flex items-center gap-1">
              {!isReply && (
                <button
                  type="button"
                  onClick={() => setIsReplyOpen((open) => !open)}
                  className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs font-bold text-body-mute transition-colors hover:bg-teal-soft hover:text-teal-dark"
                >
                  <Reply className="size-3.5" />
                  رد
                </button>
              )}

              {isAuthor && (
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label="تعديل التعليق"
                  className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs font-bold text-body-mute transition-colors hover:bg-teal-soft hover:text-teal-dark"
                >
                  <Pencil className="size-3.5" />
                  تعديل
                </button>
              )}

              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      aria-label="حذف التعليق"
                      className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs font-bold text-body-mute transition-colors hover:bg-error/10 hover:text-error-dim"
                    >
                      <Trash2 className="size-3.5" />
                      حذف
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl" className="font-tajawal">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف التعليق</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم حذف هذا التعليق
                        {comment.parentCommentId === null && comment.replies.length > 0
                          ? " وجميع الردود التابعة له"
                          : ""}
                        . لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => {
                          void onDelete(comment.id).catch(() => undefined);
                        }}
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}

          {isReplyOpen && !isReply && (
            <div className="mt-2 rounded-lg border border-line bg-paper/50 p-2.5">
              <CommentComposer
                onSubmit={handleReply}
                isSubmitting={isReplying}
                placeholder={`رد على ${comment.authorName}...`}
                submitLabel="رد"
                onCancel={() => setIsReplyOpen(false)}
                autoFocus
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <ul className="mt-3 space-y-3 border-r-2 border-teal-soft pr-3 sm:pr-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  canModerate={canModerate}
                  isReply
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  isReplying={isReplying}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
};

export default CommentItem;
