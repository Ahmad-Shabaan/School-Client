import { ArrowLeft, GlobeLockIcon } from "lucide-react";
import ForgetPasswordForm from "../components/ForgetPasswordForm";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  return (
    <main className="main-container pt-0 min-h-svh">
      <div className="page-container flex-center min-h-svh ">
        <section className="aside-section max-w-md xl:max-w-lg px-4 sm:px-6 py-6 sm:py-8 col-center gap-4 sm:gap-6 ">
          <div className="rounded-full bg-surface-variant p-4">
            <GlobeLockIcon className="size-6 text-primary" />
          </div>
          <div className="col-center">
            <h1 className="section-header sm:text-3xl">Forgot password?</h1>
            <p className="section-description">
              No worries, it happens. Enter your email and we'll send you reset
              instructions.
            </p>
          </div>
          {/*    Enter your email address and we'll send you a link to reset your password." */}
          <ForgetPasswordForm />

          <Link
            to="/login"
            className=" inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group text-xs sm:text-sm font-medium"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </Link>
        </section>
      </div>
    </main>
  );
};

export default ForgetPassword;
