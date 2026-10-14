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
import { BookOpen } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ReactNode } from "react";
import type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { ApiErrorResponse } from "@/shared/types/api.types";

type CourseFormBase = FieldValues & {
  name: string;
  description: string;
};

interface CourseFormProps<T extends CourseFormBase> {
  children?: ReactNode;
  submitHandler: (data: T) => void;
  handleSubmit: UseFormHandleSubmit<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  isLoading: boolean;
  isError: boolean;
  error?: ApiErrorResponse;
  name: FieldPath<T>;
  description: FieldPath<T>;
  btnTxt: string;
  loadingTxt: string;
  sheetTitle: string;
  sheetDescription: string;
}

export default function CourseForm<T extends CourseFormBase>({
  children,
  submitHandler,
  handleSubmit,
  control,
  errors,
  isLoading,
  isError,
  error,
  name,
  description,
  btnTxt,
  loadingTxt,
  sheetTitle,
  sheetDescription,
}: CourseFormProps<T>) {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader className="border-b border-border/30 pb-4 mb-2">
        <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
          {sheetTitle}
        </SheetTitle>
        <p className="text-sm text-muted-foreground">{sheetDescription}</p>
      </SheetHeader>

      <form
        id="course-form"
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-5 w-full px-4"
        noValidate
      >
        {isError && error && (
          <ErrorMessage
            msg={error.error ? error.error.message : error.title}
            errors={error?.errors}
          />
        )}

        <SectionDivider label="Course info" />

        <FieldWrapper
          id="course-name"
          label="Course Name"
          errorId="name-error"
          errorMessage={errors.name?.message?.toString()}
        >
          <InputForm
            control={control}
            inputField={name}
            errors={errors}
            id="course-name"
            placeholder="Introduction to Physics"
            icon={<BookOpen className="size-4" />}
          />
        </FieldWrapper>

        <FieldWrapper
          id="course-description"
          label="Description"
          errorId="description-error"
          errorMessage={errors.description?.message?.toString()}
        >
          <Controller
            name={description}
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="course-description"
                rows={4}
                placeholder="Briefly describe what this course covers"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 ease-in-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />
        </FieldWrapper>

        {children}

        <div className="pt-2">
          <LoadingButton
            btnTxt={btnTxt}
            loadingTxt={loadingTxt}
            isLoading={isLoading}
          />
        </div>
      </form>

      <SheetFooter className="border-t border-border/30 pt-4 mt-4">
        <SheetClose asChild>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
