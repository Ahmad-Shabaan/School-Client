import { useState } from "react";
import { Mail, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";

// import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import { userSchema, type CreateUserFormValues } from "@/lib/utils/validation";
// import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import type { CreateUserFormProps } from "../types/dashboard.types";
import {
  Sheet,
  // SheetClose,
  // SheetContent,
  // SheetFooter,
  // SheetHeader,
  // SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import InputForm from "@/shared/components/common/Form/InputForm";
// import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import UserForm from "./UserForm";

export default function CreateUserForm({
  onSubmit,
  isLoading = false,
  error,
  isError = false,
}: CreateUserFormProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    },
  });
  const submitHandler = (data: CreateUserFormValues) => {
    onSubmit(data);
    setOpen(false);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="btn-primary">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Member
        </Button>
      </SheetTrigger>

      <UserForm
        submitHandler={submitHandler}
        handleSubmit={handleSubmit}
        errors={errors}
        control={control}
        isLoading={isLoading}
        isError={isError}
        error={error}
        firstName="firstName"
        lastName="lastName"
        btnTxt="Add Member"
        loadingTxt="Creating member..."
        sheetTitle="Add a new member"
        sheetDescription="Fill in the details to create a new member account"
      >
        <FieldWrapper
          id="signup-email"
          label="Email Address"
          errorId="email-error"
          errorMessage={errors.email?.message}
        >
          <InputForm
            control={control}
            inputField="email"
            errors={errors}
            id="signup-email"
            placeholder="john.doe@example.com"
            icon={<Mail className="size-4" />}
          />
        </FieldWrapper>
        <FieldWrapper
          id="user-role"
          label="Role"
          errorId="role-error"
          errorMessage={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FieldWrapper>
      </UserForm>
      {/* <SheetContent className="overflow-y-auto hide-scrollbar">
        <SheetHeader className="border-b border-border/30 pb-4 mb-2">
          <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
            Add a new member
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the details to create a new member account
          </p>
        </SheetHeader>
        <form
          id="signup-form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-5 w-full px-4"
          noValidate
        >
          {isError && error && (
            <ErrorMessage
              msg={error.error ? error.error.message : error.title}
              errors={error?.errors}
              className="w-full"
            />
          )}

          <SectionDivider label="Personal info" />
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper
              id="signup-firstName"
              label="First Name"
              errorId="firstName-error"
              errorMessage={errors.firstName?.message}
            >
              <InputForm
                control={control}
                inputField="firstName"
                errors={errors}
                id="signup-firstName"
                placeholder="John"
              />
            </FieldWrapper>
            <FieldWrapper
              id="signup-lastName"
              label="Last Name"
              errorId="lastName-error"
              errorMessage={errors.lastName?.message}
            >
              <InputForm
                control={control}
                inputField="lastName"
                errors={errors}
                id="signup-lastName"
                placeholder="Doe"
              />
            </FieldWrapper>
          </div>
          <FieldWrapper
            id="signup-email"
            label="Email Address"
            errorId="email-error"
            errorMessage={errors.email?.message}
          >
            <InputForm
              control={control}
              inputField="email"
              errors={errors}
              id="signup-email"
              placeholder="john.doe@example.com"
              icon={<Mail className="size-4" />}
            />
          </FieldWrapper>
          <FieldWrapper
            id="user-role"
            label="Role"
            errorId="role-error"
            errorMessage={errors.role?.message}
          >
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldWrapper>
          <div className="pt-2">
            <LoadingButton
              btnTxt="Add Member"
              loadingTxt={"Creating member..."}
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
      </SheetContent> */}
    </Sheet>
  );
}
