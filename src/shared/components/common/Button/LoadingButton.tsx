import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const LoadingButton = ({
  isLoading,
  btnTxt,
  loadingTxt,
  className = "",
}: {
  isLoading: boolean;
  btnTxt: string;
  loadingTxt: string;
  className?: string;
}) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn("w-full btn-primary", className)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="size-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
          {loadingTxt}
        </span>
      ) : (
        btnTxt
      )}
    </Button>
  );
};

export default LoadingButton;
