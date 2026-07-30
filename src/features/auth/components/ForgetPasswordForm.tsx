import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook/form";
import { Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ForgetPasswordSchema } from "@/lib/utils/validation";
import FieldWrapper from "./FieldWrapper";

const ForgetPasswordForm = () => {
  const {
    forgetPassword,
    isForgettingPassword,
    forgetPasswordError,
    isForgettingPasswordError,
  } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  });

  const submitHandler = (ForgetPasswordSchema) =>
    forgetPassword(data.email);

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
          Enter your email address to receive a password reset link
        </p>
      </div>

      {/* ── Server error ── */}
      {isForgettingPasswordError && forgetPasswordError && (
        <div className="w-full">
          <ErrorMessage
            msg={
              forgetPasswordError.error
                ? forgetPasswordError.error.message
                : forgetPasswordError.title
            }
            errors={forgetPasswordError?.errors}
          />
        </div>
      )}

      {/* ── Email ── */}
      <FieldWrapper
        id="forgot-password-email"
        label="Email Address"
        errorId="email-error"
        errorMessage={errors.email?.message}
      >
        <div className="group relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                        pl-3 text-muted-foreground/60 transition-colors duration-200
                        group-focus-within:text-primary/60"
          >
            <Mail className="h-4 w-4" />
          </div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                placeholder="john.doe@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="pl-10 pr-3"
              />
            )}
          />
        </div>
      </FieldWrapper>

      {/* ── Submit ── */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          disabled={isForgettingPassword}
        >
          {isForgettingPassword ? (
            <>
              Sending reset link...
              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ForgetPasswordForm;
