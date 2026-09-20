import { Label } from "@/components/ui/label";
import * as React from "react";

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
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor={id} className="text-sm font-normal text-muted">
          {label}
        </Label>
        {/* Required indicator could go here if needed */}
      </div>
      <div className="space-y-1">
        {children}
        {errorMessage && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default FieldWrapper;
