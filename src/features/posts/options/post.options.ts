import {
  infiniteQueryOptions,
  queryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { ApiErrorResponse } from "@/shared/types/api.types";
import {
  POSTS_GC_TIME,
  POSTS_QUERY_KEY,
  POSTS_STALE_TIME,
} from "../constants/posts.constants";
import { getPostApi, getPostsApi } from "../services/postService";
import type { PostResponse, PostsResponse } from "../types/post.types";

export const postsFeedQueryOptions = (courseId: number) =>
  infiniteQueryOptions<
    PostsResponse,
    ApiErrorResponse,
    InfiniteData<PostsResponse, number>,
    ReturnType<typeof POSTS_QUERY_KEY.feed>,
    number
  >({
    queryKey: POSTS_QUERY_KEY.feed(courseId),
    queryFn: ({ pageParam }) => getPostsApi(courseId, pageParam),
    initialPageParam: 0,
    enabled: Number.isFinite(courseId) && courseId > 0,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      return pagination.pageIndex + 1 < pagination.totalPages
        ? pagination.pageIndex + 1
        : undefined;
    },
    staleTime: POSTS_STALE_TIME,
    gcTime: POSTS_GC_TIME,
    refetchOnWindowFocus: false,
  });

export const postQueryOptions = (postId: number) =>
  queryOptions<PostResponse, ApiErrorResponse>({
    queryKey: POSTS_QUERY_KEY.details(postId),
    queryFn: () => getPostApi(postId),
    staleTime: POSTS_STALE_TIME,
    gcTime: POSTS_GC_TIME,
    enabled: Number.isFinite(postId) && postId > 0,
  });
