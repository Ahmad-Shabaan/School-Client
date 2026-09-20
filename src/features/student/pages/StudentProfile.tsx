import StudentHeader from "../components/StudentHeader";
import StudentInfoCard from "../components/StudentInfoCard";
import CourseCard from "../components/CourseCard";
import StudentFooter from "../components/StudentFooter";
import { initialStudentData, initialCoursesData } from "../data/mockStudentData";

const StudentProfile = () => (
  <div
    dir="rtl"
    lang="ar"
    className="flex min-h-svh flex-col bg-paper font-tajawal text-body"
  >
    <StudentHeader />

    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-[1000px] px-5 py-7 sm:py-8">
        <section className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-ink sm:text-[1.8rem]">
            الملف الشخصي
          </h1>
          <div className="mx-auto my-2 h-[3px] w-10 rounded-[2px] bg-gold" />
          <p className="text-sm text-body-mute sm:text-[0.95rem]">
            مرحبًا بك في حسابك، تابع مستواك الدراسي والمقررات الخاصة بك.
          </p>
        </section>

        <StudentInfoCard student={initialStudentData} />

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-ink sm:text-2xl">
              المقررات الدراسية
            </h2>
            <p className="mt-1 text-sm text-body-mute">
              المقررات المسجل بها حاليًا
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
            {initialCoursesData.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </main>

    <StudentFooter />
  </div>
);

export default StudentProfile;