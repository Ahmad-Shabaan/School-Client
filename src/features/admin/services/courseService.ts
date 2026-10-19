import axiosClient from "@/shared/api/axiosClient";
import type {
  CourseRequestDto,
  CourseResponse,
  DeleteCourseResponse,
  GetCoursesResponse,
  RemoveStudentEnrollmentResponse,
  UpdateCourseParams,
} from "../types/course.types";

export const getCourses = async (): Promise<GetCoursesResponse> => {
  const response = await axiosClient.get<GetCoursesResponse>(`/courses`);
  return response.data;
};

export const getCourseApi = async (
  id: number,
): Promise<CourseResponse> => {
  const response = await axiosClient.get<CourseResponse>(`/courses/${id}`);
  return response.data;
};

export const createCourseApi = async (
  course: CourseRequestDto,
): Promise<CourseResponse> => {
  const formData = new FormData();
  formData.append("Name", course.Name);
  formData.append("Description", course.Description);
  formData.append("Photo", course.File);
  formData.append("Email", course.Email);
  const response = await axiosClient.post<CourseResponse>(
    "/courses/create-course",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const updateCourseApi = async ({
  id,
  course,
}: UpdateCourseParams): Promise<CourseResponse> => {
  const formData = new FormData();
  formData.append("Name", course.Name);
  formData.append("Description", course.Description);
  if (course.Photo) formData.append("Photo", course.Photo);
  const response = await axiosClient.put<CourseResponse>(
    `/courses/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const deleteCourseApi = async (
  id: number,
): Promise<DeleteCourseResponse> => {
  const response = await axiosClient.delete<DeleteCourseResponse>(
    `/courses/${id}`,
  );
  return response.data;
};

export const enrollStudentsInCourse = async (
  courseId: number,
  studentEmails: string[],
): Promise<void> => {
  await axiosClient.post<CourseResponse>(`/enrollments`, {
    courseId,
    emails: studentEmails,
  });
};

export const removeStudentEnrollment = async (
  courseId: number,
  studentEmail: string,
): Promise<RemoveStudentEnrollmentResponse> => {
  const response = await axiosClient.delete<RemoveStudentEnrollmentResponse>(
    `/enrollments`,
    {
      data: { courseId, studentEmail },
    },
  );
  return response.data;
};
