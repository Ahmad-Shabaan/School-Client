import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Newspaper } from "lucide-react";
import type { CourseDto } from "@/features/admin/types/course.types";
import {
  ROUTES,
  studentCoursePath,
  studentCoursePostsPath,
} from "@/config/routes";

type CourseTab = "lessons" | "posts";

interface CoursePageShellProps {
  course: CourseDto;
  courseId: number;
  activeTab: CourseTab;
  width?: "narrow" | "wide";
  children: ReactNode;
}

const tabClassName =
  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 sm:flex-none sm:px-6";

const CoursePageShell = ({
  course,
  courseId,
  activeTab,
  width = "wide",
  children,
}: CoursePageShellProps) => (
  <main className="w-full flex-1">
    <div
      className={`mx-auto w-full ${
        width === "narrow" ? "max-w-3xl" : "max-w-275"
      } px-4 py-8 pb-12 sm:px-5 sm:py-9 sm:pb-[50px]`}
    >
      <section className="mb-7 overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_4px_14px_rgba(22,48,42,0.04)]">
        <div className="border-b border-line bg-gradient-to-l from-teal-soft/70 via-paper to-gold-soft/50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-12 flex-none items-center justify-center rounded-2xl border border-gold/40 bg-white text-teal-dark shadow-sm">
                <GraduationCap className="size-6" />
              </span>

              <div className="min-w-0">
                <span className="text-[0.7rem] font-extrabold tracking-wide text-body-mute">
                  المقرر الدراسي
                </span>
                <h1 className="break-words text-xl font-extrabold text-ink sm:text-2xl">
                  {course.courseName}
                </h1>
              </div>
            </div>

            <Link
              to={ROUTES.Student.basePath}
              className="inline-flex w-fit flex-none items-center justify-center rounded-[10px] border border-line bg-white px-3 py-2 text-xs font-bold text-teal-dark transition-colors duration-200 hover:border-gold hover:bg-paper"
            >
              كل المقررات
            </Link>
          </div>

          {course.description && (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-body-mute">
              {course.description}
            </p>
          )}
        </div>

        <nav className="flex gap-2 p-3" aria-label="أقسام المقرر">
          <Link
            to={studentCoursePath(courseId)}
            aria-current={activeTab === "lessons" ? "page" : undefined}
            className={`${tabClassName} ${
              activeTab === "lessons"
                ? "bg-teal-dark text-white shadow-[0_4px_12px_rgba(22,48,42,0.16)]"
                : "text-teal-dark hover:bg-teal-soft"
            }`}
          >
            <BookOpen className="size-4" />
            الدروس
          </Link>

          <Link
            to={studentCoursePostsPath(courseId)}
            aria-current={activeTab === "posts" ? "page" : undefined}
            className={`${tabClassName} ${
              activeTab === "posts"
                ? "bg-teal-dark text-white shadow-[0_4px_12px_rgba(22,48,42,0.16)]"
                : "text-teal-dark hover:bg-teal-soft"
            }`}
          >
            <Newspaper className="size-4" />
            المنشورات
          </Link>
        </nav>
      </section>

      {children}
    </div>
  </main>
);

export default CoursePageShell;
