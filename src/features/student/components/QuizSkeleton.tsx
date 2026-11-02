import { Skeleton } from "@/components/ui/skeleton";

const Bone = ({
  className,
  delay = 0,
  tone = "brand",
}: {
  className?: string;
  delay?: number;
  tone?: "brand" | "paper";
}) => <Skeleton tone={tone} className={className} delay={delay} />;

const QUESTIONS_PLACEHOLDER = 3;
const OPTIONS_PER_QUESTION = 4;
const ATTEMPT_PLACEHOLDERS = 2;

const QuizSkeleton = () => (
  <main className="w-full flex-1">
    <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9">
      <div
        role="status"
        aria-busy="true"
        aria-label="جارٍ تحميل الاختبار"
      >
        <span className="sr-only">جارٍ التحميل…</span>

        {/* Header */}
        <div className="mb-6">
          <Bone className="mb-4 h-4 w-28 rounded-[7px]" delay={0.02} />

          <Bone
            className="h-9 w-2/3 rounded-[7px] sm:h-11"
            delay={0.04}
          />
          <span className="mr-0 my-2 mx-auto block w-10 rounded-[2px] bg-gold" />

          <Bone
            className="mt-2 h-4 w-56 max-w-full rounded-[7px]"
            delay={0.07}
          />
        </div>

        {/* Quiz result banner placeholder */}
        <div className="mb-6 rounded-[14px] border border-line bg-white p-6">
          <div className="flex items-center gap-3">
            <Bone className="size-8 flex-none rounded-full" delay={0.1} />
            <div className="min-w-0">
              <Bone className="h-5 w-40 rounded-[7px]" delay={0.11} />
              <Bone
                className="mt-2 h-4 w-24 rounded-[7px]"
                delay={0.12}
              />
            </div>
          </div>
          <Bone
            className="mt-4 h-2.5 w-full rounded-full"
            delay={0.13}
          />
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {Array.from({ length: QUESTIONS_PLACEHOLDER }).map(
            (_, questionIndex) => {
              const questionDelay = 0.16 + questionIndex * 0.22;

              return (
                <section
                  key={questionIndex}
                  className="rounded-[14px] border border-line bg-white p-6"
                  aria-hidden="true"
                >
                  <div className="mb-4 flex items-start gap-2">
                    <Bone
                      className="ml-2 mt-0.5 size-5 flex-none rounded-full"
                      delay={questionDelay}
                    />
                    <Bone
                      className="h-5 w-3/4 rounded-[7px]"
                      delay={questionDelay + 0.01}
                    />
                  </div>

                  <div className="space-y-2.5">
                    {Array.from({ length: OPTIONS_PER_QUESTION }).map(
                      (_, optionIndex) => {
                        const optionDelay =
                          questionDelay + 0.03 + optionIndex * 0.04;

                        return (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3 rounded-[7px] border border-line px-4 py-3"
                          >
                            <Bone
                              className="size-6 flex-none rounded-full"
                              delay={optionDelay}
                            />
                            <Bone
                              className="h-4 w-full max-w-[70%] rounded-[7px]"
                              delay={optionDelay + 0.01}
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              );
            },
          )}
        </div>

        {/* Submit */}
        <Bone
          className="mt-6 h-12 w-full rounded-[7px]"
          delay={0.9}
          tone="paper"
        />

        {/* Attempts history */}
        <section className="mt-8 rounded-[14px] border border-line bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bone className="size-5 rounded-full" delay={0.94} />
            <Bone className="h-6 w-32 rounded-[7px]" delay={0.95} />
          </div>

          <div className="space-y-2">
            {Array.from({ length: ATTEMPT_PLACEHOLDERS }).map(
              (_, index) => {
                const delay = 0.97 + index * 0.06;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-[7px] border border-line px-4 py-3"
                    aria-hidden="true"
                  >
                    <Bone className="h-4 w-20 rounded-[7px]" delay={delay} />
                    <div className="flex items-center gap-3">
                      <Bone
                        className="h-4 w-10 rounded-[7px]"
                        delay={delay + 0.01}
                      />
                      <Bone
                        className="h-4 w-12 rounded-[7px]"
                        delay={delay + 0.02}
                      />
                      <Bone
                        className="h-3 w-14 rounded-[7px]"
                        delay={delay + 0.03}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      </div>
    </div>
  </main>
);

export default QuizSkeleton;
