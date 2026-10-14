

import type { ApiErrorResponse } from "@/shared/types/api.types";
import { STUDENT_COURSES_GC_TIME, STUDENT_COURSES_QUERY_KEY, STUDENT_COURSES_STALE_TIME } from "../constants/student.constants";
import { getUserCourses } from "../services/studentService";
import type { GetCoursesResponse } from "@/features/admin/types/course.types";
import { queryOptions } from "@tanstack/react-query";
export const coursesQueryOptions = (email?: string) =>
  queryOptions<GetCoursesResponse, ApiErrorResponse>({
    queryKey:   STUDENT_COURSES_QUERY_KEY.all(),
    queryFn: () => getUserCourses(email),
    staleTime:  STUDENT_COURSES_STALE_TIME,
    gcTime: STUDENT_COURSES_GC_TIME,
    enabled: !!email,
});
