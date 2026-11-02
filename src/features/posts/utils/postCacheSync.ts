import type { QueryClient } from "@tanstack/react-query";
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
  removeCommentFromPost,
  removePostFromFeed,
  type PostsFeedData,
  updateCommentInPost,
  updatePostInFeed,
} from "./postCache";

const detailsKey = (postId: number) => POSTS_QUERY_KEY.details(postId);

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
