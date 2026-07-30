import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils/formatDate";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, Eye  } from "lucide-react";
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
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-medium text-on-surface">
          {row.original.firstName + " " + row.original.lastName}
        </span>
        <span className="text-sm sm:text-sm font-normal text-muted">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="text-sm sm:text-base font-medium text-on-surface">
        {row.original.userName}
      </span>
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "activationStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const status = row.original.isActive ? "Active" : "Inactive";
      // const config = statusConfig[status];
      return (
        <UpdateUserActivation
          userId={row.original.id}
          activation={row.original.isActive}
        />
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex-center w-8 h-8 rounded-full bg-surface-dim hover:bg-surface-variant"
              to={`${row.original.id}`}

            >
              <Eye size={16} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>View</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <UpdateUserForm user={row.original} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <DeleteUserAlert userId={row.original.id} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];
