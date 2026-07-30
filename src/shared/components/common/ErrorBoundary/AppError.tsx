import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PaymentErrorProps {
  message?: string;
  link: string;
  to: string;
  onRetry?: () => void;
}

const AppError = ({ message, onRetry, link, to }: PaymentErrorProps) => {
  return (
    // <main className="main-container">
    //   <div className="page-container">
    <main className="flex-1 col-center text-center gap-4 sm:gap-6 pt-12 sm:pt-14 lg:pt-16  pb-4 px-4 ">
      <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
        <AlertTriangle className="size-7 text-error" />
      </div>
      <div className="col-center">
        <h1 className="section-header  sm:text-4xl">Something went wrong</h1>

        <p className="section-description">
          {message ??
            "We couldn't load the checkout page.<br/>This might be a temporary issue."}
        </p>
      </div>

      <div className="col-center sm:flex-row  gap-4 sm:gap-6 w-full">
        <Link to={to} className="btn-secondary w-auto">
          <ArrowLeft className="size-3.5" />
          {link}
        </Link>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="w-full sm:w-auto bg-linear-to-r from-primary to-secondary text-on-primary font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(163,166,255,0.2)] flex items-center justify-center gap-2 cursor-pointer h-auto"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        )}
      </div>
    </main>
    //   </div>
    // </main>
  );
};

export default AppError;
