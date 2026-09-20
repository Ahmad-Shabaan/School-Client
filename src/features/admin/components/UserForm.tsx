import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import type { ReactNode } from "react";
import type {
  Control,
  FieldErrors,
  FieldPath,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import InfoFormInputs from "@/shared/components/common/Form/InfoFormInputs";
import type { InfoForm } from "@/lib/utils/validation";

interface UserFormProps<T extends InfoForm> {
  children?: ReactNode;
  submitHandler: (data: T) => void;
  handleSubmit: UseFormHandleSubmit<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  isLoading: boolean;
  isError: boolean;
  error?: ApiErrorResponse;
  firstName: FieldPath<T>;
  lastName: FieldPath<T>;
  btnTxt: string;
  loadingTxt: string;
  sheetTitle: string;
  sheetDescription: string;
}
export default function UserForm<T extends InfoForm>({
  children,
  submitHandler,
  handleSubmit,
  control,
  errors,
  isLoading,
  isError,
  error,
  firstName,
  lastName,
  btnTxt,
  loadingTxt,
  sheetTitle,
  sheetDescription,
}: UserFormProps<T>) {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader className="border-b border-border/30 pb-4 mb-2">
        <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
          {sheetTitle}
        </SheetTitle>
        <p className="text-sm text-muted-foreground">{sheetDescription}</p>
      </SheetHeader>
      <form
        id="update-form"
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
        <SectionDivider label="Personal info" />
        <div className="grid grid-cols-2 gap-3">
          <InfoFormInputs
            control={control}
            errors={errors}
            firstName={firstName}
            lastName={lastName}
          />
        </div>
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
