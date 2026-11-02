import type { ApiResponse } from "@/shared/types/api.types";

export interface ChatMessageDto {
  id: number;
  conversationId: number;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export interface ConversationDto {
  id: number;
  studentId: string;
  studentName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface ChatMessageResponse extends ApiResponse {
  data: ChatMessageDto;
}

export interface ChatMessagesListResponse extends ApiResponse {
  data: ChatMessageDto[];
}

export interface ConversationResponse extends ApiResponse {
  data: ConversationDto;
}

export interface ConversationsListResponse extends ApiResponse {
  data: ConversationDto[];
}

export interface ChatUnreadCountResponse extends ApiResponse {
  data: number;
}
