import axiosClient from "@/shared/api/axiosClient";
import { CHAT_CONVERSATIONS_PAGE_SIZE, CHAT_MESSAGES_PAGE_SIZE } from "../constants/chat.constants";
import type {
  ChatMessageResponse,
  ChatMessagesListResponse,
  ChatUnreadCountResponse,
  ConversationResponse,
  ConversationsListResponse,
} from "../types/chat.types";
import type { ApiResponse } from "@/shared/types/api.types";

// ── Student endpoints (api/chat) ─────────────────────────────

export const getMyConversationApi =
  async (): Promise<ConversationResponse> => {
    const response = await axiosClient.get<ConversationResponse>(
      "/chat/my-conversation",
    );
    return response.data;
  };

export const getMyMessagesApi = async (
  pageIndex: number,
  pageSize: number = CHAT_MESSAGES_PAGE_SIZE,
): Promise<ChatMessagesListResponse> => {
  const response = await axiosClient.get<ChatMessagesListResponse>(
    "/chat/my-messages",
    { params: { pageIndex, pageSize } },
  );
  return response.data;
};

export const sendStudentMessageApi = async (
  content: string,
): Promise<ChatMessageResponse> => {
  const response = await axiosClient.post<ChatMessageResponse>(
    "/chat/messages",
    { content },
  );
  return response.data;
};

export const getMyUnreadCountApi =
  async (): Promise<ChatUnreadCountResponse> => {
    const response = await axiosClient.get<ChatUnreadCountResponse>(
      "/chat/my-unread-count",
    );
    return response.data;
  };

export const markMyMessagesAsReadApi = async (): Promise<ApiResponse> => {
  const response = await axiosClient.post<ApiResponse>(
    "/chat/mark-as-read",
  );
  return response.data;
};

// ── Admin endpoints (api/admin/chat) ─────────────────────────

export const getConversationsApi = async (
  pageIndex: number,
  pageSize: number = CHAT_CONVERSATIONS_PAGE_SIZE,
): Promise<ConversationsListResponse> => {
  const response = await axiosClient.get<ConversationsListResponse>(
    "/admin/chat",
    { params: { pageIndex, pageSize } },
  );
  return response.data;
};

export const getAdminConversationApi = async (
  conversationId: number,
): Promise<ConversationResponse> => {
  const response = await axiosClient.get<ConversationResponse>(
    `/admin/chat/conversations/${conversationId}`,
  );
  return response.data;
};

export const getAdminConversationMessagesApi = async (
  conversationId: number,
  pageIndex: number,
  pageSize: number = CHAT_MESSAGES_PAGE_SIZE,
): Promise<ChatMessagesListResponse> => {
  const response = await axiosClient.get<ChatMessagesListResponse>(
    `/admin/chat/conversations/${conversationId}/messages`,
    { params: { pageIndex, pageSize } },
  );
  return response.data;
};

export const sendAdminMessageApi = async (
  conversationId: number,
  content: string,
): Promise<ChatMessageResponse> => {
  const response = await axiosClient.post<ChatMessageResponse>(
    "/admin/chat/messages",
    { conversationId, content },
  );
  return response.data;
};

export const markConversationMessagesAsReadApi = async (
  conversationId: number,
): Promise<ApiResponse> => {
  const response = await axiosClient.post<ApiResponse>(
    `/admin/chat/conversations/${conversationId}/mark-as-read`,
  );
  return response.data;
};
