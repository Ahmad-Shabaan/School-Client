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

const CourseShellBone = ({
  className,
  delay = 0,
  tone = "brand",
}: {
  className?: string;
  delay?: number;
  tone?: "brand" | "paper";
}) => <Skeleton tone={tone} className={className} delay={delay} />;

const CoursePostsSkeleton = () => (
  <main className="w-full flex-1">
    <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-12 sm:px-5 sm:py-9">
      <div
        role="status"
        aria-busy="true"
        aria-label="جارٍ تحميل المنشورات"
      >
        <span className="sr-only">جارٍ التحميل…</span>

        {/* Course shell */}
        <section className="mb-7 overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_4px_14px_rgba(22,48,42,0.04)]">
          <div className="border-b border-line bg-gradient-to-l from-teal-soft/70 via-paper to-gold-soft/50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <CourseShellBone
                  className="size-12 flex-none rounded-2xl border border-gold/40"
                  delay={0.02}
                />
                <div className="min-w-0">
                  <CourseShellBone className="h-3 w-20" delay={0.04} />
                  <CourseShellBone
                    className="mt-2 h-6 w-48 max-w-full"
                    delay={0.06}
                  />
                </div>
              </div>

              <CourseShellBone
                className="h-[34px] w-24 flex-none rounded-[10px]"
                delay={0.08}
              />
            </div>

            <CourseShellBone
              className="mt-4 h-4 w-full max-w-3xl"
              delay={0.1}
            />
          </div>

          <nav className="flex gap-2 p-3" aria-hidden="true">
            <CourseShellBone
              className="h-10 flex-1 rounded-xl sm:flex-none sm:px-6 sm:w-32"
              delay={0.12}
            />
            <CourseShellBone
              className="h-10 flex-1 rounded-xl sm:flex-none sm:px-6 sm:w-32"
              delay={0.14}
              tone="paper"
            />
          </nav>
        </section>

        {/* Posts heading */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2" aria-hidden="true">
          <div>
            <CourseShellBone
              className="h-5 w-32 sm:h-6 sm:w-36"
              delay={0.16}
            />
            <CourseShellBone
              className="mt-2 h-4 w-52 max-w-full"
              delay={0.18}
            />
          </div>
          <CourseShellBone
            className="h-6 w-16 rounded-full"
            delay={0.2}
          />
        </div>

        <PostSkeleton count={3} />
      </div>
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
