import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import LessonCard from "../components/LessonCard";
import { courseLessonsQueryOptions } from "@/features/admin/options/lessons.options";
import StudentCourseSkeleton from "../components/StudentCourseSkeleton";
import { ROUTES } from "@/config/routes";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";

const StudentCourse = () => {
  const { id } = useParams();
  const courseId = Number(id);

  const { data, isLoading, isError } = useQuery(
    courseLessonsQueryOptions(courseId),
  );

  const lessons = data?.data ?? [];

  if (isLoading) return <StudentCourseSkeleton />;

  if (isError)
    return (
      <AppError
        message="تعذر تحميل الدروس. حاول مرة أخرى لاحقاً."
        link="العودة الي الملف الشخصي"
        to={ROUTES.Student.basePath}
      />
    );

  return (

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9 sm:pb-[50px]">
          <section className="mb-9 text-center">
            <h1 className="text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">
              الدروس
            </h1>
            <div className="mx-auto my-2 w-10 rounded-[2px] bg-gold" />
            <p className="text-sm text-body-mute sm:text-[0.95rem]">
              اختر الدرس الذي تريد متابعته
            </p>
          </section>

          <section>
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
        </div>
      </main>
  );
};

export default StudentCourse;
