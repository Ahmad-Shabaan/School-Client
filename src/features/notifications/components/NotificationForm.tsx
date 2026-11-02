import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationSchema,
  type NotificationFormValues,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import InputForm from "@/shared/components/common/Form/InputForm";
import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { useCreateNotification } from "../hooks/useNotifications";
import type { NotificationVariant } from "./NotificationPanel";

interface NotificationFormProps {
  variant: NotificationVariant;
  /** Controlled sheet open state, owned by the parent (NotificationBell)
   *  so the form's lifecycle is independent from the notification panel. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Admin-only "create notification" form rendered as a Sheet, consistent
 * with the other admin create forms (Create Member / Create Course).
 *
 * The trigger button lives in the NotificationPanel header and opens this
 * Sheet through the controlled `open`/`onOpenChange` props. Because the
 * Sheet instance is mounted by the notification BELL (not the ephemeral
 * panel), it survives the panel closing while the form is in use.
 * The student variant renders nothing.
 */
const NotificationForm = ({
  variant,
  open,
  onOpenChange,
}: NotificationFormProps) => {
  if (variant !== "admin") return null;

  return (
    <AdminNotificationForm open={open} onOpenChange={onOpenChange} />
  );
};

interface AdminNotificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminNotificationForm = ({
  open,
  onOpenChange,
}: AdminNotificationFormProps) => {
  const { mutateAsync, isPending, isError, error } = useCreateNotification();

  const errorInfo = isError ? handleErrorMessage(error) : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    mode: "onBlur",
    defaultValues: { title: "", message: "" },
  });

  const submitHandler = (values: NotificationFormValues) => {
    void mutateAsync({ title: values.title, message: values.message });
    onOpenChange(false);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="z-[102] overflow-y-auto">
        <SheetHeader
          className="mb-2 border-b border-border/30 pb-4"
        >
          <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
            Create a new notification
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            The notification will be sent to all active students.
          </p>
        </SheetHeader>

        <form
          id="notification-form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex w-full flex-col gap-5 px-4"
          noValidate
        >
          {errorInfo && (
            <ErrorMessage
              msg={errorInfo.error ? errorInfo.error.message : errorInfo.title}
              errors={errorInfo.errors}
            />
          )}

          <SectionDivider label="Notification details" />

          <FieldWrapper
            id="notification-title"
            label="Title"
            errorId="title-error"
            errorMessage={errors.title?.message}
          >
            <InputForm
              control={control}
              inputField="title"
              errors={errors}
              id="notification-title"
              placeholder="Lesson updated: Unit 3 is now available"
            />
          </FieldWrapper>

          <FieldWrapper
            id="notification-message"
            label="Message"
            errorId="message-error"
            errorMessage={errors.message?.message}
          >
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="notification-message"
                  rows={4}
                  placeholder="Briefly describe what students should know"
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 ease-in-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}
            />
          </FieldWrapper>

          <div className="pt-2">
            <LoadingButton
              btnTxt="Send Notification"
              loadingTxt="Sending notification..."
              isLoading={isPending}
            />
          </div>
        </form>

        <SheetFooter className="mt-4 border-t border-border/30 pt-4" >
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationForm;
