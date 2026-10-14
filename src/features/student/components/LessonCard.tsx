import { Link } from "react-router-dom";
import { Clock, Play } from "lucide-react";
import type { Lesson } from "../type/student";

const LessonCard = ({ lesson }: { lesson: Lesson }) => (
  <article className="flex flex-col rounded-[14px] border border-line bg-white p-6 transition-[transform,border-color,box-shadow] duration-200 ease-in-out hover:-translate-y-1 hover:border-gold hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
    <div className="mb-[18px] flex items-center justify-between">
      <div className="flex size-13.75 items-center justify-center rounded-xl border border-teal/10 bg-teal-soft text-[1.7rem] text-teal-dark">
        {lesson.icon || "📖"}
      </div>
      <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-extrabold text-gold">
        الدرس {lesson.id}
      </span>
    </div>

    <h2 className="mb-2.25 text-[1.15rem] font-extrabold text-teal-dark">
      {lesson.title}
    </h2>

    <p className="mb-5 flex-1 text-sm leading-[1.7] text-body-mute">
      {lesson.description}
    </p>

    <div className="mb-4 flex items-center gap-3.75 border-t border-line pt-3.5 text-xs text-body-mute">
      <span className="flex items-center gap-1.25">
        <Clock className="size-3.5" />
        {lesson.duration}
      </span>
      <span className="flex items-center gap-1.25">
        <Play className="size-3.5" />
        درس
      </span>
    </div>

    <Link
      to={`/lessons/${lesson.id}`}
      className="block rounded-[7px] bg-teal-dark px-4 py-2.75 text-center text-sm font-bold text-white transition-colors duration-200 hover:bg-teal"
    >
      دخول إلى الدرس
    </Link>
  </article>
);

export default LessonCard;
