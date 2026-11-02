import axiosClient from "@/shared/api/axiosClient";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  CommentResponse,
  CreateCommentRequest,
  DeleteCommentRequest,
  UpdateCommentRequest,
} from "../types/post.types";

export const createCommentApi = async (
  payload: CreateCommentRequest,
): Promise<CommentResponse> => {
  const response = await axiosClient.post<CommentResponse>(
    "/comments",
    payload,
  );
  return response.data;
};

export const updateCommentApi = async ({
  id,
  content,
}: UpdateCommentRequest): Promise<CommentResponse> => {
  const response = await axiosClient.put<CommentResponse>(`/comments/${id}`, {
    content,
  });
  return response.data;
};

export const deleteCommentApi = async ({
  id,
}: DeleteCommentRequest): Promise<ApiResponse> => {
  const response = await axiosClient.delete<ApiResponse>(`/comments/${id}`);
  return response.data;
};
