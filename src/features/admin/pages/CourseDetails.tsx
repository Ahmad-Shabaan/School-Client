import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BookOpen,
  ChevronRight,
  Layers,
  ListChecks,
  Lock,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/shared/components/common/PageHeader";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { ROUTES } from "@/config/routes";
import { courseQueryOptions } from "../options/courses.options";
import { courseLessonsQueryOptions } from "../options/lessons.options";
import { useCreateLesson } from "../hooks/useLessons";
import { useEnrollStudentsInCourse } from "../hooks/useCourses";
import EnrollStudentsForm from "../components/EnrollStudentsForm";
import CreateLessonForm from "../components/CreateLessonForm";
import type { LessonFormValues } from "@/lib/utils/validation";
import type { CreateLessonRequest } from "../types/lesson.types";

const CourseDetails = () => {
  const { id } = useParams();
  const courseId = Number(id);

  const {
    data: courseData,
    isLoading: courseIsLoading,
    isError: courseIsError,
    error: courseError,
    refetch: refetchCourse,
  } = useQuery(courseQueryOptions(courseId));

  const {
    data: lessonsData,
    isLoading: lessonsIsLoading,
    isError: lessonsIsError,
    error: lessonsError,
    refetch: refetchLessons,
  } = useQuery(courseLessonsQueryOptions(courseId));

  const {
    handleCreateLesson,
    isLoading: createLessonIsLoading,
    isError: createLessonIsError,
    error: createLessonError,
  } = useCreateLesson();

  const {
    handleEnrollStudents,
    isLoading: enrollStudentsIsLoading,
    isError: enrollStudentsIsError,
    error: enrollStudentsError,
  } = useEnrollStudentsInCourse();

  const course = courseData?.data;
  const lessons = lessonsData?.data ?? [];

  const handleEnrollSubmit = (studentEmails: string[]) => {
    handleEnrollStudents(courseId, studentEmails);
  };

  const handleCreateLessonSubmit = (values: LessonFormValues) => {
    const request: CreateLessonRequest = {
      courseId,
      title: values.title,
      description: values.description,
      youtubeUrl: values.youtubeUrl?.trim() || null,
      meetingUrl: values.meetingUrl?.trim() || null,
      meetingDateTime: values.meetingDateTime
        ? new Date(values.meetingDateTime).toISOString()
        : null,
      goals: values.goals.map((goal) => goal.text.trim()).filter(Boolean),
      resources: values.resources.map((resource) => ({
        title: resource.title.trim(),
        fileUrl: resource.fileUrl.trim(),
        fileType: resource.fileType?.trim() || null,
      })),
    };
    handleCreateLesson(request);
  };

  if (courseIsLoading || lessonsIsLoading) {
    return (
      <div className="page-container">
        <div className="space-y-8">
          <Skeleton className="h-10 w-72" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (courseIsError) {
    return (
      <AppError
        message={courseError.title}
        link="Back to Courses"
        to={ROUTES.Admin.courses}
        onRetry={refetchCourse}
      />
    );
  }

  if (lessonsIsError) {
    return (
      <AppError
        message={lessonsError.title}
        link="Back to Courses"
        to={ROUTES.Admin.courses}
        onRetry={refetchLessons}
      />
    );
  }

  const totalLessons = lessons.length;
  const lessonsWithQuiz = lessons.filter((lesson) => lesson.hasQuiz).length;
  const completedLessons = lessons.filter((lesson) => lesson.isCompleted).length;

  const stats = [
    {
      label: "Total Lessons",
      value: String(totalLessons),
      icon: Layers,
      color: "text-primary",
    },
    {
      label: "Lessons with Quiz",
      value: String(lessonsWithQuiz),
      icon: ListChecks,
      color: "text-secondary",
    },
    {
      label: "Completed Lessons",
      value: String(completedLessons),
      icon: Award,
      color: "text-emerald-500",
    },
    {
      label: "Enrolled Students",
      value: "—",
      icon: Users,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="page-container">
      <div className="space-y-8">
        <PageHeader
          title={course?.courseName ?? "Course"}
          description="Course overview, lessons, and performance metrics"
        >
          <CreateLessonForm
            onSubmit={handleCreateLessonSubmit}
            isLoading={createLessonIsLoading}
            isError={createLessonIsError}
            error={createLessonError}
          />
        </PageHeader>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/admin/courses"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Courses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            {course?.courseName ?? "Course"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/40">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border/30">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Course Info */}
          <Card className="lg:col-span-2 border-border/40">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold text-foreground">
                About This Course
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course?.description ||
                  "No description has been provided for this course yet."}
              </p>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card className="border-border/40">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <EnrollStudentsForm
                onSubmit={handleEnrollSubmit}
                isLoading={enrollStudentsIsLoading}
                isError={enrollStudentsIsError}
                error={enrollStudentsError}
                courseId={courseId}
              />
              <CreateLessonForm
                onSubmit={handleCreateLessonSubmit}
                isLoading={createLessonIsLoading}
                isError={createLessonIsError}
                error={createLessonError}
              />
            </CardContent>
          </Card>
        </div>

        {/* Lessons */}
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Course Lessons
                </h2>
                <p className="text-sm text-muted-foreground">
                  {totalLessons}{" "}
                  {totalLessons === 1 ? "lesson" : "lessons"} in this course
                </p>
              </div>
              <CreateLessonForm
                onSubmit={handleCreateLessonSubmit}
                isLoading={createLessonIsLoading}
                isError={createLessonIsError}
                error={createLessonError}
              />
            </div>
          </CardHeader>
          <CardContent>
            {totalLessons === 0 ? (
              <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-8 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No lessons yet. Create the first lesson for this course.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/30">
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      to={`/admin/lessons/${lesson.id}`}
                      className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-accent/40 rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-background text-xs font-bold text-muted-foreground">
                          {lesson.order}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {lesson.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {lesson.hasQuiz && (
                              <Badge variant="secondary">
                                <ListChecks className="h-3 w-3" />
                                Quiz
                              </Badge>
                            )}
                            {lesson.isCompleted && (
                              <Badge variant="success">
                                <Award className="h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            {!lesson.isUnlocked && (
                              <Badge variant="warning">
                                <Lock className="h-3 w-3" />
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;
