import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import {
  updateUserSchema,
  type UpdateUserFormValues,
} from "@/lib/utils/validation";
// import SectionDivider from "@/shared/components/common/Form/SectionDivider";
// import FieldWrapper from "@/shared/components/common/Form/FieldWrapper";
import type { UpdateUserRequestDto, UserDto } from "../types/dashboard.types";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { useUpdateUser } from "../hooks/useDashboard";
// import InputForm from "@/shared/components/common/Form/InputForm";
// import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import UserForm from "./UserForm";

const UpdateUserForm = ({ user }: { user: UserDto }) => {
  console.log("user from table", user);
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
  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }, [user, reset]);
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
          <p>Edit user</p>
        </TooltipContent>
      </Tooltip>

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
        btnTxt="Update Member"
        loadingTxt="Updating member..."
        sheetTitle="Update member"
        sheetDescription="Edit member details"
      />
      {/* <SheetContent className="overflow-y-auto">
        <SheetHeader className="border-b border-border/30 pb-4 mb-2">
          <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
            Update member
          </SheetTitle>
          <p className="text-sm text-muted-foreground">Edit member details</p>
        </SheetHeader>
        <form
          id="update-form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-5 w-full px-1"
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
            <FieldWrapper
              id="update-firstName"
              label="First Name"
              errorId="firstName-error"
              errorMessage={errors.firstName?.message}
            >
              <InputForm
                control={control}
                inputField="firstName"
                errors={errors}
                id="update-firstName"
                placeholder="John"
              />
            </FieldWrapper>

            <FieldWrapper
              id="update-lastName"
              label="Last Name"
              errorId="lastName-error"
              errorMessage={errors.lastName?.message}
            >
              <InputForm
                control={control}
                inputField="lastName"
                errors={errors}
                id="update-lastName"
                placeholder="Doe"
              />
            </FieldWrapper>
          </div>

          <div className="pt-2">
            <LoadingButton
              btnTxt="Update Member"
              loadingTxt={"Updating member..."}
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
};

export default UpdateUserForm;
