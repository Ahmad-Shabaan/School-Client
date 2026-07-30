import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import FieldWrapper from "../components/FieldWrapper";
import { useAuth } from "../hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/utils/validation";
import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";
import { useState } from "react";

const ChangePasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const {
    changePassword,
    isChangingPassword,
    isChangingPasswordError,
    changePasswordError,
    logout,
  } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const submitHandler = (values: ResetPasswordSchema) => {
    changePassword(values.password);
  };

  return (
    <main className="main-container pt-0 min-h-svh">
      <div className="page-container flex-center min-h-svh">
        <section className="aside-section max-w-md xl:max-w-lg px-4 sm:px-6 py-6 sm:py-8 col-center gap-4 sm:gap-6">
          <div className="col-center">
            <h1 className="section-header sm:text-3xl">Change Your Password</h1>
            <p className="section-description">
              Your account requires a password update before you can continue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-4 sm:gap-6 w-full"
            noValidate
            data-animate="form"
          >
            {/* ── Server error ── */}
            {isChangingPasswordError && changePasswordError && (
              <ErrorMessage
                msg={changePasswordError.error ? changePasswordError.error.message : changePasswordError.title}
                errors={changePasswordError?.errors}
              />
            )}
            {/* ── Password ── */}
            <FieldWrapper
              id="change-password"
              label="New Password"
              errorId="password-error"
              errorMessage={errors.password?.message}
            >
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant transition-colors duration-200 group-focus-within:text-primary">
                  <Lock className="size-4" />
                </div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="change-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      className="pl-11 pr-4"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4
            text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FieldWrapper>

            {/* ── Confirm Password ── */}
            <FieldWrapper
              id="change-confirm-password"
              label="Confirm New Password"
              errorId="confirm-password-error"
              errorMessage={errors.confirmPassword?.message}
            >
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant transition-colors duration-200 group-focus-within:text-primary">
                  <Lock className="size-4" />
                </div>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="change-confirm-password"
                      type={showConfirmedPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                      className="pl-11 pr-4"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmedPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4
            text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {showConfirmedPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FieldWrapper>

            {/* ── Submit ── */}
            <button
              type="submit"
              className="btn-primary mt-1 tracking-normal font-semibold"
            >
              {isChangingPassword ? (
                <LoadingButton label={"Processing.."} />
              ) : (
                "Update password"
              )}
            </button>
          </form>

          <button
            onClick={() => logout()}
            className="text-sm text-on-surface-variant hover:text-error transition-colors"
          >
            Log out instead
          </button>
        </section>
      </div>
    </main>
  );
};

export default ChangePasswordPage;
