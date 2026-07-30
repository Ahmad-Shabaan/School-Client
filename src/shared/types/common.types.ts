import type { ROLES } from "@/config/constants";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}
export type PaginationParams = {
  pageIndex: number;
  pageSize: number;
  count: number;
  // onPageChange: (page: number) => void;
  onPageChange: React.Dispatch<React.SetStateAction<Pagination>>
};

export type SectionAnimationParams = {
  sectionRef: React.RefObject<HTMLDivElement | null>;
    dependencies?: unknown[]; // allow passing dependencies to re-run animation on updates (e.g. when books data changes)
};

export type Role = (typeof ROLES)[keyof typeof ROLES];
