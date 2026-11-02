import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import LessonCard from "../components/LessonCard";
import { courseLessonsQueryOptions } from "@/features/admin/options/lessons.options";
import StudentCourseSkeleton from "../components/StudentCourseSkeleton";
import CourseAccessDenied from "../components/CourseAccessDenied";
import CoursePageShell from "../components/CoursePageShell";
import { useStudentCourse } from "../hooks/useStudentCourse";
import { ROUTES } from "@/config/routes";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";

const StudentCourse = () => {
  const { id } = useParams();
  const courseId = Number(id);

  const {
    course,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
  } = useStudentCourse(courseId);

  const {
    data,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    error: lessonsError,
    refetch: refetchLessons,
  } = useQuery({
    ...courseLessonsQueryOptions(courseId),
    enabled: Boolean(course),
  });

  const lessons = data?.data ?? [];

  if (isCourseLoading) return <StudentCourseSkeleton />;

  if (isCourseError) {
    return (
      <AppError
        message={handleErrorMessage(courseError).title}
        link="العودة الي الملف الشخصي"
        to={ROUTES.Student.basePath}
        onRetry={() => {
          void refetchCourse();
        }}
      />
    );
  }

  if (!course) {
    return (
      <CourseAccessDenied
        message={
          Number.isFinite(courseId) && courseId > 0
            ? "أنت غير مسجل في هذا المقرر، لذلك لا يمكنك الوصول إلى دروسه."
            : "رابط المقرر غير صالح. اختر أحد مقرراتك من صفحة المقررات."
        }
      />
    );
  }

  if (isLessonsLoading) return <StudentCourseSkeleton />;

  if (isLessonsError) {
    return (
      <AppError
        message={handleErrorMessage(lessonsError).title}
        link="العودة الي الملف الشخصي"
        to={ROUTES.Student.basePath}
        onRetry={() => {
          void refetchLessons();
        }}
      />
    );
  }

  return (
    <CoursePageShell course={course} courseId={course.id} activeTab="lessons">
      <section aria-labelledby="lessons-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="lessons-heading"
              className="text-lg font-extrabold text-ink sm:text-xl"
            >
              الدروس
            </h2>
            <p className="mt-1 text-sm text-body-mute">
              اختر الدرس الذي تريد متابعته
            </p>
          </div>

          {lessons.length > 0 && (
            <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-extrabold text-teal-dark">
              {lessons.length} درس
            </span>
          )}
        </div>

        {lessons.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-line bg-white p-10 text-center">
            <BookOpen className="mx-auto mb-3 size-10 text-body-mute opacity-40" />
            <p className="text-sm text-body-mute">
              لا توجد دروس متاحة في هذه المادة بعد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </section>
    </CoursePageShell>
  );
};

export default StudentCourse;
