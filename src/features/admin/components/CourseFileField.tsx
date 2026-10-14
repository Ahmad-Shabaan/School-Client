import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";

interface CourseFileFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  errorMessage?: string;
  initialPreview?: string;
  helperText?: string;
}

export default function CourseFileField<T extends FieldValues>({
  control,
  name,
  errorMessage,
  initialPreview,
  helperText = "Click to upload a cover image",
}: CourseFileFieldProps<T>) {
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  return (
    <FieldWrapper
      id="course-file"
      label="Course Cover"
      errorId="file-error"
      errorMessage={errorMessage}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <label
              htmlFor="course-file"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center transition-colors hover:border-primary/40"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Course cover preview"
                  className="h-32 w-full rounded-md object-cover"
                />
              ) : (
                <>
                  <ImagePlus className="size-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {helperText}
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    PNG or JPG up to 5MB
                  </span>
                </>
              )}
            </label>
            <input
              id="course-file"
              type="file"
              accept="image/*"
              className="sr-only"
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={(event) => {
                const file = event.target.files?.[0];
                field.onChange(file);
                if (objectUrlRef.current) {
                  URL.revokeObjectURL(objectUrlRef.current);
                  objectUrlRef.current = null;
                }
                if (file) {
                  const url = URL.createObjectURL(file);
                  objectUrlRef.current = url;
                  setPreview(url);
                } else {
                  setPreview(initialPreview ?? null);
                }
              }}
            />
            {preview && (
              <p className="text-xs text-muted-foreground">
                Click the preview to choose a different image
              </p>
            )}
          </div>
        )}
      />
    </FieldWrapper>
  );
}
