import type { ApiResponse } from "@/shared/types/api.types";

export type NotificationType = "Lesson" | "Exam" | "Assignment";

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsListResponse extends ApiResponse {
  data: NotificationDto[];
}

export interface UnreadNotificationsCountResponse {
  success: boolean;
  message: string;
  data: number;
}

export type MutationParams = { id: string };
