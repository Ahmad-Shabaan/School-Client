import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ListChecks,
  Send,
  XCircle,
} from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import {
  quizAttemptsQueryOptions,
  quizByLessonQueryOptions,
} from "@/features/admin/options/lessons.options";
import { useSubmitQuizAttempt } from "@/features/admin/hooks/useLessons";
import type { QuizAnswerInput } from "@/features/admin/types/lesson.types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { ROUTES } from "@/config/routes";

const Quiz = () => {
  const { id } = useParams();
  const lessonId = Number(id);

  const {
    data: quizData,
    isLoading: quizIsLoading,
    isError: quizIsError,
  } = useQuery(quizByLessonQueryOptions(lessonId));

  const { data: attemptsData } = useQuery(quizAttemptsQueryOptions(lessonId));

  const {
    handleSubmitAttempt,
    data: attemptResult,
    isLoading: submitIsLoading,
  } = useSubmitQuizAttempt();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const quiz = quizData?.data;
  const attempts = attemptsData?.data ?? [];
  const latestResult = attemptResult?.data;

  const handleSelect = (questionId: number, optionId: number) => {
    setValidationMessage(null);
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    const missing = quiz.questions.filter(
      (question) => answers[question.id] === undefined,
    );

    if (missing.length > 0) {
      setValidationMessage(
        "يجب الإجابة على جميع أسئلة الاختبار قبل إرسال الإجابات.",
      );
      return;
    }

    const payload: QuizAnswerInput[] = quiz.questions.map((question) => ({
      questionId: question.id,
      optionId: answers[question.id],
    }));

    handleSubmitAttempt(lessonId, payload);
  };

  const handleRetake = () => {
    setAnswers({});
    setValidationMessage(null);
  };

  if (quizIsLoading) {
    return (
   
        <main className="w-full flex-1">
          <div className="mx-auto w-full max-w-275 px-4 py-8 sm:px-5 sm:py-9">
            <Skeleton className="mb-6 h-8 w-2/3 rounded-[7px]" />
            <Skeleton className="mb-4 h-32 w-full rounded-[14px]" />
            <Skeleton className="mb-4 h-32 w-full rounded-[14px]" />
            <Skeleton className="h-32 w-full rounded-[14px]" />
          </div>
        </main>
    );
  }

    if (quizIsError || !quiz)
    return (
      <AppError
        message="تعذر تحميل الاختبار"
        link="العودة الي الملف الشخصي"
        to={ROUTES.Student.basePath}
      />
    );


  return (
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-275 px-4 py-8 pb-12 sm:px-5 sm:py-9">
          {/* Header */}
          <div className="mb-6">
            <Link
              to={`/student/lessons/${lessonId}`}
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-body-mute transition-colors hover:text-teal-dark"
            >
              <ArrowRight className="size-4" />
              العودة إلى الدرس
            </Link>
            <h1 className="text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">
              {quiz.title}
            </h1>
            <div className="mx-auto my-2 mr-0 w-10 rounded-[2px] bg-gold" />
            <p className="text-sm text-body-mute">
              درجة النجاح {quiz.passingScorePercent}٪ — عدد الأسئلة{" "}
              {quiz.questions.length}
            </p>
          </div>

          {/* Result banner */}
          {latestResult && (
            <div
              className={cn(
                "mb-6 rounded-[14px] border p-6",
                latestResult.isPassed
                  ? "border-teal/30 bg-teal-soft"
                  : "border-red-200 bg-red-50",
              )}
            >
              <div className="flex items-center gap-3">
                {latestResult.isPassed ? (
                  <CheckCircle2 className="size-8 text-teal-dark" />
                ) : (
                  <XCircle className="size-8 text-red-500" />
                )}
                <div>
                  <p className="text-lg font-extrabold text-ink">
                    {latestResult.isPassed
                      ? "أحسنت! لقد نجحت في الاختبار"
                      : "لم تجتز الاختبار هذه المرة"}
                  </p>
                  <p className="text-sm text-body-mute">
                    نتيجتك: {Number(latestResult.score)}٪
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={Number(latestResult.score)} />
              </div>
              <button
                type="button"
                onClick={handleRetake}
                className="mt-4 rounded-[7px] border border-line bg-white px-4 py-2 text-xs font-bold text-teal-dark transition-colors hover:bg-teal-soft"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-5">
            {quiz.questions.map((question, questionIndex) => (
              <section
                key={question.id}
                role="radiogroup"
                aria-label={`السؤال ${questionIndex + 1}`}
                className="rounded-[14px] border border-line bg-white p-6"
              >
                <h2 className="mb-4 text-[1.05rem] font-extrabold leading-[1.7] text-teal-dark">
                  <span className="ml-2 text-gold">
                    س{questionIndex + 1}.
                  </span>
                  {question.text}
                </h2>

                <div className="space-y-2.5">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[question.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelect(question.id, option.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-[7px] border px-4 py-3 text-right text-sm font-bold leading-[1.7] transition-colors",
                          isSelected
                            ? "border-teal bg-teal-soft text-teal-dark"
                            : "border-line bg-white text-body hover:border-teal/40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold",
                            isSelected
                              ? "border-teal bg-teal text-white"
                              : "border-line text-body-mute",
                          )}
                        >
                          {optionIndex + 1}
                        </span>
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {validationMessage && (
            <p
              role="alert"
              className="mt-4 flex items-center gap-2 rounded-[7px] bg-red-50 p-3 text-sm font-bold text-red-600"
            >
              <AlertTriangle className="size-4 shrink-0" />
              {validationMessage}
            </p>
          )}

          {/* Submit */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitIsLoading}
              className="flex w-full items-center justify-center gap-2 rounded-[7px] bg-teal-dark px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitIsLoading ? (
                <>
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  جارٍ إرسال الإجابات...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  إرسال الإجابات
                </>
              )}
            </button>
          </div>

          {/* Attempts history */}
          {attempts.length > 0 && (
            <section className="mt-8 rounded-[14px] border border-line bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-[1.1rem] font-extrabold text-teal-dark">
                <ListChecks className="size-5" />
                محاولاتي السابقة
              </h2>
              <ul className="space-y-2">
                {attempts.map((attempt) => (
                  <li
                    key={attempt.id}
                    className="flex items-center justify-between rounded-[7px] border border-line px-4 py-3 text-sm"
                  >
                    <span className="font-bold text-ink">
                      المحاولة {attempt.attemptNumber}
                    </span>
                    <span className="text-body-mute">
                      {Number(attempt.score)}٪
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs font-extrabold",
                        attempt.isPassed ? "text-teal-dark" : "text-red-500",
                      )}
                    >
                      {attempt.isPassed ? (
                        <>
                          <CheckCircle2 className="size-3.5" /> ناجحة
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5" /> راسبة
                        </>
                      )}
                    </span>
                    {attempt.submittedAt && (
                      <span className="text-xs text-body-mute">
                        {new Date(attempt.submittedAt).toLocaleDateString(
                          "ar-EG",
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
  );
};

export default Quiz;
