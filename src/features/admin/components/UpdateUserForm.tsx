import { useState } from "react";
import { User, Pencil } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import {
  updateUserSchema,
  type UpdateUserFormValues,
} from "@/lib/utils/validation";
import SectionDivider from "@/shared/components/common/Form/SectionDivider";
import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import type { UpdateUserRequestDto, UserDto } from "../types/dashboard.types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUpdateUser } from "../hooks/useDashboard";

export default function UpdateUserForm({ user }: { user: UserDto }) {
  const { handleUpdateUser, isLoading, isError, error } = useUpdateUser();

  const onSubmit = (values: UpdateUserFormValues) => {
    const updatedUser: UpdateUserRequestDto = {
      firstName: values.firstName,
      lastName: values.lastName,
    };
    handleUpdateUser({ user: updatedUser, userId: user.id });
  };

  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const submitHandler = (data: UpdateUserFormValues) => {
    onSubmit(data);
    setOpen(false);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-8 h-8 rounded-full bg-surface-dim hover:bg-surface-variant "
        >
          <Pencil />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll hide-scrollbar">
        <SheetHeader>
          <SheetTitle className="aside-header">Update member</SheetTitle>
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
                  Updating member...
                </span>
              ) : (
                "Update Member"
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
