import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { POSTS_QUERY_KEY } from "../constants/posts.constants";
import type {
  CommentDto,
  PostDto,
  PostResponse,
} from "../types/post.types";
import {
  addCommentToPost,
  addPostToFeed,
  findCommentInPost,
  patchEveryPostInFeed,
  removeCommentFromPost,
  removePostFromFeed,
  type PostsFeedData,
  updateCommentInPost,
  updatePostInFeed,
} from "./postCache";

const detailsKey = (postId: number) => POSTS_QUERY_KEY.details(postId);

/**
 * Optimsitic inserts/updates use negative ids produced by a monotonically
 * decreasing seed, so they can never collide with real server ids or with
 * each other while several optimistic entities are in flight.
 */
let optimisticIdSeed = Date.now();

export const nextOptimisticId = (): number => --optimisticIdSeed;

// ── Snapshot / rollback ───────────────────────────────────────────────────
export type PostsCacheSnapshot = [QueryKey, unknown][];

export const snapshotPostsQueries = (
  queryClient: QueryClient,
): PostsCacheSnapshot =>
  queryClient.getQueriesData<unknown>({ queryKey: POSTS_QUERY_KEY.all() });

export const restorePostsQueries = (
  queryClient: QueryClient,
  snapshot: PostsCacheSnapshot,
): void => {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data);
  }
};

// ── Shared caching helpers ────────────────────────────────────────────────
const isEventUpToDate = (
  cached: string | null,
  incoming: string | null,
): boolean => {
  if (cached == null || incoming == null) return true;

  return new Date(incoming).getTime() >= new Date(cached).getTime();
};

const updateFeedForCourse = (
  queryClient: QueryClient,
  courseId: number,
  updater: (feed: PostsFeedData) => PostsFeedData,
): void => {
  const key = POSTS_QUERY_KEY.feed(courseId);
  const feed = queryClient.getQueryData<PostsFeedData>(key);
  if (!feed) return;

  const next = updater(feed);
  if (next !== feed) {
    queryClient.setQueryData<PostsFeedData>(key, next);
  }
};

const updateAllFeeds = (
  queryClient: QueryClient,
  updater: (feed: PostsFeedData) => PostsFeedData,
): void => {
  queryClient.setQueriesData<PostsFeedData>(
    { queryKey: POSTS_QUERY_KEY.feeds() },
    (feed) => {
      if (!feed) return feed;

      const next = updater(feed);
      return next === feed ? feed : next;
    },
  );
};

const updatePostDetail = (
  queryClient: QueryClient,
  postId: number,
  updater: (post: PostDto) => PostDto,
): void => {
  const key = detailsKey(postId);
  const response = queryClient.getQueryData<PostResponse>(key);
  if (!response) return;

  const next = updater(response.data);
  if (next !== response.data) {
    queryClient.setQueryData<PostResponse>(key, { ...response, data: next });
  }
};

/**
 * Patches every cached post-detail query. Used by optimistic comment updates,
 * where the mutation input only carries the comment id, not the postId.
 */
const updateAllPostDetails = (
  queryClient: QueryClient,
  updater: (post: PostDto) => PostDto,
): void => {
  queryClient.setQueriesData<PostResponse>(
    { queryKey: POSTS_QUERY_KEY.detailsAll() },
    (response: PostResponse | undefined) => {
      if (!response) return response;

      const next = updater(response.data);
      return next === response.data ? response : { ...response, data: next };
    },
  );
};

export const syncPostCreated = (
  queryClient: QueryClient,
  post: PostDto,
): void => {
  updateFeedForCourse(queryClient, post.courseId, (feed) =>
    addPostToFeed(feed, post) ?? feed,
  );
};

export const syncPostUpdated = (
  queryClient: QueryClient,
  post: PostDto,
): void => {
  const patch = (current: PostDto): PostDto => {
    if (current.id !== post.id) return current;
    if (!isEventUpToDate(current.updatedAt, post.updatedAt)) return current;

    return { ...current, content: post.content, updatedAt: post.updatedAt };
  };

  updateFeedForCourse(queryClient, post.courseId, (feed) =>
    updatePostInFeed(feed, post.id, patch),
  );
  updatePostDetail(queryClient, post.id, patch);
};

export const syncPostDeleted = (
  queryClient: QueryClient,
  postId: number,
): void => {
  updateAllFeeds(
    queryClient,
    (feed) => removePostFromFeed(feed, postId) ?? feed,
  );
  queryClient.removeQueries({ queryKey: detailsKey(postId), exact: true });
};

export const syncCommentCreated = (
  queryClient: QueryClient,
  comment: CommentDto,
): void => {
  const postId = comment.postId;
  if (postId == null) return;

  updateAllFeeds(queryClient, (feed) =>
    updatePostInFeed(feed, postId, (post) =>
      addCommentToPost(post, comment),
    ),
  );
  updatePostDetail(queryClient, postId, (post) =>
    addCommentToPost(post, comment),
  );
};

export const syncCommentUpdated = (
  queryClient: QueryClient,
  comment: CommentDto,
): void => {
  const postId = comment.postId;
  if (postId == null) return;

  const patch = (post: PostDto): PostDto => {
    const cached = findCommentInPost(post, comment.id);
    if (!cached) return post;
    if (!isEventUpToDate(cached.updatedAt, comment.updatedAt)) return post;

    return updateCommentInPost(
      post,
      comment.id,
      comment.content,
      comment.updatedAt,
    );
  };

  updateAllFeeds(queryClient, (feed) =>
    updatePostInFeed(feed, postId, patch),
  );
  updatePostDetail(queryClient, postId, patch);
};

export const syncCommentDeleted = (
  queryClient: QueryClient,
  postId: number,
  commentId: number,
): void => {
  const patch = (post: PostDto): PostDto =>
    removeCommentFromPost(post, commentId);

  updateAllFeeds(queryClient, (feed) =>
    updatePostInFeed(feed, postId, patch),
  );
  updatePostDetail(queryClient, postId, patch);
};

// ── Optimistic updates (immediate, no time-gate) ──────────────────────────
// Optimistic values were just typed by the user, so they bypass the
// isEventUpToDate guard used for server / SignalR events.

export const applyOptimisticPostCreated = (
  queryClient: QueryClient,
  post: PostDto,
): void => {
  updateFeedForCourse(queryClient, post.courseId, (feed) =>
    addPostToFeed(feed, post) ?? feed,
  );
};

export const applyOptimisticPostUpdated = (
  queryClient: QueryClient,
  postId: number,
  content: string,
  updatedAt: string,
): void => {
  const patch = (current: PostDto): PostDto =>
    current.id === postId ? { ...current, content, updatedAt } : current;

  updateAllFeeds(queryClient, (feed) => updatePostInFeed(feed, postId, patch));
  updateAllPostDetails(queryClient, patch);
};

export const applyOptimisticPostDeleted = (
  queryClient: QueryClient,
  postId: number,
): void => {
  updateAllFeeds(
    queryClient,
    (feed) => removePostFromFeed(feed, postId) ?? feed,
  );
  queryClient.removeQueries({ queryKey: detailsKey(postId), exact: true });
};

export const applyOptimisticCommentCreated = (
  queryClient: QueryClient,
  comment: CommentDto,
): void => {
  const postId = comment.postId;
  if (postId == null) return;

  updateAllFeeds(queryClient, (feed) =>
    updatePostInFeed(feed, postId, (post) =>
      addCommentToPost(post, comment),
    ),
  );
  updatePostDetail(queryClient, postId, (post) =>
    addCommentToPost(post, comment),
  );
};

export const applyOptimisticCommentUpdated = (
  queryClient: QueryClient,
  commentId: number,
  content: string,
  updatedAt: string,
): void => {
  const patch = (post: PostDto): PostDto =>
    updateCommentInPost(post, commentId, content, updatedAt);

  updateAllFeeds(queryClient, (feed) => patchEveryPostInFeed(feed, patch));
  updateAllPostDetails(queryClient, patch);
};

export const applyOptimisticCommentDeleted = (
  queryClient: QueryClient,
  postId: number,
  commentId: number,
): void => {
  updateAllFeeds(queryClient, (feed) =>
    updatePostInFeed(feed, postId, (post) =>
      removeCommentFromPost(post, commentId),
    ),
  );
  updatePostDetail(queryClient, postId, (post) =>
    removeCommentFromPost(post, commentId),
  );
};

// ── Resolving optimistic entities (temp id → server id) ───────────────────
/**
 * Swaps a temporary optimistic post for the server entity. The removal first
 * drops the temporary row (returns pagination to its snapshot state), then the
 * real post is applied with the same dedup logic used by SignalR events.
 */
export const resolveOptimisticPost = (
  queryClient: QueryClient,
  optimisticId: number,
  post: PostDto,
): void => {
  applyOptimisticPostDeleted(queryClient, optimisticId);
  syncPostCreated(queryClient, post);
};

export const resolveOptimisticComment = (
  queryClient: QueryClient,
  optimisticId: number,
  comment: CommentDto,
): void => {
  if (comment.postId == null) return;

  applyOptimisticCommentDeleted(
    queryClient,
    comment.postId,
    optimisticId,
  );
  syncCommentCreated(queryClient, comment);
};
