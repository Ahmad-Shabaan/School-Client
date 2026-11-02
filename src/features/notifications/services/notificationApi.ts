import axiosClient from "@/shared/api/axiosClient";
import type { ApiErrorResponse, ApiResponse } from "@/shared/types/api.types";
import { NOTIFICATIONS_PAGE_SIZE } from "../constants/notification.constants";
import type {
  MutationParams,
  NotificationsListResponse,
  UnreadNotificationsCountResponse,
} from "../types/notification.types";


const createNotificationsApi = async (
  title: string,
  message: string,
): Promise<ApiErrorResponse > => {
  const response = await axiosClient.post<ApiErrorResponse>(
    "/notifications",
    { title, message }
  );
  return response.data;
};



const getNotificationsApi = async (
  pageIndex: number,
  pageSize: number = NOTIFICATIONS_PAGE_SIZE,
): Promise<NotificationsListResponse> => {
  const response = await axiosClient.get<NotificationsListResponse>(
    "/notifications",
    { params: { pageIndex, pageSize } },
  );
  return response.data;
};

const getUnreadNotificationsCountApi =
  async (): Promise<UnreadNotificationsCountResponse> => {
    const response = await axiosClient.get<UnreadNotificationsCountResponse>(
      "/notifications/unread-count",
    );
    return response.data;
  };

const markNotificationAsReadApi = async ({
  id,
}: MutationParams): Promise<ApiResponse> => {
  const response = await axiosClient.put<ApiResponse>(
    `/notifications/${id}/read`,
  );
  return response.data;
};

const markAllNotificationsAsReadApi = async (): Promise<ApiResponse> => {
  const response = await axiosClient.put<ApiResponse>(
    "/notifications/read-all",
  );
  return response.data;
};

const deleteNotificationApi = async ({
  id,
}: MutationParams): Promise<ApiResponse> => {
  const response = await axiosClient.delete<ApiResponse>(`/notifications/${id}`);
  return response.data;
};

export {
  getNotificationsApi,
  getUnreadNotificationsCountApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
  createNotificationsApi,
};
