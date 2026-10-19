import { useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  lessonSchema,
  type LessonFormValues,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import type { LessonDetailsDto } from "../types/lesson.types";
import LessonForm from "./LessonForm";

interface UpdateLessonFormProps {
  lesson: LessonDetailsDto;
  onSubmit: (values: LessonFormValues) => Promise<void> | void;
  isLoading?: boolean;
  isError?: boolean;
  error?: ApiErrorResponse;
  trigger?: React.ReactNode;
}

const toDatetimeLocal = (iso: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function UpdateLessonForm({
  lesson,
  onSubmit,
  isLoading = false,
  isError = false,
  error,
  trigger,
}: UpdateLessonFormProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    mode: "onBlur",
    defaultValues: {
      title: lesson.title,
      description: lesson.description,
      youtubeUrl: lesson.youTubeVideoId
        ? `https://www.youtube.com/watch?v=${lesson.youTubeVideoId}`
        : "",
      meetingUrl: lesson.meetingUrl ?? "",
      meetingDateTime: toDatetimeLocal(lesson.meetingDateTime),
      goals: lesson.goals.map((goal) => ({ text: goal.text })),
      resources: lesson.resources.map((resource) => ({
        title: resource.title,
        fileUrl: resource.fileUrl,
        fileType: resource.fileType ?? "",
      })),
    },
  });

  const submitHandler = (data: LessonFormValues) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit Lesson
          </Button>
        )}
      </SheetTrigger>

      <LessonForm
        submitHandler={submitHandler}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error}
        btnTxt="Save Changes"
        loadingTxt="Saving lesson..."
        sheetTitle="Edit lesson"
        sheetDescription="Update the lesson details, video, goals, and resources"
      />
    </Sheet>
  );
}
