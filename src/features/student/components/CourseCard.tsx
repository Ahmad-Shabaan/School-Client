import { Link } from "react-router-dom";
import type { StudentCourse } from "../type/student";
import ProgressBar from "./ProgressBar";

const CourseCard = ({ course }: { course: StudentCourse }) => (
  <article className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-gold">
    <div className="mb-4 flex size-12 items-center justify-center rounded-[10px] bg-teal-soft text-2xl text-teal-dark">
      {course.icon}
    </div>

    <h3 className="mb-2 text-lg font-bold text-teal-dark">{course.name}</h3>

    <p className="mb-5 flex-1 text-sm leading-relaxed text-body-mute">
      {course.description}
    </p>

    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between text-xs text-body-mute">
        <span>التقدم</span>
        <span>{course.progress}%</span>
      </div>
      <ProgressBar value={course.progress} />
    </div>

    <Link
      to={`/courses/${course.id}`}
      className="block rounded-md bg-teal-dark px-4 py-2.5 text-center text-sm font-bold text-white transition-colors duration-200 hover:bg-teal"
    >
      دخول إلى المقرر
    </Link>
  </article>
);

export default CourseCard;