import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import FieldWrapper from "./FieldWrapper";
import { useAuth } from "../hooks/useAuth";
import { useSearchParams, Link } from "react-router-dom";
import { resetPasswordSchema } from "@/lib/utils/validation";
import type { ResetPasswordSchema } from "@/lib/utils/validation";
import { Lock, RefreshCw } from "lucide-react";
import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const {
    resetPassword,
    isResettingPassword,
    resetPasswordError,
    isResettingPasswordError,
  } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token || !userId) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Invalid Reset Link
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link to="/forgot-password">Request New Link</Link>
        </Button>
      </div>
    );
  }
  const submitHandler = (data: ResetPasswordSchema) =>
    resetPassword(userId, token, data.password);

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
      noValidate
      data-animate="form"
    >
      {/* ── Header ── */}
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold text-foreground">
          Reset Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your new password below to regain access to your account
        </p>
      </div>

      {/* ── Server error ── */}
      {isResettingPasswordError && resetPasswordError && (
        <div className="w-full">
          <ErrorMessage
            msg={
              resetPasswordError.error
                ? resetPasswordError.error.message
                : resetPasswordError.title
            }
            errors={resetPasswordError?.errors}
          />
        </div>
      )}

      {/* ── Password ── */}
      <FieldWrapper
        id="reset-password"
        label="New Password"
        errorId="password-error"
        errorMessage={errors.password?.message}
      >
        <div className="group relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                        pl-3 text-muted-foreground/60 transition-colors duration-200
                        group-focus-within:text-primary/60"
          >
            <Lock className="h-4 w-4" />
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="reset-password"
                type="password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="pl-10 pr-3"
              />
            )}
          />
        </div>
      </FieldWrapper>

      {/* ── Confirm Password ── */}
      <FieldWrapper
        id="confirm-password"
        label="Confirm New Password"
        errorId="confirm-password-error"
        errorMessage={errors.confirmPassword?.message}
      >
        <div className="group relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                        pl-3 text-muted-foreground/60 transition-colors duration-200
                        group-focus-within:text-primary/60"
          >
            <Lock className="h-4 w-4" />
          </div>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                className="pl-10 pr-3"
              />
            )}
          />
        </div>
      </FieldWrapper>

      {/* ── Submit ── */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          disabled={isResettingPassword}
        >
          {isResettingPassword ? (
            <>
              Resetting password...
              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;