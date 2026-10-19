import { Skeleton } from "@/components/ui/skeleton";
const StudentCourseSkeleton = () => {
  return (
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9 sm:pb-[50px]">
          <section className="mb-9 text-center">
            <Skeleton className="mx-auto h-9 w-40 rounded-[7px] sm:h-11 sm:w-48" />
            <div className="mx-auto my-2 w-10 rounded-[2px] bg-gold" />
            <Skeleton className="mx-auto mt-3 h-4 w-56 rounded-[7px]" />
          </section>

          <section>
            <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <article
                  key={i}
                  className="flex flex-col rounded-[14px] border border-line bg-white p-6"
                >
                  <div className="mb-[18px] flex items-center justify-between">
                    <Skeleton className="size-13.75 rounded-xl" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  <Skeleton className="mb-2.25 h-6 w-3/4 rounded-[7px]" />

                  <div className="mb-3 flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>

                  <div className="mb-4 border-t border-line pt-3.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <Skeleton className="h-3 w-20 rounded-[7px]" />
                      <Skeleton className="h-3 w-10 rounded-[7px]" />
                    </div>
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </div>

                  <div className="mb-4 rounded-[7px] border border-line bg-paper p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <div className="flex items-center gap-1">
                        <Skeleton className="size-3.5 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-[7px]" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="size-3.5 rounded-full" />
                        <Skeleton className="h-3 w-24 rounded-[7px]" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-full rounded-[7px]" />
                  </div>

                  <Skeleton className="mt-auto h-10 w-full rounded-[7px]" />
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

  );
};

export default StudentCourseSkeleton;