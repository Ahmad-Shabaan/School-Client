import StudentHeader from "../components/StudentHeader";
import StudentFooter from "../components/StudentFooter";
import LessonCard from "../components/LessonCard";
import { initialLessonsData } from "../data/mockStudentData";

const StudentCourse = () => {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-svh flex-col bg-paper font-tajawal text-body"
    >
      <StudentHeader />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9 sm:pb-[50px]">
          <section className="mb-9 text-center">
            <h1 className="text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">
              الدروس
            </h1>
            <div className="mx-auto my-2 w-10 rounded-[2px] bg-gold" />
            <p className="text-sm text-body-mute sm:text-[0.95rem]">
              اختر الدرس الذي تريد متابعته
            </p>
          </section>

          <section>
            <div className="grid grid-cols-1 gap-5 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3">
              {initialLessonsData.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default StudentCourse;
