import { Link } from "react-router-dom";
import { brandMark, brandName, footerName } from "@/landing/data/landing";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, isLoggingIn, loginError, isLoginError } = useAuth();

  return (
    <div
      dir="rtl"
      lang="ar"
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-paper px-5 py-6 font-tajawal sm:py-10"
    >
      {/* ── Atmospheric gold/teal glows (same mood as landing hero) ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-gold/10 blur-3xl sm:size-96" />
        <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-teal-soft/70 blur-3xl" />
      </div>

      <main className="relative z-10 m-auto w-full max-w-md">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_28px_rgba(22,48,42,0.07)] sm:p-10">
          {/* ── Brand ── */}
          <div data-animate="form" className="flex flex-col items-center text-center space-y-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-teal to-teal-dark text-2xl font-extrabold text-gold-soft shadow-[0_10px_24px_rgba(18,61,52,0.2)] ring-1 ring-white/10 sm:size-16 sm:text-3xl">
              {brandMark}
            </span>

            <div className="space-y-3">
              <div
                className="flex items-center justify-center gap-1.5"
                aria-hidden="true"
              >
                <span className="h-px w-8 bg-linear-to-l from-transparent to-gold/70 sm:w-12" />
                <span className="size-1.5 rounded-full bg-gold" />
                <span className="size-1.5 rounded-full bg-gold" />
                <span className="size-1.5 rounded-full bg-gold" />
                <span className="h-px w-8 bg-linear-to-r from-transparent to-gold/70 sm:w-12" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-teal-dark sm:text-[1.75rem]">
                  تسجيل الدخول
                </h1>
                <p className="text-sm leading-relaxed text-body-mute sm:text-[0.95rem]">
                  أهلاً بعودتك إلى {brandName}، سجّل دخولك لمتابعة دروسك
                  ومقرراتك.
                </p>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="mt-8">
            <LoginForm
              onSubmit={login}
              isLoading={isLoggingIn}
              error={loginError}
              isLoginError={isLoginError}
            />
          </div>
        </div>

        {/* ── Footer links ── */}
        <div className="mt-6 flex flex-col items-center space-y-4 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-teal-dark transition-colors duration-200 hover:text-teal"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
            <Link
            to="/profile"
            className="text-sm font-semibold text-teal-dark transition-colors duration-200 hover:text-teal"
          >
            الذهاب إلى صفحة الملف الشخصي(للاختبار فقط)
          </Link>
          <p className="text-xs text-body-mute/80">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {footerName}
          </p>
        </div>
      </main>
    </div>
  );
}