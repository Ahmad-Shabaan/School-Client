import { SkeletonBlock } from "@/shared/components/common/SkeletonBlock";

const COLUMNS = [
  { key: "member", align: "first:justify-start justify-start" },
  { key: "username", align: "justify-start" },
  { key: "date", align: "justify-start" },
  { key: "status", align: "justify-start" },
  { key: "actions", align: "justify-end" },
] as const;

const CELL_WIDTHS = ["w-48", "w-28", "w-24", "w-20", "w-24"];

const UsersSkeleton = () => {
  return (
    <div className="page-container space-y-6">
      <div>
        <SkeletonBlock className="h-8 w-48" />
        <div className="mt-2">
          <SkeletonBlock className="h-4 w-64" delay={0.05} />
        </div>
      </div>
      <div className="rounded-xl border border-border/40 shadow-card overflow-hidden">
        <div className="flex items-center gap-3 bg-muted/20 px-6 h-11 border-b border-border/30">
          {COLUMNS.map((col, i) => (
            <div
              key={col.key}
              className={`flex-1 flex items-center ${col.align}`}
            >
              <SkeletonBlock
                className="h-3 w-16"
                delay={0.02 + i * 0.03}
              />
            </div>
          ))}
        </div>
        <div>
          {Array.from({ length: 5 }, (_, i) => {
            const rowDelay = 0.1 + i * 0.06;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-6 py-4 border-b border-border/20 last:border-b-0"
              >
                <div className="flex-1 flex items-center gap-3">
                  <SkeletonBlock
                    className="h-9 w-9 rounded-full"
                    delay={rowDelay}
                  />
                  <div className="space-y-1.5">
                    <SkeletonBlock
                      className="h-3.5 w-32"
                      delay={rowDelay + 0.03}
                    />
                    <SkeletonBlock
                      className="h-3 w-40"
                      delay={rowDelay + 0.06}
                    />
                  </div>
                </div>
                {COLUMNS.slice(1).map((col, j) => (
                  <div
                    key={col.key}
                    className={`flex-1 flex items-center ${col.align}`}
                  >
                    <SkeletonBlock
                      className={`h-8 ${CELL_WIDTHS[j + 1]} rounded-md`}
                      delay={rowDelay + 0.09 + j * 0.03}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="h-px bg-border/30" />
        <div className="flex items-center justify-between px-6 py-4">
          <SkeletonBlock className="h-3 w-24" delay={0.02} />
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-8 rounded-lg" delay={0.04} />
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonBlock
                key={i}
                className="h-8 w-8 rounded-lg"
                delay={0.06 + i * 0.04}
              />
            ))}
            <SkeletonBlock className="h-8 w-8 rounded-lg" delay={0.1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSkeleton;