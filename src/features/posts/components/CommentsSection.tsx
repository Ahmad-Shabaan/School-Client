import { MessageCircle } from "lucide-react";
import { ROLES } from "@/config/constants";
import { useAppSelector } from "@/store/hooks";
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "../hooks/usePosts";
import type { PostDto } from "../types/post.types";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";

interface CommentsSectionProps {
  post: PostDto;
}

const CommentsSection = ({ post }: CommentsSectionProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const canModerate =
    user?.roles.some(
      (role) => role === ROLES.Admin || role === ROLES.Teacher,
    ) ?? false;

  const handleCreateComment = async (content: string) => {
    await createComment.mutateAsync({ postId: post.id, content });
  };

  const handleReply = async (parentCommentId: number, content: string) => {
    await createComment.mutateAsync({
      postId: post.id,
      content,
      parentCommentId,
    });
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    await updateComment.mutateAsync({ id: commentId, content });
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment.mutateAsync({ id: commentId, postId: post.id });
  };

  return (
    <section className="border-t border-line px-4 py-4 sm:px-5">
      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="size-4 text-gold" />
        <h3 className="text-sm font-extrabold text-teal-dark">
          التعليقات
        </h3>
      </div>

      {post.comments.length === 0 ? (
        <p className="mb-4 rounded-lg border border-dashed border-line bg-paper/60 px-3 py-4 text-center text-xs text-body-mute">
          لا توجد تعليقات بعد. كن أول من يشارك رأيه.
        </p>
      ) : (
        <ul className="mb-4 space-y-4">
          {post.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              canModerate={canModerate}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
              isUpdating={updateComment.isPending}
              isDeleting={deleteComment.isPending}
              isReplying={createComment.isPending}
            />
          ))}
        </ul>
      )}

      <CommentComposer
        onSubmit={handleCreateComment}
        isSubmitting={createComment.isPending}
        placeholder="اكتب تعليقاً..."
        submitLabel="تعليق"
      />
    </section>
  );
};

export default CommentsSection;
