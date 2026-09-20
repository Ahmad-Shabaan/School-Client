import type { Student } from "../type/student";
import ProgressBar from "./ProgressBar";

const avatarLetter = (student: Student) =>
  student.name.trim().charAt(0) || "أ";

const StudentInfoCard = ({ student }: { student: Student }) => (
  <section className="mb-10 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sm:p-7">
    <div className="flex flex-col items-center gap-5 text-center min-[650px]:flex-row min-[650px]:items-center min-[650px]:gap-7 min-[650px]:text-right">
      <div className="flex size-[110px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-gradient-to-br from-teal-soft to-gold-soft text-[2.8rem] font-extrabold text-teal-dark">
        {student.image ? (
          <img
            src={student.image}
            alt={student.name}
            className="size-full object-cover"
          />
        ) : (
          <span>{avatarLetter(student)}</span>
        )}
      </div>

      <div className="grid w-full grid-cols-2 gap-4 min-[650px]:grid-cols-4">
        <div>
          <span className="block text-sm text-body-mute">الاسم</span>
          <span className="mt-1 block text-base font-bold text-ink">
            {student.name}
          </span>
        </div>
        <div>
          <span className="block text-sm text-body-mute">العمر</span>
          <span className="mt-1 block text-base font-bold text-ink">
            {student.age} سنة
          </span>
        </div>
        <div>
          <span className="block text-sm text-body-mute">البلد</span>
          <span className="mt-1 block text-base font-bold text-ink">
            {student.country}
          </span>
        </div>
        <div>
          <span className="block text-sm text-body-mute">المستوى</span>
          <span className="mt-1 block text-base font-bold text-ink">
            {student.level}
          </span>
        </div>
      </div>
    </div>

    <div className="mt-5 border-t border-line pt-5">
      <div className="mb-2 flex items-center justify-between font-bold text-teal-dark">
        <span>مستواك الدراسي</span>
        <span>{student.progress}%</span>
      </div>
      <ProgressBar value={student.progress} />
    </div>
  </section>
);

export default StudentInfoCard;