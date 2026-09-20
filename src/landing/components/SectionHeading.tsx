import { cn } from "@/lib/utils";
import { DiamondIcon } from "./icons";

interface SectionHeadingProps {
  title: string;
  lede?: string;
  tone?: "light" | "dark";
  className?: string;
  headingClassName?: string;
}

const SectionHeading = ({
  title,
  lede,
  tone = "light",
  className,
  headingClassName,
}: SectionHeadingProps) => {
  const dark = tone === "dark";

  return (
    <div className={cn("text-center", className)}>
      <h2
        className={cn(
          "landing-title-section font-extrabold tracking-tight",
          dark ? "text-white" : "text-[var(--teal-dark)]",
          headingClassName,
        )}
      >
        {title}
      </h2>

      <div
        className={cn(
          "mx-auto mt-4 flex items-center justify-center gap-3 sm:mt-5",
          dark ? "text-[var(--gold-soft)]" : "text-[var(--gold)]",
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            "h-px w-10 bg-linear-to-l sm:w-16 lg:w-20",
            dark
              ? "from-transparent to-[var(--gold-soft)]/70"
              : "from-transparent to-[var(--gold)]/70",
          )}
        />
        <DiamondIcon className="size-4 flex-none" />
        <span
          className={cn(
            "h-px w-10 bg-linear-to-r sm:w-16 lg:w-20",
            dark
              ? "from-transparent to-[var(--gold-soft)]/70"
              : "from-transparent to-[var(--gold)]/70",
          )}
        />
      </div>

      {lede ? (
        <p
          className={cn(
            "mx-auto mt-4 max-w-xl text-[1.05rem] leading-[1.8] sm:mt-5",
            dark ? "text-[#C7D3CD]" : "text-[var(--text-mute)]",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;