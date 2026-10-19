import { queryOptions } from "@tanstack/react-query";
import {
  COURSES_GC_TIME,
  COURSES_QUERY_KEY,
  COURSES_STALE_TIME,
} from "../constants/courses.constants";

import type { ApiErrorResponse } from "@/shared/types/api.types";

import type {
  CourseResponse,
  GetCoursesResponse,
} from "../types/course.types";
import { getCourseApi, getCourses } from "../services/courseService";
export const coursesQueryOptions = () =>
  queryOptions<GetCoursesResponse, ApiErrorResponse>({
    queryKey:   COURSES_QUERY_KEY.all(),
    queryFn: getCourses,
    staleTime:  COURSES_STALE_TIME,
    gcTime: COURSES_GC_TIME,
  });

export const courseQueryOptions = (courseId: number) =>
  queryOptions<CourseResponse, ApiErrorResponse>({
    queryKey: COURSES_QUERY_KEY.details(String(courseId)),
    queryFn: () => getCourseApi(courseId),
    staleTime: COURSES_STALE_TIME,
    gcTime: COURSES_GC_TIME,
    enabled: Number.isFinite(courseId) && courseId > 0,
  });
