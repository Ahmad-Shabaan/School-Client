import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import { coursesQueryOptions } from "../options/student.options";

export const useStudentCourse = (courseId: number) => {
  const email = useAppSelector((state) => state.auth.user?.email);
  const query = useQuery(coursesQueryOptions(email));
  const course = query.data?.data.find((item) => item.id === courseId);

  return {
    ...query,
    course,
    isEnrolled: Boolean(course),
  };
};
