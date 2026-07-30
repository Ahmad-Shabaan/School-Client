import { useState } from "react";
import { User, Mail, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import { userSchema, type CreateUserFormValues } from "@/lib/utils/validation";
import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import type { CreateUserFormProps } from "../types/dashboard.types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
        <Button variant="ghost" className="bg-surface-dim rounded-full">
          <Plus />
          Add Member
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll hide-scrollbar">
        <SheetHeader>
          <SheetTitle className="aside-header">Add a new member</SheetTitle>
        </SheetHeader>
        <form
          id="signup-form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-4 w-full px-4"
          data-animate="form"
          noValidate
        >
          {/* ── Server error — identical to LoginForm ── */}
          {isError && error && (
            <ErrorMessage
              msg={error.error ? error.error.message : error.title}
              errors={error?.errors}
              className="w-full"
            />
          )}

          <SectionDivider label="Personal info" />

          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper
              id="signup-firstName"
              label="First Name"
              errorId="firstName-error"
              errorMessage={errors.firstName?.message}
            >
              <div className="group relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                         pl-4 text-on-surface-variant transition-colors duration-200
                         group-focus-within:text-primary"
                >
                  <User className="size-4" />
                </div>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="signup-firstName"
                      type="text"
                      placeholder="John"
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={
                        errors.firstName ? "firstName-error" : undefined
                      }
                      className="pl-11 pr-4"
                    />
                  )}
                />
              </div>
            </FieldWrapper>

            <FieldWrapper
              id="signup-lastName"
              label="Last Name"
              errorId="lastName-error"
              errorMessage={errors.lastName?.message}
            >
              <div className="group relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                         pl-4 text-on-surface-variant transition-colors duration-200
                         group-focus-within:text-primary"
                >
                  <User className="size-4" />
                </div>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="signup-lastName"
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={
                        errors.lastName ? "lastName-error" : undefined
                      }
                      className="pl-11 pr-4"
                    />
                  )}
                />
              </div>
            </FieldWrapper>
          </div>

          {/* Email */}
          <FieldWrapper
            id="signup-email"
            label="Email Address"
            errorId="email-error"
            errorMessage={errors.email?.message}
          >
            <div className="group relative">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                       pl-4 text-on-surface-variant transition-colors duration-200
                       group-focus-within:text-primary"
              >
                <Mail className="size-4" />
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="pl-11 pr-4"
                  />
                )}
              />
            </div>
          </FieldWrapper>

          <FieldWrapper
            id="user-role"
            label="Role"
            errorId="role-error"
            errorMessage={errors.role?.message}
          >
            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full max-w-48">
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
            </div>
          </FieldWrapper>


          {/* ── Submit — identical gradient button to LoginForm ── */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className=" btn-primary font-bold rounded-md
          "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="size-4 rounded-full border-2 border-on-primary/30
                         border-t-on-primary animate-spin"
                  />
                  Creating member...
                </span>
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
