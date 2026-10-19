import { Link } from "react-router-dom";
import {
  Award,
  CalendarClock,
  Link2,
  ListChecks,
  Lock,
  Play,
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useSessionJoinability } from "../hooks/useSessionJoinability";
import type { LessonStatusDto } from "@/features/admin/types/lesson.types";
import { useState } from "react";
import { VALIDATION_MEETING_URL } from "../constants/student.constants";

const LessonCard = ({ lesson }: { lesson: LessonStatusDto }) => {
  const isSessionJoinable = useSessionJoinability(lesson.meetingDateTime);
  const [now] = useState<number>(() => Date.now());
  const isAvailable =
    Boolean(lesson.meetingUrl) &&
    Boolean(lesson.meetingDateTime) &&
    new Date(lesson.meetingDateTime!).getTime() <= now + VALIDATION_MEETING_URL;

  return (
    <article className="flex flex-col rounded-[14px] border border-line bg-white p-6 transition-[transform,border-color,box-shadow] duration-200 ease-in-out hover:-translate-y-1 hover:border-gold hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex size-13.75 items-center justify-center rounded-xl border border-teal/10 bg-teal-soft text-[1.7rem] text-teal-dark">
          {lesson.isCompleted ? (
            <Award className="size-7" />
          ) : (
            <Play className="size-7" />
          )}
        </div>
        <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-extrabold text-gold">
          الدرس {lesson.order}
        </span>
      </div>

      <h2 className="mb-2.25 text-[1.15rem] font-extrabold text-teal-dark">
        {lesson.title}
      </h2>

      <div className="mb-3 flex flex-wrap gap-2">
        {lesson.hasQuiz && (
          <span className="flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[0.7rem] font-extrabold text-gold">
            <ListChecks className="size-3" />
            اختبار
          </span>
        )}
        {lesson.isCompleted && (
          <span className="flex items-center gap-1 rounded-full bg-teal-soft px-2 py-0.5 text-[0.7rem] font-extrabold text-teal-dark">
            <Award className="size-3" />
            مكتمل
          </span>
        )}
        {!lesson.isUnlocked && (
          <span className="flex items-center gap-1 rounded-full bg-body/5 px-2 py-0.5 text-[0.7rem] font-extrabold text-body-mute">
            <Lock className="size-3" />
            مغلق
          </span>
        )}
      </div>

      <div className="mb-4 border-t border-line pt-3.5">
        <div className="mb-1.5 flex items-center justify-between text-[0.7rem] font-bold text-body-mute">
          <span>نسبة المشاهدة</span>
          <span>{Math.round(lesson.watchedPercentage)}٪</span>
        </div>
        <ProgressBar value={Math.min(100, Number(lesson.watchedPercentage))} />
      </div>

      {lesson.meetingUrl ? (
        <div className="mb-4 rounded-[7px] border border-line bg-paper p-3">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] font-bold text-teal-dark">
            <span className="flex items-center gap-1">
              <Link2 className="size-3.5" />
              حصة مباشرة
            </span>
            {lesson.meetingDateTime && (
              <span className="flex items-center gap-1 text-body-mute">
                <CalendarClock className="size-3.5" />
                {new Date(lesson.meetingDateTime).toLocaleString("ar-EG")}
              </span>
            )}
          </div>

          {isSessionJoinable ? (
            isAvailable ? (
              <span className="block w-full  rounded-[7px] border border-line bg-white px-3 py-2 text-center text-xs font-bold text-body-mute opacity-70">
                انتهت الحصة
              </span>
            ) : (
              <a
                href={lesson.meetingUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[7px] bg-teal-dark px-3 py-2 text-center text-xs font-bold text-white transition-colors duration-200 hover:bg-teal"
              >
                الانضمام إلى الحصة
              </a>
            )
          ) : (
            <button
              type="button"
              disabled
              className="block w-full cursor-not-allowed rounded-[7px] border border-line bg-white px-3 py-2 text-center text-xs font-bold text-body-mute opacity-70"
            >
              الانضمام إلى الحصة
            </button>
          )}
        </div>
      ) : (
        <div className="mb-4 rounded-[7px] border border-line bg-paper p-3">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] font-bold text-teal-dark">
            <span className="flex items-center gap-1">
              <Link2 className="size-3.5" />
              حصة مباشرة
            </span>
            <span className="block w-full  rounded-[7px] border border-line bg-white px-3 py-2 text-center text-xs font-bold text-body-mute opacity-70">
              لم يتم جدولة الحصة بعد
            </span>
          </div>
        </div>
      )}

      {lesson.isUnlocked ? (
        <Link
          to={`/student/lessons/${lesson.id}`}
          className="mt-auto block rounded-[7px] bg-teal-dark px-4 py-2.75 text-center text-sm font-bold text-white transition-colors duration-200 hover:bg-teal"
        >
          دخول إلى الدرس
        </Link>
      ) : (
        <span className="mt-auto flex cursor-not-allowed items-center justify-center gap-1.5 rounded-[7px] border border-line bg-paper px-4 py-2.75 text-center text-sm font-bold text-body-mute opacity-70">
          <Lock className="size-3.5" />
          مغلق حتى إكمال الدرس السابق
        </span>
      )}
    </article>
  );
};

export default LessonCard;
