import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowUpRight, BookOpen, Layers } from "lucide-react";
import Toolbar from "../components/Toolbar";
import PageHeader from "@/shared/components/common/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { coursesQueryOptions } from "../options/courses.options";
import CoursesSkeleton from "../components/CoursesSkeleton";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { ROUTES } from "@/config/routes";
import CreateCourseForm from "../components/CreateCourseForm";
import UpdateCourseForm from "../components/UpdateCourseForm";
import DeleteCourseAlert from "../components/DeleteCourseAlert";
import { useCreateCourse } from "../hooks/useCourses";
import type { CreateCourseFormValues } from "@/lib/utils/validation";
import type { CourseRequestDto } from "../types/course.types";
import { useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";

const Courses = () => {
  const { data, isLoading, isError, error } = useQuery(coursesQueryOptions());
  const userEmail = useAppSelector((state) => state.auth.user?.email ?? "");
  const {
    handleCreateCourse,
    isLoading: createCourseIsLoading,
    isError: createCourseIsError,
    error: createCourseError,
  } = useCreateCourse();

  const courses = data?.data ?? [];
  const isEmpty = !isLoading && !isError && courses.length === 0;

  const handleSubmit = (values: CreateCourseFormValues) => {
    const course: CourseRequestDto = {
      Name: values.name,
      Description: values.description,
      File: values.file,
      Email: userEmail,
    };
    handleCreateCourse(course);
  };

  const createForm = (
    <CreateCourseForm
      onSubmit={handleSubmit}
      isLoading={createCourseIsLoading}
      isError={createCourseIsError}
      error={createCourseError}
    />
  );

  if (isLoading) {
    return <CoursesSkeleton />;
  }
  if (isError)
    return (
      <AppError
        message={error.title}
        link="Back to Dashboard"
        to={ROUTES.Admin.basePath}
      />
    );

  return (
    <div className="page-container">
      <div className="space-y-6">
        <PageHeader
          title="Courses"
          description="Manage and organize your course catalog"
        >
          {createForm}
        </PageHeader>

        <Toolbar />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface-container-low/50 px-6 py-16 text-center animate-[fadeInUp_0.5s_ease-out_both]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No courses yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Get started by creating your first course. Once added, it will
              appear here in your catalog.
            </p>
            <div className="mt-5">{createForm}</div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span>
                <span className="font-semibold text-foreground">
                  {courses.length}
                </span>{" "}
                {courses.length === 1 ? "course" : "courses"} in your catalog
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <Card
                  key={course.id}
                  style={{ animationDelay: `${index * 55}ms` }}
                  className="group relative flex flex-col gap-0 overflow-hidden rounded-2xl border-border/40 bg-surface-container-lowest py-0 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover animate-[fadeInUp_0.5s_ease-out_both]"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-container">
                    {course.file ? (
                      <img
                        src={`data:image/png;base64,${course.file}`}
                        alt={course.courseName}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                      />
                    ) : (
                      <div className="gradient-primary flex h-full w-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-on-primary/90" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-18deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

                    <span className="gradient-primary shadow-glow-primary absolute left-3 top-3 flex size-9 items-center justify-center rounded-xl text-on-primary">
                      <BookOpen className="size-4" />
                    </span>

                    <span className="pointer-events-none absolute -bottom-3 right-3 select-none font-serif text-6xl font-bold leading-none text-white/25 transition-colors duration-300 group-hover:text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <CardHeader className="gap-2 px-5 pt-5 pb-0">
                    <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {course.courseName}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardFooter className="mt-4 flex items-center justify-between gap-2 border-t border-border/30 px-5 py-3.5">
                    <Link
                      to={`/admin/courses/${course.id}`}
                      className="group/link inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      View Details
                      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <UpdateCourseForm course={course} />
                      <DeleteCourseAlert
                        courseId={course.id}
                        courseName={course.courseName}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
