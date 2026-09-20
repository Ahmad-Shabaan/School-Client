import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import type { ReactElement } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
function InputForm<T extends FieldValues>({
  inputField,
  control,
  errors,
  id,
  placeholder,
  icon = <User className="size-4" />,
  type = "text",
}: {
  inputField: Path<T>;
  control: Control<T>;
  errors: FieldErrors;
  id: string;
  placeholder?: string;
  icon?: ReactElement;
  type?: "text" | "password";
}) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary">
        {icon}
      </div>
      <Controller
        name={inputField}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={id}
            type={type}
            placeholder={placeholder}
            autoComplete="off"
            aria-invalid={!!errors.inputField}
            aria-describedby={
              errors.inputField ? `${inputField}-error` : undefined
            }
            className="pl-11 pr-4"
          />
        )}
      />
    </div>
  );
}

export default InputForm;
