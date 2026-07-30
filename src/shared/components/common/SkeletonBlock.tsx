export const SkeletonBlock = ({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => (
  <div
    className={`animate-pulse rounded bg-surface-container ${className ?? ""}`}
    style={{ animationDelay: `${delay}s` }}
  />
);
