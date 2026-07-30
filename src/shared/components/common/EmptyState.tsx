import { HeartCrack } from "lucide-react";
import React, { type ReactNode } from "react";
interface WishlistEmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: ReactNode;
}
const EmptyState: React.FC<WishlistEmptyStateProps> = ({
  message = "Your wishlist is empty",
  subMessage = "Looks like you haven't saved any books for later yet. Start exploring our library to find your next great read.",
  icon = <HeartCrack size={34} className="text-primary" />,
}) => {
  return (
    <div className="min-h-[calc(100svh-262px)] flex flex-col">
      <div className="flex-1 col-center text-center  pt-12 sm:pt-14  lg:pt-16 px-4 bg-surface-container-low rounded-xl border border-outline-variant/15 border-dashed">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-outline-variant/30">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-on-surface mb-2">{message}</h3>
        <p className="text-on-surface-variant max-w-md mb-8">{subMessage}</p>
      </div>
    </div>
  );
};
export default EmptyState;
