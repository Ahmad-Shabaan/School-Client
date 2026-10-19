import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import {
  LESSONS_QUERY_KEY,
  QUIZ_QUERY_KEY,
} from "../constants/lessons.constants";
import {
  createLessonApi,
  createQuizApi,
  deleteLessonApi,
  deleteQuizApi,
  submitQuizAttempt,
  updateLessonApi,
  updateQuizApi,
} from "../services/lessonService";
import type {
  CreateLessonRequest,
  LessonDetailsResponse,
  QuizAnswerInput,
  QuizAttemptResponse,
  QuizManagementResponse,
  QuizPayloadRequest,
  UpdateLessonRequest,
} from "../types/lesson.types";

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LessonDetailsResponse,
    AxiosError,
    CreateLessonRequest
  >({
    mutationFn: createLessonApi,
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Lesson has been created successfully.");
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleCreateLesson: (lesson: CreateLessonRequest) =>
      mutation.mutate(lesson),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LessonDetailsResponse,
    AxiosError,
    { id: number; lesson: UpdateLessonRequest }
  >({
    mutationFn: updateLessonApi,
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Lesson has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleUpdateLesson: (id: number, lesson: UpdateLessonRequest) =>
      mutation.mutate({ id, lesson }),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<LessonDetailsResponse, AxiosError, number>({
    mutationFn: deleteLessonApi,
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Lesson has been deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleDeleteLesson: (lessonId: number) => mutation.mutate(lessonId),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    QuizManagementResponse,
    AxiosError,
    { lessonId: number; quiz: QuizPayloadRequest }
  >({
    mutationFn: ({ lessonId, quiz }) => createQuizApi(lessonId, quiz),
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Quiz has been created successfully.");
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
      queryClient.invalidateQueries({
        queryKey: QUIZ_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleCreateQuiz: (lessonId: number, quiz: QuizPayloadRequest) =>
      mutation.mutate({ lessonId, quiz }),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    QuizManagementResponse,
    AxiosError,
    { lessonId: number; quiz: QuizPayloadRequest }
  >({
    mutationFn: ({ lessonId, quiz }) => updateQuizApi(lessonId, quiz),
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Quiz has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
      queryClient.invalidateQueries({
        queryKey: QUIZ_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleUpdateQuiz: (lessonId: number, quiz: QuizPayloadRequest) =>
      mutation.mutate({ lessonId, quiz }),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<QuizManagementResponse, AxiosError, number>({
    mutationFn: deleteQuizApi,
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Quiz has been deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
      queryClient.invalidateQueries({
        queryKey: QUIZ_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleDeleteQuiz: (lessonId: number) => mutation.mutate(lessonId),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    QuizAttemptResponse,
    AxiosError,
    { lessonId: number; answers: QuizAnswerInput[] }
  >({
    mutationFn: ({ lessonId, answers }) =>
      submitQuizAttempt(lessonId, answers),
    onError(error) {
      toast.error(handleErrorMessage(error).title);
    },
    onSuccess: (response) => {
      toast.success(
        response.message || "Your quiz attempt has been submitted.",
      );
      queryClient.invalidateQueries({
        queryKey: QUIZ_QUERY_KEY.all(),
      });
      queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleSubmitAttempt: (lessonId: number, answers: QuizAnswerInput[]) =>
      mutation.mutate({ lessonId, answers }),
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};
