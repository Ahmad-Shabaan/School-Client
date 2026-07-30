import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  accentColor?: "primary" | "secondary";
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "left",
  accentColor = "primary",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-12",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {subtitle && (
        <span className="label-md uppercase tracking-[0.2em] font-bold mb-4 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          {subtitle}
        </span>
      )}
      <h2
        className="headline-lg font-bold flex items-center gap-4 text-on-surface"
        style={{ fontSize: "clamp(1.5rem, 1.75vw, 2rem)" }}
      >
        {title}
        {align === "left" && (
          <span
            className={cn(
              "h-1 w-12 rounded-full",
              accentColor === "primary" ? "bg-primary" : "bg-secondary",
            )}
          />
        )}
      </h2>
    </div>
  );
}
