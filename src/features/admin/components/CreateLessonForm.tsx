import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  lessonSchema,
  type LessonFormValues,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import LessonForm from "./LessonForm";

interface CreateLessonFormProps {
  onSubmit: (values: LessonFormValues) => Promise<void> | void;
  isLoading?: boolean;
  isError?: boolean;
  error?: ApiErrorResponse;
}

export default function CreateLessonForm({
  onSubmit,
  isLoading = false,
  isError = false,
  error,
}: CreateLessonFormProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      youtubeUrl: "",
      meetingUrl: "",
      meetingDateTime: "",
      goals: [],
      resources: [],
    },
  });

  const submitHandler = (data: LessonFormValues) => {
    onSubmit(data);
    setOpen(false);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="w-auto shrink-0">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Create Lesson
        </Button>
      </SheetTrigger>

      <LessonForm
        submitHandler={submitHandler}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error}
        btnTxt="Create Lesson"
        loadingTxt="Creating lesson..."
        sheetTitle="Create a new lesson"
        sheetDescription="Fill in the details to add a new lesson to this course"
      />
    </Sheet>
  );
}
