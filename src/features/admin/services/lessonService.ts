import axiosClient from "@/shared/api/axiosClient";
import type {
  CourseLessonsResponse,
  CreateLessonRequest,
  LessonAccessResponse,
  LessonDetailsResponse,
  LessonProgressResponse,
  QuizAnswerInput,
  QuizAttemptResponse,
  QuizAttemptsResponse,
  QuizManagementResponse,
  QuizPayloadRequest,
  QuizResponse,
  SubmitProgressRequest,
  UpdateLessonRequest,
} from "../types/lesson.types";

export const getCourseLessons = async (
  courseId: number,
): Promise<CourseLessonsResponse> => {
  const response = await axiosClient.get<CourseLessonsResponse>(
    `/lessons/course/${courseId}`,
  );
  return response.data;
};

export const getLessonDetails = async (
  lessonId: number,
): Promise<LessonDetailsResponse> => {
  const response = await axiosClient.get<LessonDetailsResponse>(
    `/lessons/${lessonId}`,
  );
  return response.data;
};

export const createLessonApi = async (
  lesson: CreateLessonRequest,
): Promise<LessonDetailsResponse> => {
  const response = await axiosClient.post<LessonDetailsResponse>(
    "/lessons",
    lesson,
  );
  return response.data;
};

export const updateLessonApi = async ({
  id,
  lesson,
}: {
  id: number;
  lesson: UpdateLessonRequest;
}): Promise<LessonDetailsResponse> => {
  const response = await axiosClient.put<LessonDetailsResponse>(
    `/lessons/${id}`,
    lesson,
  );
  return response.data;
};

export const deleteLessonApi = async (
  id: number,
): Promise<LessonDetailsResponse> => {
  const response = await axiosClient.delete<LessonDetailsResponse>(
    `/lessons/${id}`,
  );
  return response.data;
};

export const getLessonAccess = async (
  lessonId: number,
): Promise<LessonAccessResponse> => {
  const response = await axiosClient.get<LessonAccessResponse>(
    `/lessons/${lessonId}/access`,
  );
  return response.data;
};

export const getLessonProgress = async (
  lessonId: number,
): Promise<LessonProgressResponse> => {
  const response = await axiosClient.get<LessonProgressResponse>(
    `/lessons/${lessonId}/progress`,
  );
  return response.data;
};

export const submitProgressReport = async (
  lessonId: number,
  report: SubmitProgressRequest,
): Promise<LessonProgressResponse> => {
  const response = await axiosClient.post<LessonProgressResponse>(
    `/lessons/${lessonId}/progress`,
    report,
  );
  return response.data;
};

export const getQuizByLesson = async (
  lessonId: number,
): Promise<QuizResponse> => {
  const response = await axiosClient.get<QuizResponse>(
    `/lessons/${lessonId}/quiz`,
  );
  return response.data;
};

export const getQuizAttempts = async (
  lessonId: number,
): Promise<QuizAttemptsResponse> => {
  const response = await axiosClient.get<QuizAttemptsResponse>(
    `/lessons/${lessonId}/quiz/attempts`,
  );
  return response.data;
};

export const submitQuizAttempt = async (
  lessonId: number,
  answers: QuizAnswerInput[],
): Promise<QuizAttemptResponse> => {
  const response = await axiosClient.post<QuizAttemptResponse>(
    `/lessons/${lessonId}/quiz/attempts`,
    { answers },
  );
  return response.data;
};

export const getQuizManagement = async (
  lessonId: number,
): Promise<QuizManagementResponse> => {
  const response = await axiosClient.get<QuizManagementResponse>(
    `/lessons/${lessonId}/quiz/manage`,
  );
  return response.data;
};

export const createQuizApi = async (
  lessonId: number,
  quiz: QuizPayloadRequest,
): Promise<QuizManagementResponse> => {
  const response = await axiosClient.post<QuizManagementResponse>(
    `/lessons/${lessonId}/quiz`,
    quiz,
  );
  return response.data;
};

export const updateQuizApi = async (
  lessonId: number,
  quiz: QuizPayloadRequest,
): Promise<QuizManagementResponse> => {
  const response = await axiosClient.put<QuizManagementResponse>(
    `/lessons/${lessonId}/quiz`,
    quiz,
  );
  return response.data;
};

export const deleteQuizApi = async (
  lessonId: number,
): Promise<QuizManagementResponse> => {
  const response = await axiosClient.delete<QuizManagementResponse>(
    `/lessons/${lessonId}/quiz`,
  );
  return response.data;
};
