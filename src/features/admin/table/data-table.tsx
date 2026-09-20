import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import CustomPagination from "@/shared/components/common/Pagination/CustomPagination";

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: Pagination;
  pageCount: number;
  onPaginationChange: React.Dispatch<React.SetStateAction<Pagination>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  pageCount,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
    onPaginationChange,
    state: {
      sorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div className="rounded-xl border border-border/40 bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-border/30 bg-muted/20 hover:bg-muted/20"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`${header.id === "activationStatus" && "text-left"} h-11 px-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b border-border/20 transition-colors hover:bg-muted/10 last:border-b-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-muted-foreground/40">
                    No members found
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pageCount >= 1 && (
        <>
          <div className="h-px bg-border/30" />
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-xs text-muted-foreground text-nowrap">
              Page {pageIndex} of {pageCount}
            </p>
            <CustomPagination
              pageIndex={pageIndex}
              count={pageCount}
              pageSize={pagination.pageSize}
              onPageChange={onPaginationChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
