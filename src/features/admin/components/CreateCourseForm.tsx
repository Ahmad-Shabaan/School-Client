import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseSchema,
  type CreateCourseFormValues,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import CourseForm from "./CourseForm";
import CourseFileField from "./CourseFileField";

interface CreateCourseFormProps {
  onSubmit: (values: CreateCourseFormValues) => Promise<void> | void;
  isLoading?: boolean;
  isError?: boolean;
  error?: ApiErrorResponse;
}

export default function CreateCourseForm({
  onSubmit,
  isLoading = false,
  isError = false,
  error,
}: CreateCourseFormProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(courseSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const submitHandler = (data: CreateCourseFormValues) => {
    onSubmit(data);
    setOpen(false);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="w-auto shrink-0">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Create Course
        </Button>
      </SheetTrigger>

      <CourseForm
        submitHandler={submitHandler}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error}
        name="name"
        description="description"
        btnTxt="Create Course"
        loadingTxt="Creating course..."
        sheetTitle="Create a new course"
        sheetDescription="Fill in the details to add a new course to the catalog"
      >
        <CourseFileField
          control={control}
          name="file"
          errorMessage={errors.file?.message}
        />
      </CourseForm>
    </Sheet>
  );
}
