import type { ApiResponse } from "@/shared/types/api.types";

export interface CommentDto {
  id: number;
  lessonId: number | null;
  postId: number | null;
  parentCommentId: number | null;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  replies: CommentDto[];
}

export interface PostDto {
  id: number;
  authorId: string;
  courseId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  comments: CommentDto[];
}

export interface PostsResponse extends ApiResponse {
  data: PostDto[];
}

export interface PostResponse extends ApiResponse {
  data: PostDto;
}

export interface CommentResponse extends ApiResponse {
  data: CommentDto;
}

export interface CreatePostRequest {
  courseId: number;
  content: string;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentCommentId?: number;
}

export interface UpdateCommentRequest {
  id: number;
  content: string;
}

export interface DeleteCommentRequest {
  id: number;
  postId: number;
}
