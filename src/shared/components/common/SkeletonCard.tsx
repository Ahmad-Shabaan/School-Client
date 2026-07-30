import { SkeletonBlock } from "./SkeletonBlock";

const SkeletonCard = ({ parentType }: { parentType: "Main" | "Wishlist" }) => {
  return (
    <div
      className={`overflow-hidden bg-surface-container-low flex
            ${parentType === "Main" ? "flex-row sm:flex-col" : "flex-col"}
            shadow-soft
      `}
    >
      <div className="flex items-center w-full">
        <div className="relative w-full max-h-full aspect-2/3 sm:aspect-2/3 overflow-hidden animate-pulse bg-surface-container" />
      </div>
      <div className="p-2 sm:p-1 relative space-y-1 w-full">
        <SkeletonBlock className="h-5 w-4/5" />
        <SkeletonBlock className="h-3.5 w-3/5" />
        <SkeletonBlock className="h-3.5 w-24" />
        <SkeletonBlock className="h-6 w-2/5" />
        {parentType === "Main" && (
          <>
            <SkeletonBlock className="sm:hidden h-3 w-16 mt-3" />
            <div className="sm:hidden space-y-1">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-4/5" />
            </div>
            <SkeletonBlock className="sm:hidden h-3 w-40" />
            <SkeletonBlock className="sm:hidden h-3 w-40" />
            <div className="sm:hidden flex justify-center mt-2">
              <SkeletonBlock className="h-8 w-28 rounded-md" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SkeletonCard;
