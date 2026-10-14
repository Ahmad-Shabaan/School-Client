import { queryOptions } from "@tanstack/react-query";
import {
  COURSES_GC_TIME,
  COURSES_QUERY_KEY,
  COURSES_STALE_TIME,
} from "../constants/courses.constants";

import type { ApiErrorResponse } from "@/shared/types/api.types";

import type { GetCoursesResponse } from "../types/course.types";
import { getCourses } from "../services/courseService";
export const coursesQueryOptions = () =>
  queryOptions<GetCoursesResponse, ApiErrorResponse>({
    queryKey:   COURSES_QUERY_KEY.all(),
    queryFn: getCourses,
    staleTime:  COURSES_STALE_TIME,
    gcTime: COURSES_GC_TIME,
  });
