import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateCourseSchema,
  type UpdateCourseFormValues,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateCourse } from "../hooks/useCourses";
import type { CourseDto } from "../types/course.types";
import CourseForm from "./CourseForm";
import CourseFileField from "./CourseFileField";

const UpdateCourseForm = ({ course }: { course: CourseDto }) => {
  const { handleUpdateCourse, isLoading, isError, error } = useUpdateCourse();
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCourseFormValues>({
    resolver: zodResolver(updateCourseSchema),
    mode: "onBlur",
    defaultValues: {
      name: course.courseName,
      description: course.description,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: course.courseName,
        description: course.description,
        file: undefined,
      });
    }
  }, [open, course, reset]);

  const submitHandler = (values: UpdateCourseFormValues) => {
    handleUpdateCourse({
      id: course.id,
      course: {
        Name: values.name,
        Description: values.description,
        Photo: values.file,
      },
    });
    setOpen(false);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg border border-border/30 bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Pencil size={14} />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit course</p>
        </TooltipContent>
      </Tooltip>

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
        btnTxt="Update Course"
        loadingTxt="Updating course..."
        sheetTitle="Update course"
        sheetDescription="Edit the course details below"
      >
        <CourseFileField
          control={control}
          name="file"
          errorMessage={errors.file?.message}
          initialPreview={
            course.file ? `data:image/png;base64,${course.file}` : undefined
          }
          helperText="Leave empty to keep the current cover"
        />
      </CourseForm>
    </Sheet>
  );
};

export default UpdateCourseForm;
