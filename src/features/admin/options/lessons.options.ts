import { queryOptions } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import {
  LESSONS_GC_TIME,
  LESSONS_QUERY_KEY,
  LESSONS_STALE_TIME,
  QUIZ_QUERY_KEY,
} from "../constants/lessons.constants";
import {
  getCourseLessons,
  getLessonAccess,
  getLessonDetails,
  getLessonProgress,
  getQuizAttempts,
  getQuizByLesson,
  getQuizManagement,
} from "../services/lessonService";
import type {
  CourseLessonsResponse,
  LessonAccessResponse,
  LessonDetailsResponse,
  LessonProgressResponse,
  QuizAttemptsResponse,
  QuizManagementResponse,
  QuizResponse,
} from "../types/lesson.types";

export const courseLessonsQueryOptions = (courseId: number) =>
  queryOptions<CourseLessonsResponse, ApiErrorResponse>({
    queryKey: LESSONS_QUERY_KEY.courseLessons(courseId),
    queryFn: () => getCourseLessons(courseId),
    staleTime: LESSONS_STALE_TIME,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(courseId) && courseId > 0,
  });

export const lessonDetailsQueryOptions = (lessonId: number) =>
  queryOptions<LessonDetailsResponse, ApiErrorResponse>({
    queryKey: LESSONS_QUERY_KEY.details(lessonId),
    queryFn: () => getLessonDetails(lessonId),
    staleTime: LESSONS_STALE_TIME,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });

export const lessonAccessQueryOptions = (lessonId: number) =>
  queryOptions<LessonAccessResponse, ApiErrorResponse>({
    queryKey: LESSONS_QUERY_KEY.access(lessonId),
    queryFn: () => getLessonAccess(lessonId),
    staleTime: 0,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });

export const lessonProgressQueryOptions = (lessonId: number) =>
  queryOptions<LessonProgressResponse, ApiErrorResponse>({
    queryKey: LESSONS_QUERY_KEY.progress(lessonId),
    queryFn: () => getLessonProgress(lessonId),
    staleTime: 0,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });

export const quizByLessonQueryOptions = (lessonId: number) =>
  queryOptions<QuizResponse, ApiErrorResponse>({
    queryKey: QUIZ_QUERY_KEY.byLesson(lessonId),
    queryFn: () => getQuizByLesson(lessonId),
    staleTime: LESSONS_STALE_TIME,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });

export const quizAttemptsQueryOptions = (lessonId: number) =>
  queryOptions<QuizAttemptsResponse, ApiErrorResponse>({
    queryKey: QUIZ_QUERY_KEY.attempts(lessonId),
    queryFn: () => getQuizAttempts(lessonId),
    staleTime: 0,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });

export const quizManagementQueryOptions = (lessonId: number) =>
  queryOptions<QuizManagementResponse, ApiErrorResponse>({
    queryKey: QUIZ_QUERY_KEY.manage(lessonId),
    queryFn: () => getQuizManagement(lessonId),
    staleTime: LESSONS_STALE_TIME,
    gcTime: LESSONS_GC_TIME,
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });
