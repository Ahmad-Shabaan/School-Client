import type { ApiResponse } from "@/shared/types/api.types";

export interface LessonGoalDto {
  id: number;
  text: string;
}

export interface LessonResourceDto {
  id: number;
  title: string;
  fileUrl: string;
  fileType: string | null;
}

export interface LessonAccessDto {
  isAccessible: boolean;
  isEnrolled: boolean;
  isVideoCompleted: boolean;
  isQuizPassed: boolean;
  missingRequirement: string | null;
}

export interface LessonDetailsDto {
  id: number;
  courseId: number;
  title: string;
  description: string;
  order: number;
  youTubeVideoId: string | null;
  meetingUrl: string | null;
  meetingDateTime: string | null;
  goals: LessonGoalDto[];
  resources: LessonResourceDto[];
  quizId: number | null;
  hasQuiz: boolean;
  access: LessonAccessDto;
}

export interface LessonStatusDto {
  id: number;
  order: number;
  title: string;
  isUnlocked: boolean;
  meetingUrl: string | null;
  meetingDateTime: string | null;
  watchedPercentage: number;
  isVideoCompleted: boolean;
  isQuizPassed: boolean;
  hasQuiz: boolean;
  isCompleted: boolean;
}

export interface LessonResourceInput {
  title: string;
  fileUrl: string;
  fileType?: string | null;
}

export interface CreateLessonRequest {
  courseId: number;
  title: string;
  description: string;
  youtubeUrl?: string | null;
  meetingUrl?: string | null;
  meetingDateTime?: string | null;
  goals: string[];
  resources: LessonResourceInput[];
}

export interface UpdateLessonRequest {
  title: string;
  description: string;
  youtubeUrl?: string | null;
  meetingUrl?: string | null;
  meetingDateTime?: string | null;
  goals: string[];
  resources: LessonResourceInput[];
}

export interface LessonDetailsResponse extends ApiResponse {
  data: LessonDetailsDto;
}

export interface CourseLessonsResponse extends ApiResponse {
  data: LessonStatusDto[];
}

export interface AnswerOptionDto {
  id: number;
  text: string;
}

export interface QuestionDto {
  id: number;
  text: string;
  options: AnswerOptionDto[];
}

export interface QuizDto {
  id: number;
  lessonId: number;
  title: string;
  passingScorePercent: number;
  questions: QuestionDto[];
}

export interface QuizManagementOptionDto {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizManagementQuestionDto {
  id: number;
  text: string;
  options: QuizManagementOptionDto[];
}

export interface QuizManagementDto {
  id: number;
  lessonId: number;
  title: string;
  passingScorePercent: number;
  attemptCount: number;
  questions: QuizManagementQuestionDto[];
}

export interface QuizAnswerInput {
  questionId: number;
  optionId: number;
}

export interface QuizAttemptAnswerDto {
  questionId: number;
  selectedOptionId: number | null;
  pointsAwarded: number;
}

export interface QuizAttemptDto {
  id: number;
  quizId: number;
  attemptNumber: number;
  score: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt: string | null;
  answers: QuizAttemptAnswerDto[];
}

export interface QuizOptionInput {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestionInput {
  text: string;
  options: QuizOptionInput[];
}

export interface QuizPayloadRequest {
  title: string;
  passingScorePercent: number;
  questions: QuizQuestionInput[];
}

export interface QuizResponse extends ApiResponse {
  data: QuizDto;
}

export interface QuizManagementResponse extends ApiResponse {
  data: QuizManagementDto;
}

export interface QuizAttemptResponse extends ApiResponse {
  data: QuizAttemptDto;
}

export interface QuizAttemptsResponse extends ApiResponse {
  data: QuizAttemptDto[];
}

export interface SubmitProgressRequest {
  currentTimeSeconds: number;
  durationSeconds: number;
  watchedSegmentStartSeconds?: number | null;
  watchedSegmentEndSeconds?: number | null;
}

export interface LessonProgressDto {
  lessonId: number;
  lastPositionSeconds: number;
  durationSeconds: number;
  watchedPercentage: number;
  isVideoCompleted: boolean;
  updatedAt: string;
}

export interface LessonProgressResponse extends ApiResponse {
  data: LessonProgressDto;
}

export interface LessonAccessResponse extends ApiResponse {
  data: LessonAccessDto;
}
