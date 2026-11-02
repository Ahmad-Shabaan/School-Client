import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import type { User } from "@/features/auth/types/auth.types";
import { useAppSelector } from "@/store/hooks";
import type { ApiResponse } from "@/shared/types/api.types";
import { postsFeedQueryOptions, postQueryOptions } from "../options/post.options";
import { POSTS_QUERY_KEY } from "../constants/posts.constants";
import { createCommentApi, deleteCommentApi, updateCommentApi } from "../services/commentService";
import {
  createPostApi,
  deletePostApi,
  updatePostApi,
} from "../services/postService";
import type {
  CommentResponse,
  CommentDto,
  CreateCommentRequest,
  CreatePostRequest,
  DeleteCommentRequest,
  PostDto,
  PostResponse,
  UpdateCommentRequest,
} from "../types/post.types";
import {
  applyOptimisticCommentCreated,
  applyOptimisticCommentDeleted,
  applyOptimisticCommentUpdated,
  applyOptimisticPostCreated,
  applyOptimisticPostDeleted,
  applyOptimisticPostUpdated,
  nextOptimisticId,
  resolveOptimisticComment,
  resolveOptimisticPost,
  restorePostsQueries,
  snapshotPostsQueries,
  syncCommentDeleted,
  syncCommentUpdated,
  syncPostDeleted,
  syncPostUpdated,
} from "../utils/postCacheSync";

export const usePostsFeed = (courseId: number) =>
  useInfiniteQuery(postsFeedQueryOptions(courseId));

export const usePost = (postId: number) => useQuery(postQueryOptions(postId));

/**
 * Rollback state captured in `onMutate` for every optimistic mutation:
 * the full ["posts"] cache snapshot plus the temporary id of optimistic
 * creates (used to swap the temp entity against the server response).
 */
interface OptimisticPostsContext {
  snapshot: ReturnType<typeof snapshotPostsQueries>;
  optimisticId?: number;
}

const useCurrentUser = (): User | null =>
  useAppSelector((state) => state.auth.user);

const currentAuthor = (user: User | null) => ({
  authorId: user?.id ?? "",
  authorName: [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim(),
});

const errorTitle = (error: AxiosError): string =>
  handleErrorMessage(error).title;

// ── Posts ─────────────────────────────────────────────────────────────────
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useMutation<PostResponse, AxiosError, CreatePostRequest, OptimisticPostsContext>({
    mutationFn: createPostApi,
    async onMutate(request) {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY.all() });
      const snapshot = snapshotPostsQueries(queryClient);
      const author = currentAuthor(user);

      const post: PostDto = {
        id: nextOptimisticId(),
        authorId: author.authorId,
        authorName: author.authorName,
        courseId: request.courseId,
        content: request.content,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        comments: [],
      };

      applyOptimisticPostCreated(queryClient, post);
      return { snapshot, optimisticId: post.id };
    },
    onError(error, _vars, context) {
      if (context) restorePostsQueries(queryClient, context.snapshot);
      toast.error(errorTitle(error));
    },
    onSuccess: () => {
      toast.success("تم نشر المنشور بنجاح.");
    },
    onSettled(response, error, _vars, context) {
      if (error || !response || !context?.optimisticId) return;
      resolveOptimisticPost(queryClient, context.optimisticId, response.data);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostResponse,
    AxiosError,
    { id: number; content: string },
    OptimisticPostsContext
  >({
    mutationFn: updatePostApi,
    async onMutate({ id, content }) {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY.all() });
      const snapshot = snapshotPostsQueries(queryClient);

      applyOptimisticPostUpdated(
        queryClient,
        id,
        content,
        new Date().toISOString(),
      );
      return { snapshot };
    },
    onError(error, _vars, context) {
      if (context) restorePostsQueries(queryClient, context.snapshot);
      toast.error(errorTitle(error));
    },
    onSuccess: () => {
      toast.success("تم تحديث المنشور بنجاح.");
    },
    onSettled(response, error) {
      if (error || !response) return;
      syncPostUpdated(queryClient, response.data);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, AxiosError, number, OptimisticPostsContext>({
    mutationFn: deletePostApi,
    async onMutate(postId) {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY.all() });
      const snapshot = snapshotPostsQueries(queryClient);

      applyOptimisticPostDeleted(queryClient, postId);
      return { snapshot };
    },
    onError(error, _vars, context) {
      if (context) restorePostsQueries(queryClient, context.snapshot);
      toast.error(errorTitle(error));
    },
    onSuccess: () => {
      toast.success("تم حذف المنشور بنجاح.");
    },
    onSettled(_response, error, postId) {
      if (error) return;
      syncPostDeleted(queryClient, postId);
    },
  });
};

// ── Comments & replies ────────────────────────────────────────────────────
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useMutation<CommentResponse, AxiosError, CreateCommentRequest, OptimisticPostsContext>({
    mutationFn: createCommentApi,
    async onMutate(request) {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY.all() });
      const snapshot = snapshotPostsQueries(queryClient);
      const author = currentAuthor(user);

      const comment: CommentDto = {
        id: nextOptimisticId(),
        lessonId: null,
        postId: request.postId,
        parentCommentId: request.parentCommentId ?? null,
        authorId: author.authorId,
        authorName: author.authorName,
        content: request.content,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        replies: [],
      };

      applyOptimisticCommentCreated(queryClient, comment);
      return { snapshot, optimisticId: comment.id };
    },
    onError(error, _vars, context) {
      if (context) restorePostsQueries(queryClient, context.snapshot);
      toast.error(errorTitle(error));
    },
    onSuccess: () => {
      toast.success("تم إضافة التعليق بنجاح.");
    },
    onSettled(response, error, _vars, context) {
      if (error || !response || !context?.optimisticId) return;
      resolveOptimisticComment(
        queryClient,
        context.optimisticId,
        response.data,
      );
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, AxiosError, UpdateCommentRequest, OptimisticPostsContext>({
    mutationFn: updateCommentApi,
    async onMutate({ id, content }) {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY.all() });
      const snapshot = snapshotPostsQueries(queryClient);

      applyOptimisticCommentUpdated(
        queryClient,
        id,
        content,
        new Date().toISOString(),
      );
      return { snapshot };
    },
    onError(error, _vars, context) {
      if (context) restorePostsQueries(queryClient, context.snapshot);
      toast.error(errorTitle(error));
    },
    onSuccess: () => {
      toast.success("تم تحديث التعليق بنجاح.");
    },
    onSettled(response, error) {
      if (error || !response) return;
      syncCommentUpdated(queryClient, response.data);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    AxiosError,
    DeleteCommentRequest,
    OptimisticPostsContext
  >({
    mutationFn: deleteCommentApi,
    async onMutate({ id, postId }) {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY.all() });
      const snapshot = snapshotPostsQueries(queryClient);

      applyOptimisticCommentDeleted(queryClient, postId, id);
      return { snapshot };
    },
    onError(error, _vars, context) {
      if (context) restorePostsQueries(queryClient, context.snapshot);
      toast.error(errorTitle(error));
    },
    onSuccess: () => {
      toast.success("تم حذف التعليق بنجاح.");
    },
    onSettled(_response, error, { id, postId }) {
      if (error) return;
      syncCommentDeleted(queryClient, postId, id);
    },
  });
};
