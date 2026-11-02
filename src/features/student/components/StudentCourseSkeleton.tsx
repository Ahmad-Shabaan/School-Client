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

const LESSON_PLACEHOLDERS = 6;

const StudentCourseSkeleton = () => {
  return (
    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9 sm:pb-[50px]">
        {/* Course shell */}
        <section className="mb-7 overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_4px_14px_rgba(22,48,42,0.04)]">
          <div className="border-b border-line bg-gradient-to-l from-teal-soft/70 via-paper to-gold-soft/50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <Bone
                  className="size-12 flex-none rounded-2xl border border-gold/40"
                  delay={0.02}
                />
                <div className="min-w-0">
                  <Bone className="h-3 w-20" delay={0.04} />
                  <Bone className="mt-2 h-6 w-48 max-w-full" delay={0.06} />
                </div>
              </div>

              <Bone
                className="h-9 w-24 flex-none rounded-[10px]"
                delay={0.08}
              />
            </div>

            <Bone className="mt-3 h-4 w-full max-w-3xl" delay={0.1} />
            <Bone className="mt-2 h-4 w-2/3 max-w-3xl" delay={0.12} />
          </div>

          <nav className="flex gap-2 p-3" aria-hidden="true">
            <Bone
              className="h-10 flex-1 rounded-xl sm:flex-none sm:px-6 sm:w-32"
              delay={0.14}
              tone="paper"
            />
            <Bone
              className="h-10 flex-1 rounded-xl sm:flex-none sm:px-6 sm:w-32"
              delay={0.16}
            />
          </nav>
        </section>

        {/* Lessons */}
        <section aria-hidden="true">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <Bone className="h-5 w-24 sm:h-6 sm:w-28" delay={0.18} />
              <Bone className="mt-2 h-4 w-44" delay={0.2} />
            </div>
            <Bone className="h-7 w-16 rounded-full" delay={0.22} />
          </div>

          <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
            {Array.from({ length: LESSON_PLACEHOLDERS }).map((_, index) => {
              const delay = 0.26 + index * 0.05;

              return (
                <article
                  key={index}
                  className="flex flex-col rounded-[14px] border border-line bg-white p-6"
                >
                  <div className="mb-[18px] flex items-center justify-between">
                    <Bone
                      className="size-13.75 rounded-xl"
                      delay={delay}
                    />
                    <Bone
                      className="h-6 w-16 rounded-full"
                      delay={delay + 0.01}
                    />
                  </div>

                  <Bone
                    className="mb-2.25 h-6 w-3/4 rounded-[7px]"
                    delay={delay + 0.02}
                  />

                  <div className="mb-3 flex flex-wrap gap-2">
                    <Bone
                      className="h-5 w-12 rounded-full"
                      delay={delay + 0.03}
                    />
                    <Bone
                      className="h-5 w-16 rounded-full"
                      delay={delay + 0.04}
                    />
                  </div>

                  <div className="mb-4 border-t border-line pt-3.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <Bone
                        className="h-3 w-20 rounded-[7px]"
                        delay={delay + 0.05}
                      />
                      <Bone
                        className="h-3 w-10 rounded-[7px]"
                        delay={delay + 0.06}
                      />
                    </div>
                    <Bone
                      className="h-2.5 w-full rounded-full"
                      delay={delay + 0.07}
                    />
                  </div>

                  <div className="mb-4 rounded-[7px] border border-line bg-paper p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <div className="flex items-center gap-1">
                        <Bone
                          className="size-3.5 rounded-full"
                          delay={delay + 0.08}
                        />
                        <Bone
                          className="h-3 w-16 rounded-[7px]"
                          delay={delay + 0.09}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Bone
                          className="size-3.5 rounded-full"
                          delay={delay + 0.1}
                        />
                        <Bone
                          className="h-3 w-24 rounded-[7px]"
                          delay={delay + 0.11}
                        />
                      </div>
                    </div>
                    <Bone
                      className="h-8 w-full rounded-[7px]"
                      delay={delay + 0.12}
                    />
                  </div>

                  <Bone
                    className="mt-auto h-10 w-full rounded-[7px]"
                    delay={delay + 0.13}
                  />
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default StudentCourseSkeleton;
