import { Skeleton } from "@/components/ui/skeleton";
const LessonSkeleton = () => {
  return (
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9">
          {/* Breadcrumb + title */}
          <div className="mb-6">
            <Skeleton className="mb-3 h-4 w-32 rounded-[7px]" />
            <div className="mb-[18px] flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-9 w-2/3 rounded-[7px] sm:h-11" />
            <div className="mx-auto my-2 mr-0 w-10 rounded-[2px] bg-gold" />
            <Skeleton className="mt-3 h-4 w-full rounded-[7px]" />
            <Skeleton className="mt-2 h-4 w-4/5 rounded-[7px]" />
          </div>

          {/* Video section */}
          <div className="mb-6">
            <div className="overflow-hidden rounded-[14px] border border-line bg-white">
              <Skeleton className="aspect-video w-full rounded-none" />
            </div>

            {/* Progress */}
            <div className="mt-4 rounded-[14px] border border-line bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-[7px]" />
                </div>
                <Skeleton className="h-4 w-10 rounded-[7px]" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="mt-3 h-4 w-3/4 rounded-[7px]" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Goals + resources */}
            <div className="space-y-6 lg:col-span-2">
              {/* Goals */}
              <section className="rounded-[14px] border border-line bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-[7px]" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="mt-1 size-3.5 rounded-full" />
                      <Skeleton className="h-4 w-full rounded-[7px]" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Resources */}
              <section className="rounded-[14px] border border-line bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-[7px]" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-[7px] border border-line px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Skeleton className="size-4 rounded-full" />
                        <div className="min-w-0 flex-1">
                          <Skeleton className="h-4 w-32 rounded-[7px]" />
                          <Skeleton className="mt-1 h-3 w-16 rounded-[7px]" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-8 rounded-[7px]" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Quiz sidebar */}
            <div>
              <section className="rounded-[14px] border border-line bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-[7px]" />
                </div>
                <div className="space-y-3">
                  <div className="rounded-[7px] bg-teal-soft p-3">
                    <Skeleton className="h-5 w-32 rounded-[7px]" />
                    <Skeleton className="mt-1 h-4 w-24 rounded-[7px]" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-[7px]" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

  );
};

export default LessonSkeleton;