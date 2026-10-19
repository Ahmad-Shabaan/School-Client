import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BookOpen,
  ChevronRight,
  FileText,
  Link2,
  ListChecks,
  Target,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { ROUTES } from "@/config/routes";
import { lessonDetailsQueryOptions } from "../options/lessons.options";
import { useCreateQuiz, useUpdateLesson } from "../hooks/useLessons";
import UpdateLessonForm from "../components/UpdateLessonForm";
import DeleteLessonAlert from "../components/DeleteLessonAlert";
import CreateQuizeForm from "../components/CreateQuizForm";
import QuizManagementCard from "../components/QuizManagementCard";
import type { LessonFormValues } from "@/lib/utils/validation";
import type {
  QuizPayloadRequest,
  UpdateLessonRequest,
} from "../types/lesson.types";

const LessonDetails = () => {
  const { id } = useParams();
  const lessonId = Number(id);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(lessonDetailsQueryOptions(lessonId));

  const {
    handleUpdateLesson,
    isLoading: updateIsLoading,
    isError: updateIsError,
    error: updateError,
  } = useUpdateLesson();

  const {
    handleCreateQuiz,
    isLoading: createQuizIsLoading,
    isError: createQuizIsError,
    error: createQuizError,
  } = useCreateQuiz();

  const lesson = data?.data;

  const handleUpdateSubmit = (values: LessonFormValues) => {
    const request: UpdateLessonRequest = {
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
    handleUpdateLesson(lessonId, request);
  };

  const handleCreateQuizSubmit = (quiz: QuizPayloadRequest) => {
    handleCreateQuiz(lessonId, quiz);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="space-y-6">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <AppError
        message={error.title}
        link="Back to Dashboard"
        to={ROUTES.Admin.basePath}
        onRetry={refetch}
      />
    );
  }

  if (!lesson) return null;

  return (
    <div className="page-container">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to={`/admin/courses/${lesson.courseId}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 hover:bg-accent transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {lesson.title}
                </h1>
                <Badge variant="default">Lesson {lesson.order}</Badge>
                {lesson.access.isVideoCompleted && (
                  <Badge variant="success">
                    <Award className="h-3 w-3" />
                    Video Completed
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Link
                  to={`/admin/courses/${lesson.courseId}`}
                  className="hover:text-foreground transition-colors"
                >
                  Course
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Lesson {lesson.order}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <UpdateLessonForm
              lesson={lesson}
              onSubmit={handleUpdateSubmit}
              isLoading={updateIsLoading}
              isError={updateIsError}
              error={updateError}
            />
            <DeleteLessonAlert
              lessonId={lesson.id}
              courseId={lesson.courseId}
              lessonTitle={lesson.title}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/40">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  About This Lesson
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lesson.description}
                </p>

                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border/30 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border/30">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        YouTube Video
                      </p>
                      <p className="text-sm font-medium text-foreground mt-0.5">
                        {lesson.youTubeVideoId ? (
                          <a
                            href={`https://www.youtube.com/watch?v=${lesson.youTubeVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {lesson.youTubeVideoId}
                          </a>
                        ) : (
                          "No video"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border/30">
                      <Link2 className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Meeting
                      </p>
                      <p className="text-sm font-medium text-foreground mt-0.5">
                        {lesson.meetingUrl ? (
                          <a
                            href={lesson.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Join meeting
                            {lesson.meetingDateTime
                              ? ` • ${new Date(
                                  lesson.meetingDateTime,
                                ).toLocaleString()}`
                              : ""}
                          </a>
                        ) : (
                          "No meeting"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="border-border/40">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Resources
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Supplementary materials for this lesson
                    </p>
                  </div>
                  <Badge variant="outline">
                    {lesson.resources.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {lesson.resources.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No resources added. Use Edit Lesson to attach PDFs or
                      links.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {lesson.resources.map((resource) => (
                      <li
                        key={resource.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/40 px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {resource.title}
                            </p>
                            {resource.fileType && (
                              <p className="text-xs text-muted-foreground">
                                {resource.fileType}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/40">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Learning Goals
                </h2>
              </CardHeader>
              <CardContent>
                {lesson.goals.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-6 text-center">
                    <Target className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No goals added yet.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {lesson.goals.map((goal) => (
                      <li
                        key={goal.id}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {goal.text}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Quiz */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Quiz</h2>
              </div>

              {lesson.hasQuiz ? (
                <QuizManagementCard lessonId={lesson.id} />
              ) : (
                <Card className="border-border/40">
                  <CardContent className="p-6 space-y-4">
                    <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-6 text-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        This lesson does not have a quiz yet. Students must
                        pass the quiz to complete the lesson.
                      </p>
                    </div>
                    <CreateQuizeForm
                      onSubmit={handleCreateQuizSubmit}
                      isLoading={createQuizIsLoading}
                      isError={createQuizIsError}
                      error={createQuizError}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="border-border/40">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Lesson Info
                </h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Order</span>
                  <span className="font-medium text-foreground">
                    {lesson.order}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quiz</span>
                  <span className="font-medium text-foreground">
                    {lesson.hasQuiz ? "Available" : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Goals</span>
                  <span className="font-medium text-foreground">
                    {lesson.goals.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Resources</span>
                  <span className="font-medium text-foreground">
                    {lesson.resources.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
