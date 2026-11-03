import { Link } from "react-router-dom";
import type { CourseDto } from "@/features/admin/types/course.types";
import { GraduationCap } from "lucide-react";

const CourseCard = ({ course }: { course: CourseDto }) => (
  <article className="flex flex-col gap-3 rounded-xl border border-line bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-gold">
    {/* <div className=" border border-teal/10 bg-teal-soft flex-center size-10  overflow-hidden rounded-xl text-teal-dark shadow-sm"> */}
    <div className="flex size-8 sm:size-10 overflow-hidden items-center justify-center rounded-xl border border-gold bg-teal-soft text-[1.7rem] text-teal-dark">
      {course.file ? (
        <img
          src={`data:image/png;base64,${course.file}`}
          alt={course.courseName}
          className=" object-cover"
        />
      ) : (
        <GraduationCap className="size-6" />
      )}
    </div>
    <h3 className=" text-lg font-bold text-teal-dark">{course.courseName}</h3>

    <p className="flex-1 text-sm leading-relaxed text-body-mute">
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
