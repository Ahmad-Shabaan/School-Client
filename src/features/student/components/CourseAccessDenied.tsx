import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { ROUTES } from "@/config/routes";

interface CourseAccessDeniedProps {
  message?: string;
}

const CourseAccessDenied = ({
  message = "أنت غير مسجل في هذا المقرر، لذلك لا يمكنك الوصول إلى محتواه.",
}: CourseAccessDeniedProps) => (
  <main className="w-full flex-1">
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-12 pb-12 text-center sm:pt-16">
      <div className="flex size-16 items-center justify-center rounded-full bg-error/10">
        <LockKeyhole className="size-7 text-error" />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
        لا يمكن الوصول إلى هذا المقرر
      </h1>

      <p className="mt-2 max-w-md text-sm leading-7 text-body-mute">
        {message}
      </p>

      <Link
        to={ROUTES.Student.basePath}
        className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-teal-dark px-6 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-teal"
      >
        العودة إلى المقررات
      </Link>
    </div>
  </main>
);

export default CourseAccessDenied;
