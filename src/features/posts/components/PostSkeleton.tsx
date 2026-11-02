import { Skeleton } from "@/components/ui/skeleton";

interface PostSkeletonProps {
  count?: number;
}

const Bone = ({
  className,
  delay = 0,
  tone = "brand",
}: {
  className?: string;
  delay?: number;
  tone?: "brand" | "paper";
}) => <Skeleton tone={tone} className={className} delay={delay} />;

const PostSkeleton = ({ count = 3 }: PostSkeletonProps) => (
  <div
    className="space-y-5"
    role="status"
    aria-busy="true"
    aria-label="جارٍ تحميل المنشورات"
  >
    <span className="sr-only">جارٍ التحميل…</span>

    {Array.from({ length: count }).map((_, index) => {
      const delay = 0.02 + index * 0.16;

      return (
        <article
          key={index}
          className="overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_4px_14px_rgba(22,48,42,0.04)]"
          aria-hidden="true"
        >
          {/* Author row */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 sm:px-5">
            <Bone
              className="size-10 flex-none rounded-full border border-gold/40"
              delay={delay}
            />
            <div className="min-w-0 flex-1">
              <Bone
                className="h-4 w-32 rounded-[7px]"
                delay={delay + 0.01}
              />
              <Bone
                className="mt-1.5 h-3 w-20 rounded-[7px]"
                delay={delay + 0.02}
              />
            </div>
          </div>

          {/* Post content */}
          <div className="space-y-2.5 px-4 pb-4 sm:px-5">
            <Bone
              className="h-4 w-full rounded-[7px]"
              delay={delay + 0.04}
            />
            <Bone
              className="h-4 w-11/12 rounded-[7px]"
              delay={delay + 0.05}
            />
            <Bone
              className="h-4 w-3/4 rounded-[7px]"
              delay={delay + 0.06}
            />
          </div>

          {/* Comments link */}
          <div className="px-4 pb-3 sm:px-5">
            <Bone
              className="h-4 w-28 rounded-[7px]"
              delay={delay + 0.08}
            />
          </div>

          {/* Comments preview */}
          <div className="border-t border-line px-4 py-4 sm:px-5">
            <Bone
              className="h-3.5 w-16 rounded-[7px]"
              delay={delay + 0.1}
            />
            <div className="mt-4 flex items-start gap-2.5">
              <Bone
                className="size-8 flex-none rounded-full"
                delay={delay + 0.11}
              />
              <div className="flex-1 space-y-2">
                <Bone
                  className="h-3.5 w-28 rounded-[7px]"
                  delay={delay + 0.12}
                />
                <Bone
                  className="h-4 w-full max-w-[85%] rounded-[7px]"
                  delay={delay + 0.13}
                />
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-line bg-paper/50 p-3">
              <Bone
                className="h-3.5 w-3/4 rounded-[7px]"
                delay={delay + 0.14}
                tone="paper"
              />
            </div>
          </div>
        </article>
      );
    })}
  </div>
);

export default PostSkeleton;
