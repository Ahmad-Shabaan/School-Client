import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import PostsConnection from "@/features/posts/components/PostsConnection";
import PostSkeleton from "@/features/posts/components/PostSkeleton";
import { ROUTES } from "@/config/routes";
import CourseAccessDenied from "../components/CourseAccessDenied";
import CoursePageShell from "../components/CoursePageShell";
import { useStudentCourse } from "../hooks/useStudentCourse";

const CoursePostsSkeleton = () => (
  <main className="w-full flex-1">
    <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-12 sm:px-5 sm:py-9">
      <div className="mb-7 rounded-[18px] border border-line bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 flex-none rounded-2xl" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="mt-2 h-6 w-48 rounded-md" />
          </div>
        </div>
        <Skeleton className="mt-4 h-4 w-full rounded-md" />
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
      </div>

      <PostSkeleton count={3} />
    </div>
  </main>
);

const CoursePostsLayout = () => {
  const { courseId: courseIdParam } = useParams();
  const courseId = Number(courseIdParam);
  const { course, isLoading, isError, error, refetch } =
    useStudentCourse(courseId);

  if (isLoading) return <CoursePostsSkeleton />;

  if (isError) {
    return (
      <AppError
        message={handleErrorMessage(error).title}
        link="العودة إلى المقررات"
        to={ROUTES.Student.basePath}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!course) {
    return (
      <CourseAccessDenied
        message={
          Number.isFinite(courseId) && courseId > 0
            ? "أنت غير مسجل في هذا المقرر، لذلك لا يمكنك الوصول إلى منشوراته."
            : "رابط المقرر غير صالح. اختر أحد مقرراتك من صفحة المقررات."
        }
      />
    );
  }

  return (
    <>
      <PostsConnection courseId={course.id} />

      <CoursePageShell
        course={course}
        courseId={course.id}
        activeTab="posts"
        width="narrow"
      >
        <Suspense fallback={<PostSkeleton count={3} />}>
          <Outlet />
        </Suspense>
      </CoursePageShell>
    </>
  );
};

export default CoursePostsLayout;
