import axiosClient from "@/shared/api/axiosClient";
import type { ApiResponse } from "@/shared/types/api.types";
import { POSTS_PAGE_SIZE } from "../constants/posts.constants";
import type {
  CreatePostRequest,
  PostResponse,
  PostsResponse,
} from "../types/post.types";

export const getPostsApi = async (
  courseId: number,
  pageIndex: number,
  pageSize: number = POSTS_PAGE_SIZE,
): Promise<PostsResponse> => {
  const response = await axiosClient.get<PostsResponse>("/posts", {
    params: { courseId, pageIndex, pageSize },
  });
  return response.data;
};

export const getPostApi = async (postId: number): Promise<PostResponse> => {
  const response = await axiosClient.get<PostResponse>(`/posts/${postId}`);
  return response.data;
};

export const createPostApi = async (
  payload: CreatePostRequest,
): Promise<PostResponse> => {
  const response = await axiosClient.post<PostResponse>("/posts", payload);
  return response.data;
};

export const updatePostApi = async ({
  id,
  content,
}: {
  id: number;
  content: string;
}): Promise<PostResponse> => {
  const response = await axiosClient.put<PostResponse>(`/posts/${id}`, {
    content,
  });
  return response.data;
};

export const deletePostApi = async (postId: number): Promise<ApiResponse> => {
  const response = await axiosClient.delete<ApiResponse>(`/posts/${postId}`);
  return response.data;
};
