import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar = ({ value, className }: ProgressBarProps) => (
  <div
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="مقدار التقدم"
    className={cn("h-2.5 w-full overflow-hidden rounded-full bg-teal-soft", className)}
  >
    <div
      className="h-full rounded-full bg-teal transition-[width] duration-500 ease-in-out"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default ProgressBar;