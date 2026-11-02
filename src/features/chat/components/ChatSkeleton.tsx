import { Skeleton, type SkeletonTone } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChatSkeletonProps {
  count?: number;
  /** Placeholder tone; student surfaces use "brand", admin keeps "surface". */
  tone?: SkeletonTone;
}

const BUBBLE_WIDTHS = ["w-1/2", "w-3/5", "w-3/4", "w-2/3"] as const;

const ChatSkeleton = ({ count = 3, tone = "surface" }: ChatSkeletonProps) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, index) => {
      const isMine = index % 2 === 1;
      const delay = index * 0.05;

      return (
        <div
          key={index}
          className={cn(
            "flex pt-1.5",
            isMine ? "justify-end" : "justify-start",
          )}
          style={{ animationDelay: `${index * 100}ms` }}
          aria-hidden="true"
        >
          <div
            className={cn(
              "flex max-w-[80%] flex-col",
              isMine ? "items-end" : "items-start",
            )}
          >
            <Skeleton
              tone={tone}
              className={cn(
                BUBBLE_WIDTHS[index % BUBBLE_WIDTHS.length],
                index % 4 === 3 ? "h-[4.25rem]" : "h-[2.75rem]",
                "rounded-xl",
              )}
              delay={delay}
            />
            <Skeleton
              tone={tone}
              className="mt-1 h-2.5 w-16 rounded-md opacity-70"
              delay={delay + 0.01}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export default ChatSkeleton;
