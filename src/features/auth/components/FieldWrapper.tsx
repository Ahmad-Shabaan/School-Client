import { Label } from "@/components/ui/label";
import React from "react";
interface FieldWrapperProps {
  id: string;
  label: string;
  errorId?: string;
  errorMessage?: string;
  children: React.ReactNode;
}
const FieldWrapper = ({
  id,
  label,
  errorId,
  errorMessage,
  children,
}: FieldWrapperProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-error pl-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FieldWrapper;
