import { Link } from "react-router-dom";
import type { CourseDto } from "@/features/admin/types/course.types";

const CourseCard = ({ course }: { course: CourseDto }) => (
  <article className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-gold">
    <h3 className="mb-2 text-lg font-bold text-teal-dark">{course.courseName}</h3>

    <p className="mb-5 flex-1 text-sm leading-relaxed text-body-mute">
      {course.description}
    </p>

    <Link
      to={`/student/courses/${course.id}`}
      className="block rounded-md bg-teal-dark px-4 py-2.5 text-center text-sm font-bold text-white transition-colors duration-200 hover:bg-teal"
    >
      دخول إلى المقرر
    </Link>
  </article>
);

export default CourseCard;