import { Skeleton } from "@/components/ui/skeleton";

interface ChatSkeletonProps {
  count?: number;
}

export default function ChatSkeleton({ count = 3 }: ChatSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex gap-3 pt-2"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Skeleton className="size-9 flex-none rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
