import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { User } from "@/features/auth/types/auth.types";
import ProgressBar from "./ProgressBar";

const avatarLetter = (student: User) =>
  student.firstName.trim().charAt(0) || "أ";

const StudentInfoCard = ({ student }: { student: User }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (!student.id || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(student.id)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => setCopied(false));
  };

  return (
    <section className="mb-10 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sm:p-7">
      <div className="flex flex-col items-center gap-5 text-center min-[650px]:flex-row min-[650px]:items-center min-[650px]:gap-7 min-[650px]:text-right">
        <div className="flex size-27.5 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-linear-to-br from-teal-soft to-gold-soft text-[2.8rem] font-extrabold text-teal-dark">
          <span>{avatarLetter(student)}</span>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 min-[650px]:grid-cols-4">
          <div className="min-w-0">
            <span className="block text-sm text-body-mute">الاسم</span>
            <span className="mt-1 block truncate text-base font-bold text-ink">
              {student.firstName} {student.lastName}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-sm text-body-mute">رقم التسلسل</span>
            <span className="mt-1 flex items-center gap-1.5">
              <span
                dir="ltr"
                title={student.id}
                className="min-w-0 truncate font-mono text-sm font-bold text-ink"
              >
                {student.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                aria-label={copied ? "تم النسخ" : "نسخ رقم التسلسل"}
                title={copied ? "تم النسخ" : "نسخ رقم التسلسل"}
                className="flex size-6 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-body-mute transition-colors hover:border-gold hover:text-teal-dark focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:outline-none"
              >
                {copied ? (
                  <Check className="size-3.5 text-teal" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-sm text-body-mute">البلد</span>
            <span className="mt-1 block truncate text-base font-bold text-ink">
              مصر
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-sm text-body-mute">المستوى</span>
            <span className="mt-1 block text-base font-bold text-ink">3</span>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <div className="mb-2 flex items-center justify-between font-bold text-teal-dark">
          <span>مستواك الدراسي</span>
          <span>60%</span>
        </div>
        <ProgressBar value={60} />
      </div>
    </section>
  );
};

export default StudentInfoCard;
