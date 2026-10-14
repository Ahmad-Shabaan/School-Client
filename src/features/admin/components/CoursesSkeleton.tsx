import { SkeletonBlock } from "@/shared/components/common/SkeletonBlock";

const CoursesSkeleton = () => {
  return (
    <div className="page-container">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <SkeletonBlock className="h-8 w-40" />
            <div className="mt-2">
              <SkeletonBlock className="h-4 w-64" delay={0.05} />
            </div>
          </div>
          <SkeletonBlock
            className="h-8 w-36 rounded-md"
            delay={0.1}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-20 rounded-md" delay={0.05} />
            <SkeletonBlock className="h-8 w-20 rounded-md" delay={0.08} />
          </div>
          <SkeletonBlock
            className="h-9 w-full sm:w-64 rounded-lg"
            delay={0.1}
          />
        </div>

        {/* Count row */}
        <SkeletonBlock className="h-4 w-44" delay={0.12} />

        {/* Course grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => {
            const delay = 0.15 + i * 0.05;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border/40 bg-surface-container-lowest shadow-card"
              >
                <SkeletonBlock
                  className="aspect-16/10 w-full rounded-none"
                  delay={delay}
                />
                <div className="space-y-3 px-5 pt-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock
                      className="h-10 w-10 rounded-xl"
                      delay={delay + 0.04}
                    />
                    <SkeletonBlock
                      className="h-4 w-32"
                      delay={delay + 0.06}
                    />
                  </div>
                  <SkeletonBlock
                    className="h-3.5 w-full"
                    delay={delay + 0.09}
                  />
                  <SkeletonBlock
                    className="h-3.5 w-3/5"
                    delay={delay + 0.12}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/30 px-5 py-4">
                  <SkeletonBlock
                    className="h-7 w-28 rounded-md"
                    delay={delay + 0.15}
                  />
                  <div className="flex items-center gap-1.5">
                    <SkeletonBlock
                      className="h-8 w-8 rounded-lg"
                      delay={delay + 0.18}
                    />
                    <SkeletonBlock
                      className="h-8 w-8 rounded-lg"
                      delay={delay + 0.21}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesSkeleton;
