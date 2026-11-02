import { Skeleton } from "@/components/ui/skeleton";

const Bone = ({
  className,
  delay = 0,
  tone = "brand",
}: {
  className?: string;
  delay?: number;
  tone?: "brand" | "paper";
}) => (
  <Skeleton tone={tone} className={className} delay={delay} />
);

const GOAL_PLACEHOLDERS = 3;
const RESOURCE_PLACEHOLDERS = 2;

const LessonSkeleton = () => {
  return (
    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9">
        <div
          role="status"
          aria-busy="true"
          aria-label="جارٍ تحميل الدرس"
        >
          <span className="sr-only">جارٍ التحميل…</span>

          {/* Breadcrumb + title */}
          <div className="mb-6">
            <Bone className="mb-3 h-4 w-44 rounded-[7px]" delay={0.02} />

            <div className="mb-[18px] flex flex-wrap items-center gap-3">
              <Bone className="h-6 w-16 rounded-full" delay={0.04} />
              <Bone className="h-6 w-28 rounded-full" delay={0.05} />
              <Bone className="h-6 w-24 rounded-full" delay={0.06} />
            </div>

            <Bone className="h-9 w-2/3 rounded-[7px] sm:h-11" delay={0.07} />
            <span className="mx-auto my-2 mr-0 block w-10 rounded-[2px] bg-gold" />
            <Bone className="mt-3 h-4 w-full rounded-[7px]" delay={0.08} />
            <Bone className="mt-2 h-4 w-4/5 rounded-[7px]" delay={0.09} />
          </div>

          {/* Video section */}
          <div className="mb-6">
            <div className="overflow-hidden rounded-[14px] border border-line bg-white">
              <Bone
                className="aspect-video w-full rounded-none"
                delay={0.1}
                tone="paper"
              />
            </div>

            {/* Progress */}
            <div className="mt-4 rounded-[14px] border border-line bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bone className="size-4 rounded-full" delay={0.12} />
                  <Bone className="h-4 w-20 rounded-[7px]" delay={0.13} />
                </div>
                <Bone className="h-4 w-10 rounded-[7px]" delay={0.14} />
              </div>
              <Bone className="h-2.5 w-full rounded-full" delay={0.15} />
              <Bone className="mt-3 h-3 w-3/4 rounded-[7px]" delay={0.16} />
            </div>
          </div>

          {/* Meeting */}
          <div className="mb-6 rounded-[14px] border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Bone
                  className="size-11 flex-none rounded-xl"
                  delay={0.17}
                />
                <div>
                  <Bone className="h-4 w-24 rounded-[7px]" delay={0.18} />
                  <Bone className="mt-2 h-3 w-36 rounded-[7px]" delay={0.19} />
                </div>
              </div>
              <Bone
                className="h-9 w-32 flex-none rounded-[7px]"
                delay={0.2}
                tone="paper"
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Goals + resources */}
            <div className="space-y-6 lg:col-span-2">
              {/* Goals */}
              <section className="rounded-[14px] border border-line bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Bone className="size-5 rounded-full" delay={0.22} />
                  <Bone className="h-6 w-24 rounded-[7px]" delay={0.23} />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: GOAL_PLACEHOLDERS }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2"
                      aria-hidden="true"
                    >
                      <Bone
                        className="mt-1 size-3.5 flex-none rounded-full"
                        delay={0.24 + index * 0.03}
                      />
                      <Bone
                        className="h-4 w-full rounded-[7px]"
                        delay={0.25 + index * 0.03}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Resources */}
              <section className="rounded-[14px] border border-line bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Bone className="size-5 rounded-full" delay={0.34} />
                  <Bone className="h-6 w-24 rounded-[7px]" delay={0.35} />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: RESOURCE_PLACEHOLDERS }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 rounded-[7px] border border-line px-4 py-3"
                        aria-hidden="true"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <Bone
                            className="size-4 flex-none rounded-full"
                            delay={0.36 + index * 0.03}
                          />
                          <div className="min-w-0 flex-1">
                            <Bone
                              className="h-4 w-32 rounded-[7px]"
                              delay={0.37 + index * 0.03}
                            />
                            <Bone
                              className="mt-1.5 h-3 w-16 rounded-[7px]"
                              delay={0.38 + index * 0.03}
                            />
                          </div>
                        </div>
                        <Bone
                          className="h-4 w-8 flex-none rounded-[7px]"
                          delay={0.39 + index * 0.03}
                        />
                      </div>
                    ),
                  )}
                </div>
              </section>
            </div>

            {/* Quiz sidebar */}
            <div>
              <section className="rounded-[14px] border border-line bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Bone className="size-5 rounded-full" delay={0.42} />
                  <Bone className="h-6 w-20 rounded-[7px]" delay={0.43} />
                </div>
                <div className="space-y-3">
                  <div className="rounded-[7px] bg-paper p-3">
                    <Bone className="h-5 w-32 rounded-[7px]" delay={0.44} />
                    <Bone
                      className="mt-1.5 h-4 w-24 rounded-[7px]"
                      delay={0.45}
                    />
                  </div>
                  <Bone
                    className="h-10 w-full rounded-[7px]"
                    delay={0.46}
                    tone="paper"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LessonSkeleton;
