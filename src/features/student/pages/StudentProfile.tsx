import StudentHeader from "../components/StudentHeader";
import StudentInfoCard from "../components/StudentInfoCard";
import CourseCard from "../components/CourseCard";
import StudentFooter from "../components/StudentFooter";
import { coursesQueryOptions } from "../options/student.options";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/config/routes";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { Navigate } from "react-router-dom";
import StudentProfileSkeleton from "../components/StudentProfileSkeleton";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";

const StudentProfile = () => {
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading, isError, error } = useQuery(
    coursesQueryOptions(user?.email),
  );

  if (user === null) {
    return <Navigate to={"/login"} replace />;
  }
  const courses = data?.data ?? [];
  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-svh flex-col bg-paper font-tajawal text-body"
    >
      <StudentHeader />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-250 px-5 py-7 sm:py-8">
          {isLoading ? (
            <StudentProfileSkeleton />
          ) : isError ? (
            <AppError
              message={error.title}
              link="Back to Home"
              to={ROUTES.Student.basePath}
            />
          ) : (
            <>
              <section className="mb-8 text-center">
                <h1 className="text-2xl font-extrabold text-ink sm:text-[1.8rem]">
                  الملف الشخصي
                </h1>
                <div className="mx-auto my-0.75 w-10 rounded-[2px] bg-gold" />
                <p className="text-sm text-body-mute sm:text-[0.95rem]">
                  مرحبًا بك في حسابك، تابع مستواك الدراسي والمقررات الخاصة بك.
                </p>
              </section>

              <StudentInfoCard student={user} />

              <section>
                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-ink sm:text-2xl">
                    المقررات الدراسية
                  </h2>
                  <p className="mt-1 text-sm text-body-mute">
                    المقررات المسجل بها حاليًا
                  </p>
                </div>

                {courses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-line bg-teal-soft text-teal-dark">
                      <BookOpen className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">
                      لا توجد مقررات بعد
                    </h3>
                    <p className="max-w-sm text-sm text-body-mute">
                      لم يتم تسجيلك في أي مقرر حتى الآن. ستظهر مقرراتك هنا بمجرد
                      إضافتها.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default StudentProfile;
