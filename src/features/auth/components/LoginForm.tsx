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
        label="البريد الإلكتروني"
        errorId="email-error"
        errorMessage={errors.email?.message}
      >
        <div className="group relative">
          <div
            className="pointer-events-none absolute inset-y-0 start-0 flex items-center
                       ps-4 text-body-mute transition-colors duration-200
                       group-focus-within:text-teal"
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
                placeholder="example@mail.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="border-line! ps-11 pe-4 hover:border-teal/40! focus-visible:ring-teal!"
              />
            )}
          />
        </div>
      </FieldWrapper>

      {/* ── Password ── */}
      <FieldWrapper
        id="signup-password"
        label="كلمة المرور"
        errorId="password-error"
        errorMessage={errors.password?.message}
      >
        <div className="group relative">
          <div
            className="pointer-events-none absolute inset-y-0 start-0 flex items-center
                       ps-4 text-body-mute transition-colors duration-200
                       group-focus-within:text-teal"
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
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="border-line! ps-11 pe-12 hover:border-teal/40! focus-visible:ring-teal!"
              />
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            className="absolute inset-y-0 end-0 flex items-center pe-4
            text-body-mute transition-colors hover:text-body"
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
          className="text-sm font-semibold text-teal-dark transition-colors hover:text-teal"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      {/* ── Submit ── */}
      <div>
        <LoadingButton
          btnTxt="تسجيل الدخول"
          loadingTxt="جارٍ تسجيل الدخول..."
          isLoading={isLoading}
          className="mt-1 h-11! bg-none! bg-teal-dark! py-0! text-sm! text-white! shadow-[0_10px_24px_rgba(18,61,52,0.22)]! hover:bg-teal! hover:shadow-[0_6px_16px_rgba(18,61,52,0.2)]! sm:h-12! sm:text-base!"
        />
      </div>
    </form>
  );
}