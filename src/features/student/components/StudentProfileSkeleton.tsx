import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Bone = ({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => (
  <Skeleton tone="brand" className={className} delay={delay} />
);

const INFO_FIELDS = 4;
const COURSE_PLACEHOLDERS = 6;

const StudentProfileSkeleton = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="جارٍ تحميل الملف الشخصي"
    >
      <span className="sr-only">جارٍ التحميل…</span>

      {/* Page title */}
      <section className="mb-8 text-center">
        <Bone className="mx-auto h-7 w-40 sm:h-8 sm:w-48" />
        <span className="mx-auto my-0.75 block w-10 rounded-[2px] bg-gold" />
        <Bone
          className="mx-auto mt-3 h-4 w-64 max-w-full sm:w-80"
          delay={0.08}
        />
      </section>

      {/* Student info card */}
      <section className="mb-10 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sm:p-7">
        <div className="flex flex-col items-center gap-5 min-[650px]:flex-row min-[650px]:gap-7">
          <Bone
            className="size-27.5 flex-shrink-0 rounded-full border-2 border-gold/40"
            delay={0.1}
          />

          <div className="grid w-full grid-cols-2 gap-4 min-[650px]:grid-cols-4">
            {Array.from({ length: INFO_FIELDS }).map((_, index) => {
              const delay = 0.12 + index * 0.04;

              return (
                <div key={index} className="min-w-0 space-y-2">
                  <Bone className="h-3 w-16" delay={delay} />
                  <div className="flex items-center gap-1.5">
                    <Bone
                      className="h-4 w-24 max-w-full"
                      delay={delay + 0.02}
                    />
                    {index === 1 && (
                      <Bone
                        className="size-6 flex-none rounded-md border border-line"
                        delay={delay + 0.04}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <div className="mb-2 flex items-center justify-between">
            <Bone className="h-4 w-24" delay={0.3} />
            <Bone className="h-4 w-10" delay={0.32} />
          </div>
          <Bone className="h-2.5 w-full rounded-full" delay={0.34} />
        </div>
      </section>

      {/* Courses */}
      <section>
        <div className="mb-5">
          <Bone className="h-6 w-40 sm:h-7 sm:w-48" delay={0.36} />
          <Bone className="mt-2 h-4 w-56" delay={0.38} />
        </div>

        <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
          {Array.from({ length: COURSE_PLACEHOLDERS }).map((_, index) => {
            const delay = 0.42 + index * 0.05;

            return (
              <article
                key={index}
                className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
              >
                <Bone className="mb-2 h-5 w-3/4" delay={delay} />
                <Bone className="mb-2 h-3.5 w-full" delay={delay + 0.02} />
                <Bone className="mb-5 h-3.5 w-4/5" delay={delay + 0.04} />
                <Bone className="mb-4 h-3 w-12" delay={delay + 0.06} />
                <Bone
                  className={cn("mt-auto h-10 w-full rounded-md")}
                  delay={delay + 0.08}
                />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StudentProfileSkeleton;
