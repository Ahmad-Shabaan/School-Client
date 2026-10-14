import type { ApiResponse } from "@/shared/types/api.types";

export interface CourseDto{
    courseName:string;
    description:string;
    file: string;
    id : number;
}

export interface CourseRequestDto{
    Name:string;
    Description:string;
    File: File;
    Email:string;

}

export interface UpdateCourseRequestDto{
    Name:string;
    Description:string;
    Photo?: File;
}

export type UpdateCourseParams = {
  id: number;
  course: UpdateCourseRequestDto;
};

export interface GetCoursesResponse {
  data: CourseDto[];
}

export interface CourseResponse extends ApiResponse {
  data: CourseDto;
}

export interface DeleteCourseResponse extends ApiResponse {
  data: boolean;
}


export interface RemoveStudentEnrollmentResponse extends ApiResponse {
  data: boolean;
}