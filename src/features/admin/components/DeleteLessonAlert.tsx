import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useDeleteLesson } from "../hooks/useLessons";

const DeleteLessonAlert = ({
  lessonId,
  courseId,
  lessonTitle,
}: {
  lessonId: number;
  courseId: number;
  lessonTitle?: string;
}) => {
  const navigate = useNavigate();
  const { handleDeleteLesson, isLoading } = useDeleteLesson();

  const handleConfirm = () => {
    handleDeleteLesson(lessonId);
    navigate(`/admin/courses/${courseId}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete Lesson
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              Delete lesson
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete
            {lessonTitle ? ` "${lessonTitle}"` : " this lesson"} along with its
            goals, resources, and quiz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
          >
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Deleting...
              </>
            ) : (
              "Delete Lesson"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLessonAlert;
