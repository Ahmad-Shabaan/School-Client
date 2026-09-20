import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationParams } from "@/shared/types/common.types";
import { useMemo } from "react";

const CustomPagination = ({
  pageIndex,
  pageSize,
  count: totalPages,
  onPageChange,
}: PaginationParams) => {
  const pages = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1;
    const left = Math.max(2, pageIndex - delta);
    const right = Math.min(totalPages - 1, pageIndex + delta);

    pages.push(1);
    if (left > 2) pages.push("ellipsis");
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    if (right < totalPages - 1) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  }, [totalPages, pageIndex]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (pageIndex > 1)
                onPageChange({ pageIndex: pageIndex - 1, pageSize });
            }}
            className={
              pageIndex === 1
                ? "pointer-events-none opacity-30"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                className="cursor-pointer"
                isActive={page === pageIndex}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange({ pageIndex: page, pageSize });
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (pageIndex < totalPages)
                onPageChange({ pageIndex: pageIndex + 1, pageSize });
            }}
            className={
              pageIndex === totalPages
                ? "pointer-events-none opacity-30"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;