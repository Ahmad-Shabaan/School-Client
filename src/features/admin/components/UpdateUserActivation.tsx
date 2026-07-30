import { Button } from "@/components/ui/button";
import { LockKeyholeIcon, LockKeyholeOpen } from "lucide-react";
import { useUpdateUserStatus } from "../hooks/useDashboard";

type UserActivationStatus = "Active" | "Inactive";

const statusConfig: Record<
  UserActivationStatus,
  { label: string; dotColor: string; dotShadow: string }
> = {
  Active: {
    label: "Active",
    dotColor: "bg-secondary-dim",
    dotShadow: "shadow-[0_0_8px_rgba(156,72,234,0.6)]",
  },
  Inactive: {
    label: "Inactive",
    dotColor: "bg-error-dim",
    dotShadow: "shadow-[0_0_8px_rgba(215,51,87,0.6)]",
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
  const { handleUpdateUserStatus } = useUpdateUserStatus();
  return (
    <Button
      variant={"ghost"}
      onClick={() => handleUpdateUserStatus({ userId, isActive: !activation })}
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-highest border border-outline-variant/20 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-on-surface-variant">
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${config.dotShadow}`}
        />
        {config.label}
        {activation ? <LockKeyholeIcon /> : <LockKeyholeOpen />}
      </span>
    </Button>
  );
};

export default UpdateUserActivation;
