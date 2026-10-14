
export const STUDENT_COURSES_STALE_TIME = 300_000;
export const STUDENT_COURSES_GC_TIME = 1_800_000;

export const STUDENT_COURSES_QUERY_KEY = {
  all: () => ["student", "courses"] as const,
  details: (id: string) => ["student", "courses", "details", id] as const,
};