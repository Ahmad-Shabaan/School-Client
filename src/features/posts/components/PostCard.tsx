import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/store/hooks";
import { studentCoursePostPath } from "@/config/routes";
import { MAX_POST_LENGTH } from "../constants/posts.constants";
import { useDeletePost, useUpdatePost } from "../hooks/usePosts";
import type { PostDto } from "../types/post.types";
import { formatDateTime, formatRelativeTime, getInitials } from "../utils/postFormat";
import CommentsSection from "./CommentsSection";

interface PostCardProps {
  post: PostDto;
  isDetails?: boolean;
  onDeleted?: () => void;
}

const PostCard = ({ post, isDetails = false, onDeleted }: PostCardProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);

  const isAuthor = user?.id === post.authorId;
  const trimmedDraft = draft.trim();
  const totalComments = post.comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  );

  const startEditing = () => {
    setDraft(post.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!trimmedDraft || updatePost.isPending) return;

    try {
      await updatePost.mutateAsync({
        id: post.id,
        content: trimmedDraft,
      });
      setIsEditing(false);
    } catch {
      return;
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post.id);
      onDeleted?.();
    } catch {
      return;
    }
  };

  return (
    <article className="overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_4px_14px_rgba(22,48,42,0.04)]">
      <header className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-teal-soft to-gold-soft text-sm font-extrabold text-teal-dark">
            {getInitials(post.authorName)}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-teal-dark">
              {post.authorName}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-body-mute">
              <time
                dateTime={post.createdAt}
                title={formatDateTime(post.createdAt)}
              >
                {formatRelativeTime(post.createdAt)}
              </time>
              {post.updatedAt && <span>تم التعديل</span>}
            </div>
          </div>
        </div>

        {isAuthor && (
          <div className="flex flex-none items-center gap-1">
            <button
              type="button"
              onClick={startEditing}
              aria-label="تعديل المنشور"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-body-mute transition-colors hover:bg-teal-soft hover:text-teal-dark"
            >
              <Pencil className="size-4" />
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  aria-label="حذف المنشور"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-body-mute transition-colors hover:bg-error/10 hover:text-error-dim"
                >
                  <Trash2 className="size-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl" className="font-tajawal">
                <AlertDialogHeader>
                  <AlertDialogTitle>حذف المنشور</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيتم حذف هذا المنشور وجميع تعليقاته. لا يمكن التراجع عن
                    هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={deletePost.isPending}
                    onClick={() => {
                      void handleDelete();
                    }}
                  >
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </header>

      <div className="px-4 pb-3 sm:px-5">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_POST_LENGTH}
              rows={4}
              autoFocus
              aria-label="تعديل نص المنشور"
              className="min-h-28 bg-paper/60 focus-visible:bg-white"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-body-mute">
                {draft.length}/{MAX_POST_LENGTH}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={updatePost.isPending}
                  className="text-body-mute hover:bg-line/60 hover:text-ink"
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  onClick={() => void handleSave()}
                  disabled={!trimmedDraft || updatePost.isPending}
                >
                  {updatePost.isPending ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  حفظ
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-8 text-body">
            {post.content}
          </p>
        )}
      </div>

      <div className="px-4 pb-3 sm:px-5">
        {isDetails ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-body-mute">
            <MessageCircle className="size-3.5" />
            {totalComments} تعليق
          </span>
        ) : (
          <Link
            to={studentCoursePostPath(post.courseId, post.id)}
            className="inline-flex items-center gap-1.5 rounded-md text-xs font-bold text-teal-dark transition-colors hover:text-gold"
          >
            <MessageCircle className="size-3.5" />
            {totalComments} تعليق
            <span className="text-body-mute">·</span>
            عرض المنشور
            <ArrowLeft className="size-3.5" />
          </Link>
        )}
      </div>

      <CommentsSection post={post} />
    </article>
  );
};

export default PostCard;
