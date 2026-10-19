export const LESSONS_STALE_TIME = 300_000;
export const LESSONS_GC_TIME = 1_800_000;

export const LESSONS_QUERY_KEY = {
  all: () => ["lessons"] as const,
  courseLessons: (courseId: number) =>
    ["lessons", "course", courseId] as const,
  details: (lessonId: number) => ["lessons", "details", lessonId] as const,
  access: (lessonId: number) => ["lessons", "access", lessonId] as const,
  progress: (lessonId: number) => ["lessons", "progress", lessonId] as const,
};

export const QUIZ_QUERY_KEY = {
  all: () => ["quiz"] as const,
  byLesson: (lessonId: number) => ["quiz", "lesson", lessonId] as const,
  manage: (lessonId: number) => ["quiz", "manage", lessonId] as const,
  attempts: (lessonId: number) => ["quiz", "attempts", lessonId] as const,
};
