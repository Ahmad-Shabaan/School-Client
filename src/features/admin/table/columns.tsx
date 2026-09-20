import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils/formatDate";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, Eye } from "lucide-react";
import type { UserDto } from "../types/dashboard.types";
import DeleteUserAlert from "../components/DeleteUserAlert";
import { Link } from "react-router-dom";
import UpdateUserForm from "../components/UpdateUserForm";
import UpdateUserActivation from "../components/UpdateUserActivation";

export const columns: ColumnDef<UserDto>[] = [
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-secondary/20 text-xs font-semibold text-primary">
          {row.original.firstName?.[0]}
          {row.original.lastName?.[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {row.original.firstName + " " + row.original.lastName}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-foreground/80">
        {row.original.userName}
      </span>
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "activationStatus",
    header: "Status",
    cell: ({ row }) => (
      <UpdateUserActivation
        userId={row.original.id}
        activation={row.original.isActive}
      />
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
        Actions
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              to={`${row.original.id}`}
            >
              <Eye size={14} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>View details</p>
          </TooltipContent>
        </Tooltip>
        <UpdateUserForm user={row.original} />

        <DeleteUserAlert userId={row.original.id} />
      </div>
    ),
  },
];
