import { useQuery } from "@tanstack/react-query";
import { BookX, Check, ListChecks, Pencil, ShieldCheck, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { quizManagementQueryOptions } from "../options/lessons.options";
import CreateQuizeForm from "./CreateQuizForm";
import DeleteQuizAlert from "./DeleteQuizAlert";
import { useUpdateQuiz } from "../hooks/useLessons";
import type { QuizPayloadRequest } from "../types/lesson.types";

const QuizManagementCard = ({ lessonId }: { lessonId: number }) => {
  const { data, isLoading, isError } = useQuery(
    quizManagementQueryOptions(lessonId),
  );
  const { handleUpdateQuiz, isLoading: updateIsLoading } = useUpdateQuiz();

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.data) return null;

  const quiz = data.data;

  const handleUpdate = (payload: QuizPayloadRequest) => {
    handleUpdateQuiz(lessonId, payload);
  };

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {quiz.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Pass ≥ {quiz.passingScorePercent}%
            </Badge>
            <Badge variant="default">
              <Users className="mr-1 h-3 w-3" />
              {quiz.attemptCount}{" "}
              {quiz.attemptCount === 1 ? "attempt" : "attempts"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {quiz.questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="rounded-lg border border-border/40 p-4 space-y-2"
          >
            <p className="text-sm font-semibold text-foreground">
              Q{questionIndex + 1}. {question.text}
            </p>
            <ul className="space-y-1.5">
              {question.options.map((option) => (
                <li
                  key={option.id}
                  className={
                    option.isCorrect
                      ? "flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                      : "flex items-center gap-2 text-sm text-muted-foreground"
                  }
                >
                  {option.isCorrect ? (
                    <Check className="h-4 w-4 shrink-0" />
                  ) : (
                    <X className="h-4 w-4 shrink-0 opacity-50" />
                  )}
                  {option.text}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-border/30 pt-4">
          <CreateQuizeForm
            onSubmit={handleUpdate}
            isLoading={updateIsLoading}
            trigger={
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit Quiz
              </Button>
            }
            initialData={quiz}
          />
          <DeleteQuizAlert
            lessonId={lessonId}
            quizTitle={quiz.title}
            disabled={quiz.attemptCount > 0}
          />
        </div>

        {quiz.attemptCount > 0 && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookX className="h-3.5 w-3.5" />
            This quiz has student attempts, so it cannot be deleted and its
            questions cannot be changed. Only the title and passing score can be
            updated.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizManagementCard;
