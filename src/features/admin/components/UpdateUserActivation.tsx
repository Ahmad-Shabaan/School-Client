import { Button } from "@/components/ui/button";
import { LockKeyholeIcon, LockKeyholeOpen, Loader2 } from "lucide-react";
import { useUpdateUserStatus } from "../hooks/useDashboard";

type UserActivationStatus = "Active" | "Inactive";

const statusConfig: Record<
  UserActivationStatus,
  { label: string; dotColor: string; dotShadow: string; badgeVariant: "success" | "destructive" }
> = {
  Active: {
    label: "Active",
    dotColor: "bg-emerald-500",
    dotShadow: "shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    badgeVariant: "success",
  },
  Inactive: {
    label: "Inactive",
    dotColor: "bg-red-500",
    dotShadow: "shadow-[0_0_6px_rgba(239,68,68,0.4)]",
    badgeVariant: "destructive",
  },
};

const UpdateUserActivation = ({
  activation,
  userId,
}: {
  activation: boolean;
  userId: string;
}) => {
  const status = activation ? "Active" : "Inactive";
  const config = statusConfig[status];
  const { handleUpdateUserStatus, isLoading } = useUpdateUserStatus();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading}
      onClick={() => handleUpdateUserStatus({ userId, isActive: !activation })}
      className="h-8 px-3"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide bg-muted/30 border border-border/30">
          <span
            className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${config.dotShadow}`}
          />
          {config.label}
          {activation ? (
            <LockKeyholeIcon className="h-3 w-3 text-muted-foreground/60" />
          ) : (
            <LockKeyholeOpen className="h-3 w-3 text-muted-foreground/60" />
          )}
        </span>
      )}
    </Button>
  );
};

export default UpdateUserActivation;