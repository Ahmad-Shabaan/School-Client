import type { UsersFilters } from "../types/dashboard.types";

export const USERS_STALE_TIME = 300_000;
export const USERS_GC_TIME = 1_800_000;

export const USERS_QUERY_KEY = {
  all: () => ["users"] as const,
  list: (filters: UsersFilters) => ["users", filters] as const,
  details: (id: string) => ["users", "details", id] as const,
};

export const EMAILS_STALE_TIME = 300_000;
export const EMAILS_GC_TIME = 1_800_000;  
export const EMAILS_QUERY_KEY = {
  all: () => ["emails"] as const,
  list: (courseId: number) => ["emails", courseId] as const,
};