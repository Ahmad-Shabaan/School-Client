import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CalendarClock,
  FileText,
  Link2,
  ListChecks,
  Lock,
  PlayCircle,
  Target,
} from "lucide-react";
import StudentHeader from "../components/StudentHeader";
import StudentFooter from "../components/StudentFooter";
import ProgressBar from "../components/ProgressBar";
import YouTubePlayer, {
  type YouTubePlayerLike,
} from "../components/YouTubePlayer";
import { useVideoProgress } from "../hooks/useVideoProgress";
import { useSessionJoinability } from "../hooks/useSessionJoinability";
import {
  lessonAccessQueryOptions,
  lessonDetailsQueryOptions,
  lessonProgressQueryOptions,
  quizByLessonQueryOptions,
} from "@/features/admin/options/lessons.options";
import { LESSONS_QUERY_KEY } from "@/features/admin/constants/lessons.constants";
import { cn } from "@/lib/utils";
import LessonSkeleton from "../components/LessonSkeleton";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { ROUTES } from "@/config/routes";

const Lesson = () => {
  const { id } = useParams();
  const lessonId = Number(id);
  const queryClient = useQueryClient();

  const {
    data: lessonData,
    isLoading: lessonIsLoading,
    isError: lessonIsError,
  } = useQuery(lessonDetailsQueryOptions(lessonId));

  const { data: progressData } = useQuery(lessonProgressQueryOptions(lessonId));

  const { data: accessData } = useQuery(lessonAccessQueryOptions(lessonId));

  const { data: quizData } = useQuery({
    ...quizByLessonQueryOptions(lessonId),
    enabled:
      Number.isFinite(lessonId) &&
      lessonId > 0 &&
      (lessonData?.data.hasQuiz ?? false),
  });

  const playerRef = useRef<YouTubePlayerLike | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const {
    handlePlaying,
    handlePaused,
    handleEnded,
    YT_PLAYER_STATE: STATES,
  } = useVideoProgress(lessonId, playerRef);

  const isSessionJoinable = useSessionJoinability(
    lessonData?.data.meetingDateTime ?? null,
  );

  const lesson = lessonData?.data;
  const progress = progressData?.data;
  const access = accessData?.data ?? lesson?.access;

  const watchedPercentage = Number(progress?.watchedPercentage ?? 0);
  const isVideoCompleted = progress?.isVideoCompleted ?? false;

  const quiz = quizData?.data;
  const hasQuiz = lesson?.hasQuiz ?? false;
  const isQuizAccessible = access?.isAccessible ?? false;
  const missingRequirement = access?.missingRequirement ?? null;

  const handleStateChange = (state: number) => {
    if (state === STATES.PLAYING) handlePlaying();
    else if (state === STATES.PAUSED) handlePaused();
    else if (state === STATES.ENDED) {
      handleEnded();
      void queryClient.invalidateQueries({
        queryKey: LESSONS_QUERY_KEY.access(lessonId),
      });
    }
  };

  const handleError = (errorCode: number) => {
    setPlayerError(
      errorCode === -1
        ? "تعذر تحميل مشغل الفيديو. تأكد من الاتصال بالإنترنت وحاول مرة أخرى."
        : "حدث خطأ أثناء تشغيل الفيديو. قد يكون الفيديو غير متاح.",
    );
  };

  if (lessonIsLoading) {
    return <LessonSkeleton />;
  }
  if (lessonIsError || !lesson)
    return (
      <AppError
        message=" حدث خطأ أثناء جلب بيانات الدرس. حاول مرة أخرى لاحقاً.       "
        link="العودة الي الملف الشخصي"
        to={ROUTES.Student.basePath}
      />
    );

  return (

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9">
          {/* Breadcrumb + title */}
          <div className="mb-6">
            <Link
              to={`/student/courses/${lesson.courseId}`}
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-body-mute transition-colors hover:text-teal-dark"
            >
              <ArrowRight className="size-4" />
              العودة إلى دروس المادة
            </Link>
            <div className="mb-[18px] flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-extrabold text-gold">
                الدرس {lesson.order}
              </span>
              {isVideoCompleted && (
                <span className="flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-1 text-xs font-extrabold text-teal-dark">
                  <Award className="size-3.5" />
                  تم مشاهدة الفيديو
                </span>
              )}
              {hasQuiz && (
                <span className="flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-extrabold text-gold">
                  <ListChecks className="size-3.5" />
                  يوجد اختبار
                </span>
              )}
            </div>
            <h1 className="text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">
              {lesson.title}
            </h1>
            <div className="mx-auto my-2 mr-0 w-10 rounded-[2px] bg-gold" />
            <p className="text-sm leading-[1.8] text-body-mute sm:text-[0.95rem]">
              {lesson.description}
            </p>
          </div>

          {/* Video / meeting */}
          {lesson.youTubeVideoId ? (
            <div className="mb-6">
              <div className="overflow-hidden rounded-[14px] border border-line bg-white">
                {playerError ? (
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-black/5 p-6 text-center">
                    <AlertTriangle className="size-8 text-red-500" />
                    <p className="text-sm text-body-mute">{playerError}</p>
                  </div>
                ) : (
                  <YouTubePlayer
                    videoId={lesson.youTubeVideoId}
                    className="aspect-video w-full"
                    onStateChange={handleStateChange}
                    onError={handleError}
                    onReady={(player) => {
                      playerRef.current = player;
                      setPlayerError(null);
                    }}
                  />
                )}
              </div>

              {/* Progress */}
              <div className="mt-4 rounded-[14px] border border-line bg-white p-5">
                <div className="mb-3 flex items-center justify-between text-xs font-bold text-teal-dark">
                  <span className="flex items-center gap-1.5">
                    <PlayCircle className="size-4" />
                    نسبة المشاهدة
                  </span>
                  <span>{Math.round(watchedPercentage)}٪</span>
                </div>
                <ProgressBar value={Math.min(100, watchedPercentage)} />
                <p className="mt-3 text-xs text-body-mute">
                  {isVideoCompleted
                    ? "أكملت مشاهدة هذا الفيديو بالكامل."
                    : "يجب الوصول إلى ٩٠٪ من مشاهدة الفيديو لفتح الاختبار."}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-[14px] border border-dashed border-line bg-white p-8 text-center">
              <PlayCircle className="mx-auto mb-3 size-10 text-body-mute opacity-40" />
              <p className="text-sm text-body-mute">
                لا يوجد فيديو لهذا الدرس.
              </p>
            </div>
          )}

          {/* Meeting */}
          {lesson.meetingUrl && (
            <div className="mb-6 rounded-[14px] border border-line bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-teal-soft text-teal-dark">
                    <Link2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-teal-dark">
                      حصة مباشرة
                    </p>
                    {lesson.meetingDateTime && (
                      <p className="flex items-center gap-1.5 text-xs text-body-mute">
                        <CalendarClock className="size-3.5" />
                        {new Date(lesson.meetingDateTime).toLocaleString(
                          "ar-EG",
                        )}
                      </p>
                    )}
                    {!isSessionJoinable && (
                      <p className="mt-0.5 text-xs font-bold text-gold">
                        يفتح الانضمام عند موعد الحصة
                      </p>
                    )}
                  </div>
                </div>
                {isSessionJoinable ? (
                  <a
                    href={lesson.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[7px] bg-teal-dark px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-teal"
                  >
                    الانضمام إلى الحصة
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-[7px] border border-line bg-paper px-4 py-2 text-xs font-bold text-body-mute opacity-70"
                  >
                    الانضمام إلى الحصة
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Goals + resources */}
            <div className="space-y-6 lg:col-span-2">
              {lesson.goals.length > 0 && (
                <section className="rounded-[14px] border border-line bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-[1.1rem] font-extrabold text-teal-dark">
                    <Target className="size-5" />
                    أهداف الدرس
                  </h2>
                  <ul className="space-y-3">
                    {lesson.goals.map((goal) => (
                      <li
                        key={goal.id}
                        className="flex items-start gap-2 text-sm leading-[1.7] text-body-mute"
                      >
                        <Target className="mt-1 size-3.5 shrink-0 text-gold" />
                        {goal.text}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="rounded-[14px] border border-line bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-[1.1rem] font-extrabold text-teal-dark">
                  <FileText className="size-5" />
                  مراجع الدرس
                </h2>
                {lesson.resources.length === 0 ? (
                  <p className="text-sm text-body-mute">
                    لا توجد مراجع إضافية لهذا الدرس.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {lesson.resources.map((resource) => (
                      <li
                        key={resource.id}
                        className="flex items-center justify-between gap-3 rounded-[7px] border border-line px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <FileText className="size-4 shrink-0 text-body-mute" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink">
                              {resource.title}
                            </p>
                            {resource.fileType && (
                              <p className="text-xs text-body-mute">
                                {resource.fileType}
                              </p>
                            )}
                          </div>
                        </div>
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-xs font-bold text-teal-dark underline-offset-2 hover:underline"
                        >
                          فتح
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Quiz sidebar */}
            <div>
              <section className="rounded-[14px] border border-line bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-[1.1rem] font-extrabold text-teal-dark">
                  <ListChecks className="size-5" />
                  اختبار الدرس
                </h2>

                {!hasQuiz ? (
                  <p className="text-sm text-body-mute">
                    لا يوجد اختبار لهذا الدرس. يكمل مشاهدة الفيديو لإتمام الدرس.
                  </p>
                ) : !isQuizAccessible ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 rounded-[7px] bg-gold-soft p-3 text-xs font-bold leading-[1.7] text-gold">
                      <Lock className="mt-0.5 size-4 shrink-0" />
                      <span>
                        {missingRequirement ??
                          "يجب استكمال متطلبات الدرس قبل فتح الاختبار."}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="block w-full cursor-not-allowed rounded-[7px] border border-line bg-paper px-4 py-2.75 text-center text-sm font-bold text-body-mute opacity-60"
                    >
                      الانتقال إلى الاختبار
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-[7px] bg-teal-soft p-3">
                      <p className="text-sm font-extrabold text-teal-dark">
                        {quiz?.title ?? "اختبار الدرس"}
                      </p>
                      <p className="mt-1 text-xs text-body-mute">
                        درجة النجاح {quiz?.passingScorePercent ?? 80}٪
                      </p>
                    </div>
                    <Link
                      to={`/student/lessons/${lesson.id}/quiz`}
                      className={cn(
                        "block rounded-[7px] bg-teal-dark px-4 py-2.75 text-center text-sm font-bold text-white transition-colors hover:bg-teal",
                      )}
                    >
                      الانتقال إلى الاختبار
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
  );
};

export default Lesson;
