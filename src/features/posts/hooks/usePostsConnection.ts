import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import { POSTS_QUERY_KEY } from "../constants/posts.constants";
import type { PostResponse } from "../types/post.types";
import {
  ensurePostsConnection,
  onPostCommentAdded,
  onPostCommentDeleted,
  onPostCommentUpdated,
  onPostCreated,
  onPostDeleted,
  onPostUpdated,
  onPostsReconnected,
  stopPostsConnection,
} from "../services/postsHub";
import { flattenPosts, type PostsFeedData } from "../utils/postCache";
import {
  syncCommentCreated,
  syncCommentDeleted,
  syncCommentUpdated,
  syncPostCreated,
  syncPostDeleted,
  syncPostUpdated,
} from "../utils/postCacheSync";

export default function usePostsConnection(courseId: number) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !userId ||
      !Number.isFinite(courseId) ||
      courseId <= 0
    ) {
      stopPostsConnection();
      return;
    }

    const isPostInCourse = (postId: number): boolean => {
      const feed = queryClient.getQueryData<PostsFeedData>(
        POSTS_QUERY_KEY.feed(courseId),
      );

      if (feed && flattenPosts(feed).some((post) => post.id === postId)) {
        return true;
      }

      const detail = queryClient.getQueryData<PostResponse>(
        POSTS_QUERY_KEY.details(postId),
      );

      return detail?.data.courseId === courseId;
    };

    const unsubscribeCreated = onPostCreated((post) => {
      if (post.courseId !== courseId) return;
      syncPostCreated(queryClient, post);
    });

    const unsubscribeUpdated = onPostUpdated((post) => {
      if (post.courseId !== courseId) return;
      syncPostUpdated(queryClient, post);
    });

    const unsubscribeDeleted = onPostDeleted((payload) => {
      if (payload.courseId !== courseId) return;
      syncPostDeleted(queryClient, payload.id);
    });

    const unsubscribeComment = onPostCommentAdded((comment) => {
      if (comment.postId == null || !isPostInCourse(comment.postId)) return;
      syncCommentCreated(queryClient, comment);
    });

    const unsubscribeCommentUpdated = onPostCommentUpdated((comment) => {
      if (comment.postId == null || !isPostInCourse(comment.postId)) return;
      syncCommentUpdated(queryClient, comment);
    });

    const unsubscribeCommentDeleted = onPostCommentDeleted((payload) => {
      if (!isPostInCourse(payload.postId)) return;
      syncCommentDeleted(queryClient, payload.postId, payload.id);
    });

    const unsubscribeReconnect = onPostsReconnected(() => {
      void queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEY.feed(courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEY.detailsAll(),
      });
    });

    void ensurePostsConnection(userId);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeComment();
      unsubscribeCommentUpdated();
      unsubscribeCommentDeleted();
      unsubscribeReconnect();
      stopPostsConnection();
    };
  }, [courseId, isAuthenticated, userId, queryClient]);
}
