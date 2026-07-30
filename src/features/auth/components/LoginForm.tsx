import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FieldWrapper from "./FieldWrapper";
import ErrorMessage from "@/shared/components/common/ErrorBoundary/ErrorMessage";
import type { LoginFormProps } from "../types/auth.types";
import { loginSchema, type LoginSchema } from "@/lib/utils/validation";
import LoadingButton from "@/shared/components/common/Button/LoadingButton";

export default function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  isLoginError = false,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const submitHandler = (data: LoginSchema) =>
    onSubmit(data.email, data.password);

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-4 w-full max-w-md lg:max-w-full "
      noValidate
      data-animate="form"
    >
      {/* ── Server error ── */}
      {isLoginError && error && (
        <ErrorMessage
          msg={error.error ? error.error.message : error.title}
          errors={error?.errors}
        />
      )}
      {/* ── Email ── */}
      <FieldWrapper
        id="login-email"
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
                id="login-email"
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

      {/* ── Password ── */}
      <FieldWrapper
        id="signup-password"
        label="Password"
        errorId="password-error"
        errorMessage={errors.password?.message}
      >
        <div className="group relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center
                       pl-4 text-on-surface-variant transition-colors duration-200
                       group-focus-within:text-primary"
          >
            <Lock className="size-4" />
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="•••••••••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="pl-11 pr-12"
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
      <div className="flex items-center justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-primary transition-colors hover:text-secondary"
        >
          Forgot password?
        </Link>
      </div>

      {/* ── Submit ── */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary mt-1 font-bold rounded-md"
        >
          {isLoading ? (
            <LoadingButton label={"Signing in.."} />
          ) : (
            "Sign In to Account"
          )}
        </button>
      </div>
    </form>
  );
}
