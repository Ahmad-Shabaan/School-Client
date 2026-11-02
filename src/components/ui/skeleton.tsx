import { cn } from "@/lib/utils";

type SkeletonTone = "surface" | "brand" | "paper";

interface SkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Visual tone of the placeholder:
   * - `surface`: neutral material surface (default, admin / generic areas)
   * - `brand`: soft teal of the student design palette
   * - `paper`: warm paper tone of the student design palette
   */
  tone?: SkeletonTone;
  /** Stagger delay in seconds, used to create a progressive loading effect. */
  delay?: number;
}

const toneClasses: Record<SkeletonTone, string> = {
  surface: "bg-skeleton-surface",
  brand: "bg-skeleton-brand",
  paper: "bg-skeleton-paper",
};

function Skeleton({
  className,
  tone = "surface",
  delay,
  style,
  ...props
}: SkeletonProps) {
  const delayStyle = delay
    ? ({ "--skeleton-delay": `${delay}s` } as React.CSSProperties)
    : undefined;

  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      style={delayStyle ? { ...delayStyle, ...style } : style}
      className={cn(
        "relative overflow-hidden rounded-md",
        toneClasses[tone],
        "after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,var(--color-skeleton-sheen),transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps, SkeletonTone };
