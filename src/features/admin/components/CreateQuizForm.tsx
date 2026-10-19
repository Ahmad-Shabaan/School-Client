import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, type QuizFormValues } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import { cn } from "@/lib/utils";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import type {
  QuizManagementDto,
  QuizPayloadRequest,
} from "../types/lesson.types";

interface CreateQuizFormProps {
  onSubmit: (quiz: QuizPayloadRequest) => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: ApiErrorResponse;
  initialData?: QuizManagementDto;
  trigger?: React.ReactNode;
}

const emptyFormValues = (): QuizFormValues => ({
  title: "",
  passingScorePercent: 80,
  questions: [
    {
      text: "",
      correctIndex: 0,
      options: [{ text: "" }, { text: "" }],
    },
  ],
});

const toFormValues = (initialData?: QuizManagementDto): QuizFormValues => {
  if (!initialData) return emptyFormValues();

  return {
    title: initialData.title,
    passingScorePercent: initialData.passingScorePercent,
    questions: initialData.questions.map((question) => ({
      text: question.text,
      correctIndex: Math.max(
        0,
        question.options.findIndex((option) => option.isCorrect),
      ),
      options: question.options.map((option) => ({ text: option.text })),
    })),
  };
};

const toPayload = (values: QuizFormValues): QuizPayloadRequest => ({
  title: values.title.trim(),
  passingScorePercent: values.passingScorePercent,
  questions: values.questions.map((question) => ({
    text: question.text.trim(),
    options: question.options.map((option, index) => ({
      text: option.text.trim(),
      isCorrect: index === question.correctIndex,
    })),
  })),
});

function QuestionBlock({
  control,
  register,
  setValue,
  questionIndex,
  questionCount,
  errors,
  onRemoveQuestion,
}: {
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  setValue: UseFormSetValue<QuizFormValues>;
  questionIndex: number;
  questionCount: number;
  errors: FieldErrors<QuizFormValues>;
  onRemoveQuestion: () => void;
}) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const correctIndex = useWatch({
    control,
    name: `questions.${questionIndex}.correctIndex`,
  });

  const questionError = Array.isArray(errors.questions)
    ? errors.questions[questionIndex]
    : undefined;

  return (
    <div className="rounded-lg border border-border/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Question {questionIndex + 1}
        </span>
        {questionCount > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemoveQuestion}
            className="rounded-lg border border-border/30 bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      <FieldWrapper
        id={`question-${questionIndex}`}
        label="Question"
        errorId={`questions.${questionIndex}.text-error`}
        errorMessage={questionError?.text?.message?.toString()}
      >
        <textarea
          {...register(`questions.${questionIndex}.text`)}
          id={`question-${questionIndex}`}
          rows={2}
          placeholder="What is 2 + 2?"
          aria-invalid={!!questionError?.text}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        />
      </FieldWrapper>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Options <span className="text-xs">(select the correct answer)</span>
        </p>

        {optionFields.map((optionField, optionIndex) => (
          <div key={optionField.id} className="flex items-center gap-3">
            <button
              type="button"
              role="radio"
              aria-checked={correctIndex === optionIndex}
              aria-label={`Mark option ${optionIndex + 1} as correct answer`}
              onClick={() =>
                setValue(
                  `questions.${questionIndex}.correctIndex`,
                  optionIndex,
                  { shouldDirty: true },
                )
              }
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                correctIndex === optionIndex
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50",
              )}
            >
              {optionIndex + 1}
            </button>
            <input
              {...register(
                `questions.${questionIndex}.options.${optionIndex}.text`,
              )}
              placeholder={`Option ${optionIndex + 1}`}
              aria-invalid={!!questionError?.options?.[optionIndex]?.text}
              className={cn(
                "w-full rounded-lg border bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                correctIndex === optionIndex
                  ? "border-emerald-500/60"
                  : "border-border hover:border-primary/30",
              )}
            />
            {optionFields.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeOption(optionIndex)}
                className="shrink-0 rounded-lg border border-border/30 bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        ))}

        {questionError?.options?.message && (
          <p role="alert" className="text-sm text-destructive">
            {questionError.options.message}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendOption({ text: "" })}
          className="w-fit"
        >
          <Plus className="mr-2 h-3 w-3" />
          Add Option
        </Button>

        {questionError?.correctIndex && (
          <p role="alert" className="text-sm text-destructive">
            {questionError.correctIndex.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CreateQuizeForm({
  onSubmit,
  isLoading = false,
  isError = false,
  error,
  initialData,
  trigger,
}: CreateQuizFormProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!initialData;

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    mode: "onBlur",
    defaultValues: toFormValues(initialData),
  });

  useEffect(() => {
    reset(toFormValues(initialData));
  }, [initialData, reset]);

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  const submitHandler = (data: QuizFormValues) => {
    onSubmit(toPayload(data));
    setOpen(false);
    if (!isEditMode) reset(emptyFormValues());
  };

  const questionsArrayError = (
    errors.questions as unknown as { message?: string } | undefined
  )?.message;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="default" size="sm" className="w-auto shrink-0">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Create Quiz
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="border-b border-border/30 pb-4 mb-2">
          <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
            {isEditMode ? "Edit quiz" : "Create a new quiz"}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update the quiz title, passing score, questions, and answers"
              : "Add questions with answer options. Each question must have exactly one correct answer."}
          </p>
        </SheetHeader>

        <form
          id="quiz-form"
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

          <SectionDivider label="Quiz info" />

          <FieldWrapper
            id="quiz-title"
            label="Quiz Title"
            errorId="quiz-title-error"
            errorMessage={errors.title?.message?.toString()}
          >
            <input
              {...register("title")}
              id="quiz-title"
              placeholder="Chapter 1 quiz"
              aria-invalid={!!errors.title}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </FieldWrapper>

          <FieldWrapper
            id="quiz-passing-score"
            label="Passing Score (%)"
            errorId="quiz-passing-score-error"
            errorMessage={errors.passingScorePercent?.message?.toString()}
          >
            <input
              {...register("passingScorePercent", { valueAsNumber: true })}
              id="quiz-passing-score"
              type="number"
              min={0}
              max={100}
              placeholder="80"
              aria-invalid={!!errors.passingScorePercent}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </FieldWrapper>

          <SectionDivider label="Questions" />

          {questionsArrayError && (
            <p role="alert" className="text-sm text-destructive">
              {questionsArrayError}
            </p>
          )}

          {questionFields.map((questionField, questionIndex) => (
            <QuestionBlock
              key={questionField.id}
              control={control}
              register={register}
              setValue={setValue}
              questionIndex={questionIndex}
              questionCount={questionFields.length}
              errors={errors}
              onRemoveQuestion={() => removeQuestion(questionIndex)}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendQuestion({
                text: "",
                correctIndex: 0,
                options: [{ text: "" }, { text: "" }],
              })
            }
            className="w-fit"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add Question
          </Button>

          <div className="pt-2">
            <LoadingButton
              btnTxt={isEditMode ? "Save Changes" : "Create Quiz"}
              loadingTxt={isEditMode ? "Saving quiz..." : "Creating quiz..."}
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
    </Sheet>
  );
}
