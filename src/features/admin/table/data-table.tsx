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
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  // const pageCount = table.getPageCount();

  return (
    <div className="hide-scrollbar rounded-xl bg-surface-container-low shadow-soft border border-outline-variant/10 overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-outline-variant/5 bg-surface-container hover:bg-surface-container"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-12 px-6 text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
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
        <TableBody className="border border-border">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b border-outline-variant/5 transition-colors hover:bg-surface-container/40 last:border-b-0"
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
                className="h-32 text-center text-sm text-on-surface-variant"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pageCount >= 1 && (
        <>
          <div className="h-px bg-linear-to-r from-transparent via-outline-variant/30 to-transparent" />
          <div className="flex items-center justify-between px-6 py-4">
            <CustomPagination
              pageIndex={pageIndex}
              count={pageCount}
              pageSize={pagination.pageSize}
              onPageChange={onPaginationChange}
            />
          </div>
          {/* 
            <p className="text-sm text-on-surface-variant">
              Page {pageIndex + 1} of {pageCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-highest border border-outline-variant/15 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ${
                      i === pageIndex
                        ? "bg-linear-to-br from-primary to-secondary text-on-primary"
                        : "bg-surface-container-highest border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-highest border border-outline-variant/15 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}
