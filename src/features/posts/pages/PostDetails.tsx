import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { studentCoursePostsPath } from "@/config/routes";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { usePost } from "../hooks/usePosts";

const PostDetails = () => {
  const { courseId: courseIdParam, postId: postIdParam } = useParams();
  const courseId = Number(courseIdParam);
  const postId = Number(postIdParam);
  const navigate = useNavigate();
  const backTo = studentCoursePostsPath(courseId);

  const isValidPostId = Number.isFinite(postId) && postId > 0;
  const { data, isLoading, isError, error, refetch } = usePost(postId);

  if (!isValidPostId) {
    return (
      <AppError
        message="معرّف المنشور غير صالح."
        link="العودة إلى منشورات المقرر"
        to={backTo}
      />
    );
  }

  const post = data?.data;
  const isCourseMismatch = Boolean(post && post.courseId !== courseId);

  return (
    <section>
      <Link
        to={backTo}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-body-mute transition-colors hover:text-teal-dark"
      >
        <ArrowRight className="size-4" />
        العودة إلى منشورات المقرر
      </Link>

      {isLoading ? (
        <PostSkeleton count={1} />
      ) : isCourseMismatch ? (
        <AppError
          message="هذا المنشور لا يتبع للمقرر المحدد."
          link="العودة إلى منشورات المقرر"
          to={backTo}
        />
      ) : isError || !post ? (
        <AppError
          message={handleErrorMessage(error).title}
          link="العودة إلى منشورات المقرر"
          to={backTo}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <PostCard
          post={post}
          isDetails
          onDeleted={() => navigate(backTo, { replace: true })}
        />
      )}
    </section>
  );
};

export default PostDetails;
