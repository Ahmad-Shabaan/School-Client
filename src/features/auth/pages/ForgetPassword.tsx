import { ArrowLeft, GlobeLockIcon } from "lucide-react";
import ForgetPasswordForm from "../components/ForgetPasswordForm";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  return (
    <main className="main-container pt-0 min-h-svh flex items-center justify-center">
      <div className="page-container flex-center min-h-svh py-12">
        <section className="max-w-md w-full mx-auto">
          <div className="bg-surface-container-low rounded-xl border border-border/40 shadow-card p-8 space-y-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <GlobeLockIcon className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Forgot password?
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  No worries, it happens. Enter your email and we'll send you
                  reset instructions.
                </p>
              </div>
            </div>

            <ForgetPasswordForm />

            <div className="text-center pt-2 border-t border-border/30">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgetPassword;