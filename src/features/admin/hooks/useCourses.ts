import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { COURSES_QUERY_KEY } from "../constants/courses.constants";
import {
  createCourseApi,
  deleteCourseApi,
  enrollStudentsInCourse,
  removeStudentEnrollment,
  updateCourseApi,
} from "../services/courseService";
import type {
  CourseDto,
  CourseRequestDto,
  CourseResponse,
  DeleteCourseResponse,
  GetCoursesResponse,
  RemoveStudentEnrollmentResponse,
  UpdateCourseParams,
} from "../types/course.types";
import { EMAILS_QUERY_KEY } from "../constants/dashboard.constants";

type MutationResult = {
  prevState?: GetCoursesResponse;
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.substring(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CourseResponse,
    AxiosError,
    CourseRequestDto,
    MutationResult
  >({
    mutationFn: createCourseApi,
    async onMutate(newCourse) {
      const prevState = queryClient.getQueryData<GetCoursesResponse>(
        COURSES_QUERY_KEY.all(),
      );
      await queryClient.cancelQueries({ queryKey: COURSES_QUERY_KEY.all() });

      const base64 = await fileToBase64(newCourse.File);

      queryClient.setQueryData(
        COURSES_QUERY_KEY.all(),
        (prevState: GetCoursesResponse) => {
          if (!prevState) return prevState;
          const courseDto: CourseDto = {
            id: -Date.now(),
            courseName: newCourse.Name,
            description: newCourse.Description,
            file: base64,
          };
          return {
            ...prevState,
            data: [courseDto, ...prevState.data],
          };
        },
      );
      return { prevState };
    },
    onError(error, __, mutationResult) {
      if (mutationResult?.prevState)
        queryClient.setQueryData(
          COURSES_QUERY_KEY.all(),
          mutationResult.prevState,
        );
      const errorResponse = handleErrorMessage(error);
      toast.error(errorResponse.title);
    },
    onSuccess: () => {
      toast.success("Course has been created successfully.");
      queryClient.invalidateQueries({
        queryKey: COURSES_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleCreateCourse: (course: CourseRequestDto) => mutation.mutate(course),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CourseResponse,
    AxiosError,
    UpdateCourseParams,
    MutationResult
  >({
    mutationFn: updateCourseApi,
    async onMutate(params) {
      const prevState = queryClient.getQueryData<GetCoursesResponse>(
        COURSES_QUERY_KEY.all(),
      );
      await queryClient.cancelQueries({ queryKey: COURSES_QUERY_KEY.all() });

      let base64: string | undefined;
      if (params.course.Photo) base64 = await fileToBase64(params.course.Photo);

      queryClient.setQueryData(
        COURSES_QUERY_KEY.all(),
        (prevState: GetCoursesResponse) => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            data: prevState.data.map((course) =>
              course.id === params.id
                ? {
                    ...course,
                    courseName: params.course.Name,
                    description: params.course.Description,
                    file: base64 ?? course.file,
                  }
                : course,
            ),
          };
        },
      );
      return { prevState };
    },
    onError(error, __, mutationResult) {
      if (mutationResult?.prevState)
        queryClient.setQueryData(
          COURSES_QUERY_KEY.all(),
          mutationResult.prevState,
        );
      const errorResponse = handleErrorMessage(error);
      toast.error(errorResponse.title);
    },
    onSuccess: () => {
      toast.success("Course has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: COURSES_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleUpdateCourse: (params: UpdateCourseParams) => mutation.mutate(params),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DeleteCourseResponse,
    AxiosError,
    number,
    MutationResult
  >({
    mutationFn: deleteCourseApi,
    async onMutate(courseId) {
      const prevState = queryClient.getQueryData<GetCoursesResponse>(
        COURSES_QUERY_KEY.all(),
      );
      await queryClient.cancelQueries({ queryKey: COURSES_QUERY_KEY.all() });
      queryClient.setQueryData(
        COURSES_QUERY_KEY.all(),
        (prevState: GetCoursesResponse) => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            data: prevState.data.filter((course) => course.id !== courseId),
          };
        },
      );
      return { prevState };
    },
    onError(error, __, mutationResult) {
      if (mutationResult?.prevState)
        queryClient.setQueryData(
          COURSES_QUERY_KEY.all(),
          mutationResult.prevState,
        );
      const errorResponse = handleErrorMessage(error);
      toast.error(errorResponse.title);
    },
    onSuccess: () => {
      toast.success("Course has been deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: COURSES_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleDeleteCourse: (courseId: number) => mutation.mutate(courseId),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};




export const useEnrollStudentsInCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    AxiosError,
    { courseId: number; studentEmails: string[] },
    MutationResult
  >({
    mutationFn: ({ courseId, studentEmails }) =>
      enrollStudentsInCourse(courseId, studentEmails),
    onError(error) {
      const errorResponse = handleErrorMessage(error);
      toast.error(errorResponse.title);
    },
    onSuccess: () => {
      toast.success("Students have been enrolled successfully.");
      queryClient.invalidateQueries({
        queryKey: EMAILS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleEnrollStudents: (courseId: number, studentEmails: string[]) =>
      mutation.mutate({ courseId, studentEmails }),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
}

export const useRemoveStudentEnrollment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    RemoveStudentEnrollmentResponse,
    AxiosError,
    { courseId: number; studentEmail: string },
    MutationResult
  >({
    mutationFn: ({ courseId, studentEmail }) =>
      removeStudentEnrollment(courseId,studentEmail),
    onError(error) {
      const errorResponse = handleErrorMessage(error);
      toast.error(errorResponse.title);
    },
    onSuccess: () => {
      toast.success("Student enrollment has been removed successfully.");
      queryClient.invalidateQueries({
        queryKey: EMAILS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleRemoveStudentEnrollment: (courseId: number, studentEmail: string) =>
      mutation.mutate({ courseId, studentEmail }),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
}   