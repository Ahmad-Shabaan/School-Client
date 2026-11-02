import { Skeleton } from "@/components/ui/skeleton";

interface PostSkeletonProps {
  count?: number;
}

const PostSkeleton = ({ count = 3 }: PostSkeletonProps) => (
  <div className="space-y-5" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <article
        key={index}
        className="overflow-hidden rounded-[14px] border border-line bg-white"
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 sm:px-5">
          <Skeleton className="size-10 flex-none rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="mt-1.5 h-3 w-20 rounded-md" />
          </div>
        </div>

        <div className="space-y-2 px-4 pb-4 sm:px-5">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>

        <div className="px-4 pb-3 sm:px-5">
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>

        <div className="border-t border-line px-4 py-4 sm:px-5">
          <Skeleton className="h-4 w-20 rounded-md" />
          <div className="mt-4 flex items-start gap-2.5">
            <Skeleton className="size-8 flex-none rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="mt-4 h-16 w-full rounded-lg" />
        </div>
      </article>
    ))}
  </div>
);

export default PostSkeleton;
