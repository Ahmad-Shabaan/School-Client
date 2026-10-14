
export const COURSES_STALE_TIME = 300_000;
export const COURSES_GC_TIME = 1_800_000;

export const COURSES_QUERY_KEY = {
  all: () => ["courses"] as const,
  details: (id: string) => ["courses", "details", id] as const,
};