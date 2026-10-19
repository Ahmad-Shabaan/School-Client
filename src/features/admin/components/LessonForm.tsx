import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import InputForm from "@/shared/components/common/Form/InputForm";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Goal,
  Link2,
  ListPlus,
  Target,
  Trash2,
  Video,
} from "lucide-react";
import { Controller, useFieldArray } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import type { LessonFormValues } from "@/lib/utils/validation";

interface LessonFormProps {
  submitHandler: (data: LessonFormValues) => void;
  handleSubmit: UseFormHandleSubmit<LessonFormValues>;
  control: Control<LessonFormValues>;
  errors: FieldErrors<LessonFormValues>;
  isLoading: boolean;
  isError: boolean;
  error?: ApiErrorResponse;
  btnTxt: string;
  loadingTxt: string;
  sheetTitle: string;
  sheetDescription: string;
}

export default function LessonForm({
  submitHandler,
  handleSubmit,
  control,
  errors,
  isLoading,
  isError,
  error,
  btnTxt,
  loadingTxt,
  sheetTitle,
  sheetDescription,
}: LessonFormProps) {
  const {
    fields: goalFields,
    append: appendGoal,
    remove: removeGoal,
  } = useFieldArray({ control, name: "goals" });

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({ control, name: "resources" });

  return (
    <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
      <SheetHeader className="border-b border-border/30 pb-4 mb-2">
        <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
          {sheetTitle}
        </SheetTitle>
        <p className="text-sm text-muted-foreground">{sheetDescription}</p>
      </SheetHeader>

      <form
        id="lesson-form"
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-5 w-full px-4 pb-4"
        noValidate
      >
        {isError && error && (
          <ErrorMessage
            msg={error.error ? error.error.message : error.title}
            errors={error?.errors}
          />
        )}

        <SectionDivider label="Lesson info" />

        <FieldWrapper
          id="lesson-title"
          label="Lesson Title"
          errorId="title-error"
          errorMessage={errors.title?.message?.toString()}
        >
          <InputForm
            control={control}
            inputField="title"
            errors={errors}
            id="lesson-title"
            placeholder="Introduction to the course"
            icon={<BookOpen className="size-4" />}
          />
        </FieldWrapper>

        <FieldWrapper
          id="lesson-description"
          label="Description"
          errorId="description-error"
          errorMessage={errors.description?.message?.toString()}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="lesson-description"
                rows={4}
                placeholder="Briefly describe what this lesson covers"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 ease-in-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />
        </FieldWrapper>

        <SectionDivider label="Video & meeting" />

        <FieldWrapper
          id="lesson-youtube-url"
          label="YouTube URL (optional)"
          errorId="youtubeUrl-error"
          errorMessage={errors.youtubeUrl?.message?.toString()}
        >
          <InputForm
            control={control}
            inputField="youtubeUrl"
            errors={errors}
            id="lesson-youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            icon={<Video className="size-4" />}
          />
        </FieldWrapper>

        <FieldWrapper
          id="lesson-meeting-url"
          label="Meeting URL (optional)"
          errorId="meetingUrl-error"
          errorMessage={errors.meetingUrl?.message?.toString()}
        >
          <InputForm
            control={control}
            inputField="meetingUrl"
            errors={errors}
            id="lesson-meeting-url"
            placeholder="https://meet.example.com/room"
            icon={<Link2 className="size-4" />}
          />
        </FieldWrapper>

        <FieldWrapper
          id="lesson-meeting-datetime"
          label="Meeting Date & Time (optional)"
          errorId="meetingDateTime-error"
          errorMessage={errors.meetingDateTime?.message?.toString()}
        >
          <Controller
            name="meetingDateTime"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="lesson-meeting-datetime"
                type="datetime-local"
                aria-invalid={!!errors.meetingDateTime}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm ring-offset-background transition-all duration-200 ease-in-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />
        </FieldWrapper>

        <SectionDivider label="Learning goals" />

        {goalFields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No goals added yet. Goals help students understand what they will
            learn.
          </p>
        )}

        {goalFields.map((goalField, index) => (
          <div key={goalField.id} className="flex items-start gap-2">
            <div className="flex-1">
              <FieldWrapper
                id={`goal-${index}`}
                label={`Goal ${index + 1}`}
                errorId={`goals.${index}.text-error`}
                errorMessage={errors.goals?.[index]?.text?.message?.toString()}
              >
                <InputForm
                  control={control}
                  inputField={`goals.${index}.text`}
                  errors={errors}
                  id={`goal-${index}`}
                  placeholder="What students will learn"
                  icon={<Target className="size-4" />}
                />
              </FieldWrapper>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeGoal(index)}
              className="mt-7 rounded-lg border border-border/30 bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendGoal({ text: "" })}
          className="w-fit"
        >
          <Goal className="mr-2 h-3.5 w-3.5" />
          Add Goal
        </Button>

        <SectionDivider label="Resources" />

        {resourceFields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No resources added yet. Attach PDFs or useful links for this lesson.
          </p>
        )}

        {resourceFields.map((resourceField, index) => (
          <div
            key={resourceField.id}
            className="rounded-lg border border-border/40 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Resource {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeResource(index)}
                className="rounded-lg border border-border/30 bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={14} />
              </Button>
            </div>

            <FieldWrapper
              id={`resource-title-${index}`}
              label="Title"
              errorId={`resources.${index}.title-error`}
              errorMessage={
                errors.resources?.[index]?.title?.message?.toString()
              }
            >
              <InputForm
                control={control}
                inputField={`resources.${index}.title`}
                errors={errors}
                id={`resource-title-${index}`}
                placeholder="Lesson notes (PDF)"
                icon={<FileText className="size-4" />}
              />
            </FieldWrapper>

            <FieldWrapper
              id={`resource-url-${index}`}
              label="File URL"
              errorId={`resources.${index}.fileUrl-error`}
              errorMessage={
                errors.resources?.[index]?.fileUrl?.message?.toString()
              }
            >
              <InputForm
                control={control}
                inputField={`resources.${index}.fileUrl`}
                errors={errors}
                id={`resource-url-${index}`}
                placeholder="https://example.com/notes.pdf"
                icon={<Link2 className="size-4" />}
              />
            </FieldWrapper>

            <FieldWrapper
              id={`resource-type-${index}`}
              label="File Type (optional)"
              errorId={`resources.${index}.fileType-error`}
              errorMessage={
                errors.resources?.[index]?.fileType?.message?.toString()
              }
            >
              <InputForm
                control={control}
                inputField={`resources.${index}.fileType`}
                errors={errors}
                id={`resource-type-${index}`}
                placeholder="PDF"
                icon={<FileText className="size-4" />}
              />
            </FieldWrapper>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendResource({ title: "", fileUrl: "", fileType: "" })}
          className="w-fit"
        >
          <ListPlus className="mr-2 h-3.5 w-3.5" />
          Add Resource
        </Button>

        <div className="pt-2">
          <LoadingButton
            btnTxt={btnTxt}
            loadingTxt={loadingTxt}
            isLoading={isLoading}
          />
        </div>
      </form>

      <SheetFooter className="border-t border-border/30 pt-4 mt-4 px-4">
        <SheetClose asChild>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
