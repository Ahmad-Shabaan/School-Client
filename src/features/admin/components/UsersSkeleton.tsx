import { SkeletonBlock } from "@/shared/components/common/SkeletonBlock";

const COLUMNS = [
  { key: "id", align: "first:justify-start justify-start" },
  { key: "date", align: "justify-start" },
  { key: "total", align: "justify-start" },
  { key: "status", align: "justify-start" },
  { key: "actions", align: "justify-end" },
] as const;

const HEADER_WIDTHS = ["w-16", "w-12", "w-12", "w-14", "w-14"];
const CELL_WIDTHS = ["w-28", "w-24", "w-20", "w-28", "w-24"];

const UsersSkeleton = () => {
  return (
    <main className="main-container flex-1">
      <div className="page-container">
        <div className="mb-10 animate-in fade-in duration-700">
          <SkeletonBlock className="h-9 w-48" />
          <div className="mt-2.5 flex items-center gap-2">
            <SkeletonBlock className="h-4 w-64" delay={0.05} />
          </div>
        </div>
        <div className="hide-scrollbar rounded-xl bg-surface-container-low shadow-soft border border-outline-variant/10 overflow-hidden">
          <div className="flex items-center gap-3 bg-surface-container px-6 h-12 border-b border-outline-variant/5 animate-in fade-in duration-700">
            {COLUMNS.map((col, i) => (
              <div
                key={col.key}
                className={`flex-1 flex items-center ${col.align}`}
              >
                <SkeletonBlock
                  className={`h-3 ${HEADER_WIDTHS[i]}`}
                  delay={0.02 + i * 0.03}
                />
              </div>
            ))}
          </div>
          <div className="animate-in fade-in duration-700">
            {Array.from({ length: 5 }, (_, i) => {
              const rowDelay = 0.1 + i * 0.06;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/5 last:border-b-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                >
                  {COLUMNS.map((col, j) => (
                    <div
                      key={col.key}
                      className={`flex-1 flex items-center ${col.align}`}
                    >
                      <SkeletonBlock
                        className={`h-8 ${CELL_WIDTHS[j]} rounded-md`}
                        delay={rowDelay + j * 0.03}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="h-px bg-linear-to-r from-transparent via-outline-variant/30 to-transparent" />
          <div className="flex items-center justify-between px-6 py-4 animate-in fade-in duration-700">
            <SkeletonBlock className="h-3 w-24" delay={0.02} />
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-9 w-9 rounded-lg" delay={0.04} />
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <SkeletonBlock
                    key={i}
                    className="h-9 w-9 rounded-lg"
                    delay={0.06 + i * 0.04}
                  />
                ))}
              </div>
              <SkeletonBlock className="h-9 w-9 rounded-lg" delay={0.1} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UsersSkeleton;
