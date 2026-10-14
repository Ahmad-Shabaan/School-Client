import type { GetCoursesResponse } from "@/features/admin/types/course.types";
import axiosClient from "@/shared/api/axiosClient";

export const getUserCourses = async (email?: string): Promise<GetCoursesResponse> => {
    if (!email) {
        throw new Error("Email is required to fetch user courses.");
    }
  const response = await axiosClient.get<GetCoursesResponse>(`/courses/user-courses`,{
    headers: {
      "Content-Type": "application/json",
      "UserEmail": email,
    },
  });
  return response.data;
};
