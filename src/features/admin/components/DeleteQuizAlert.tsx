import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useDeleteQuiz } from "../hooks/useLessons";

const DeleteQuizAlert = ({
  lessonId,
  quizTitle,
  disabled = false,
}: {
  lessonId: number;
  quizTitle?: string;
  disabled?: boolean;
}) => {
  const { handleDeleteQuiz, isLoading } = useDeleteQuiz();

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete Quiz
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent>
            <p>Quizzes with attempts cannot be deleted</p>
          </TooltipContent>
        )}
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              Delete quiz
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete
            {quizTitle ? ` "${quizTitle}"` : " this quiz"} and all of its
            questions and options.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => handleDeleteQuiz(lessonId)}
          >
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Deleting...
              </>
            ) : (
              "Delete Quiz"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteQuizAlert;
