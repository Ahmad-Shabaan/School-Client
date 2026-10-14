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
import { Minus, Trash2 } from "lucide-react";
import { useRemoveStudentEnrollment } from "../hooks/useCourses";

const RemoveUserEnrollmentAlert = ({
  email,
  courseId,
}: {
  email: string;
  courseId: number;
}) => {
  const { handleRemoveStudentEnrollment, isLoading } =
    useRemoveStudentEnrollment();

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-lg border border-border/40 bg-background text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              <Minus className="size-3.5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove enrollment</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              Remove enrollment
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently remove the{" "}
            {email}'s enrollment .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => handleRemoveStudentEnrollment(courseId,email)}
          >
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Removing...
              </>
            ) : (
              "Remove Enrollment"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveUserEnrollmentAlert;
