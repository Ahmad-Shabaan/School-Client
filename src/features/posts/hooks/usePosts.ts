import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import type { ApiResponse } from "@/shared/types/api.types";
import { postsFeedQueryOptions, postQueryOptions } from "../options/post.options";
import { createCommentApi, deleteCommentApi, updateCommentApi } from "../services/commentService";
import {
  createPostApi,
  deletePostApi,
  updatePostApi,
} from "../services/postService";
import type {
  CommentResponse,
  CreateCommentRequest,
  CreatePostRequest,
  DeleteCommentRequest,
  PostResponse,
  UpdateCommentRequest,
} from "../types/post.types";
import {
  syncCommentCreated,
  syncCommentDeleted,
  syncCommentUpdated,
  syncPostCreated,
  syncPostDeleted,
  syncPostUpdated,
} from "../utils/postCacheSync";

export const usePostsFeed = (courseId: number) =>
  useInfiniteQuery(postsFeedQueryOptions(courseId));

export const usePost = (postId: number) => useQuery(postQueryOptions(postId));

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<PostResponse, AxiosError, CreatePostRequest>({
    mutationFn: createPostApi,
    onSuccess: (response) => {
      syncPostCreated(queryClient, response.data);
      toast.success("تم نشر المنشور بنجاح.");
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostResponse,
    AxiosError,
    { id: number; content: string }
  >({
    mutationFn: updatePostApi,
    onSuccess: (response) => {
      syncPostUpdated(queryClient, response.data);
      toast.success("تم تحديث المنشور بنجاح.");
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, AxiosError, number>({
    mutationFn: deletePostApi,
    onSuccess: (_response, postId) => {
      syncPostDeleted(queryClient, postId);
      toast.success("تم حذف المنشور بنجاح.");
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, AxiosError, CreateCommentRequest>({
    mutationFn: createCommentApi,
    onSuccess: (response) => {
      syncCommentCreated(queryClient, response.data);
      toast.success("تم إضافة التعليق بنجاح.");
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, AxiosError, UpdateCommentRequest>({
    mutationFn: updateCommentApi,
    onSuccess: (response) => {
      syncCommentUpdated(queryClient, response.data);
      toast.success("تم تحديث التعليق بنجاح.");
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, AxiosError, DeleteCommentRequest>({
    mutationFn: deleteCommentApi,
    onSuccess: (_response, { id, postId }) => {
      syncCommentDeleted(queryClient, postId, id);
      toast.success("تم حذف التعليق بنجاح.");
    },
    onError: (error) => {
      toast.error(handleErrorMessage(error).title);
    },
  });
};
