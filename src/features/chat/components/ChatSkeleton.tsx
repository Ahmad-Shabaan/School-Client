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

interface ConversationRowsSkeletonProps {
  count?: number;
  tone?: SkeletonTone;
}

/** Mirrors ConversationSidebarItem: avatar square → name + optional unread
 *  badge → preview line → time meta, with the trailing chat icon. */
const CONVERSATION_ROW_VARIANTS = [
  { badge: true, name: "w-20", preview: "w-3/4", time: "w-16" },
  { badge: false, name: "w-16", preview: "w-2/3", time: "w-12" },
  { badge: false, name: "w-24", preview: "w-5/6", time: "w-14" },
] as const;

const ConversationRowsSkeleton = ({
  count = 6,
  tone = "surface",
}: ConversationRowsSkeletonProps) => (
  <div aria-hidden="true" className="space-y-2">
    {Array.from({ length: count }).map((_, index) => {
      const variant = CONVERSATION_ROW_VARIANTS[index % CONVERSATION_ROW_VARIANTS.length];
      const delay = index * 0.06;

      return (
        <div
          key={index}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5"
        >
          <Skeleton
            tone={tone}
            className="size-8 flex-none rounded-lg"
            delay={delay}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <Skeleton
                tone={tone}
                className={`h-3 rounded-full ${variant.name}`}
                delay={delay}
              />
              {variant.badge && (
                <Skeleton
                  tone={tone}
                  className="h-3.5 w-6 rounded-full opacity-80"
                  delay={delay}
                />
              )}
            </div>
            <Skeleton
              tone={tone}
              className={`mt-1 h-2.5 rounded-full ${variant.preview}`}
              delay={delay + 0.01}
            />
            <Skeleton
              tone={tone}
              className={`mt-1 h-2 rounded-full opacity-70 ${variant.time}`}
              delay={delay + 0.02}
            />
          </div>
          <Skeleton
            tone={tone}
            className="size-4 flex-none rounded opacity-70"
            delay={delay + 0.03}
          />
        </div>
      );
    })}
  </div>
);

export { ChatSkeleton, ConversationRowsSkeleton };
export default ChatSkeleton;
