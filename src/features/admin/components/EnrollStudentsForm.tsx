import { useEffect, useMemo, useState } from "react";
import { Search, SearchX, UserPlus, Users, X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  enrollStudentsSchema,
  type EnrollStudentsFormValues,
} from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import { cn } from "@/lib/utils";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { getUsersEmailQueryOptions } from "../options/dashboard.options";
import RemoveUserEnrollmentAlert from "./RemoveUserEnrollmentAlert";

interface EnrollStudentsFormProps {
  onSubmit: (emails: string[]) => Promise<void> | void;
  isLoading?: boolean;
  isError?: boolean;
  error?: ApiErrorResponse;
  courseId: number;
}

const AVATAR_GRADIENTS = [
  "from-primary to-secondary",
  "from-tertiary to-primary",
  "from-secondary to-tertiary",
  "from-primary to-tertiary",
];

const getInitials = (email: string) => {
  const local = email.split("@")[0] ?? email;
  const parts = local.split(/[._\-+]/).filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
};

const gradientFor = (email: string) => {
  const sum = email
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
};

export default function EnrollStudentsForm({
  onSubmit,
  isLoading = false,
  isError = false,
  error,
  courseId,
}: EnrollStudentsFormProps) {
  const {
    data,
    isLoading: emailsLoading,
    isError: emailsIsError,
    error: emailsError,
  } = useQuery(getUsersEmailQueryOptions(courseId));

  const emails = useMemo(() => data?.data ?? [], [data]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnrollStudentsFormValues>({
    resolver: zodResolver(enrollStudentsSchema),
    defaultValues: {
      emails: emails
        ?.filter((item) => item.isEnrolled)
        .map((item) => item.email),
    },
  });

  const selected = useWatch({ control, name: "emails" }) ?? [];

  const filteredEmails = useMemo(
    () =>
      emails.filter((email) =>
        email.email.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [emails, search],
  );

  const submitHandler = (values: EnrollStudentsFormValues) => {
    onSubmit(values.emails);
    setOpen(false);
    reset();
    setSearch("");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset();
      setSearch("");
    }
  };

  useEffect(() => {
    if (!data) return;

    reset({
      emails: emails
        .filter((item) => item.isEnrolled)
        .map((item) => item.email),
    });
  }, [data, emails, reset]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="w-full justify-start gap-2" variant="default" size="sm">
          <UserPlus className="size-4" />
          Enroll Students
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <SheetHeader className="gap-0 space-y-0 border-b border-border/40 bg-surface-container-low/40 px-5 pt-6 pb-4 text-left">
          <div className="flex items-center gap-3">
            <span className="gradient-primary shadow-glow-primary flex size-11 shrink-0 items-center justify-center rounded-xl text-on-primary">
              <Users className="size-5" />
            </span>
            <div className="min-w-0 pr-8">
              <SheetTitle className="text-lg font-bold tracking-tight text-foreground">
                Enroll students
              </SheetTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Select the students to add to this course
              </p>
            </div>
          </div>
        </SheetHeader>

        <form
          id="enroll-students-form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          {isError && error && (
            <div className="px-5 pt-4">
              <ErrorMessage
                msg={error.error ? error.error.message : error.title}
                errors={error?.errors}
              />
            </div>
          )}

          <Controller
            name="emails"
            control={control}
            render={({ field }) => {
              const toggle = (emailValue: string, checked: boolean) => {
                field.onChange(
                  checked
                    ? [...field.value, emailValue]
                    : field.value.filter((item) => item !== emailValue),
                );
              };

              const allFilteredSelected =
                filteredEmails.length > 0 &&
                filteredEmails.every((email) =>
                  field.value.includes(email.email),
                );

              const toggleAll = (checked: boolean) => {
                if (checked) {
                  field.onChange([
                    ...new Set([
                      ...field.value,
                      ...filteredEmails.map((email) => email.email),
                    ]),
                  ]);
                } else {
                  field.onChange(
                    field.value.filter(
                      (email) => !filteredEmails.find((e) => e.email === email),
                    ),
                  );
                }
              };

              return (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="space-y-3 px-5 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                        Students
                      </span>
                      <Badge variant="default" className="tabular-nums">
                        {selected.length} selected
                      </Badge>
                    </div>

                    <div className="relative">
                      <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-4 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by email..."
                        className="pl-10 pr-9"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                          className="absolute inset-y-0 right-2.5 my-auto flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>

                    {!emailsLoading &&
                      !emailsIsError &&
                      filteredEmails.length > 0 && (
                        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/50 bg-surface-container-low px-3.5 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5">
                          <span className="flex items-center gap-3">
                            <Checkbox
                              checked={allFilteredSelected}
                              onCheckedChange={(value) =>
                                toggleAll(value === true)
                              }
                            />
                            <span className="text-sm font-medium text-foreground">
                              Select all{search ? " results" : ""}
                            </span>
                          </span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {filteredEmails.length}
                          </span>
                        </label>
                      )}

                    {errors.emails?.message && (
                      <p
                        id="emails-error"
                        role="alert"
                        className="text-xs text-destructive"
                      >
                        {errors.emails.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pb-5">
                    {emailsLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5"
                        >
                          <Skeleton className="size-4 shrink-0 rounded-[4px]" />
                          <Skeleton className="size-9 shrink-0 rounded-full" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))
                    ) : emailsIsError ? (
                      <ErrorMessage msg={`Error: ${emailsError?.title}`} />
                    ) : filteredEmails.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-surface-container-high">
                          <SearchX className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          No students found
                        </p>
                        <p className="max-w-50 text-xs text-muted-foreground">
                          Try a different search term.
                        </p>
                      </div>
                    ) : (
                      filteredEmails.map((email) => {
                        const isChecked = field.value.includes(email.email);

                        return (
                          <div
                            key={email.email}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200",
                              isChecked
                                ? "border-primary/40 bg-primary/5 shadow-sm"
                                : "border-border/40 bg-surface-container-lowest hover:border-border hover:bg-accent/40",
                            )}
                          >
                            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(value) =>
                                  toggle(email.email, value === true)
                                }
                              />
                              <span
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[11px] font-bold text-on-primary shadow-sm",
                                  gradientFor(email.email),
                                )}
                              >
                                {getInitials(email.email)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-foreground">
                                  {email.email.split("@")[0]}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {email.email}
                                </span>
                              </span>
                            </label>

                            {email.isEnrolled && (
                              <span className="flex shrink-0 items-center gap-1.5">
                                <Badge
                                  variant="success"
                                  className="hidden sm:inline-flex"
                                >
                                  Enrolled
                                </Badge>
                                <RemoveUserEnrollmentAlert
                                  courseId={courseId}
                                  email={email.email}
                                />
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            }}
          />

          <SheetFooter className="border-t border-border/40 bg-surface-container-low/40 p-4">
            <div className="flex items-center gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
              <LoadingButton
                btnTxt={
                  selected.length > 0
                    ? `Enroll ${selected.length} student${
                        selected.length > 1 ? "s" : ""
                      }`
                    : "Enroll Students"
                }
                loadingTxt="Enrolling students..."
                isLoading={isLoading}
                className="flex-1"
              />
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
