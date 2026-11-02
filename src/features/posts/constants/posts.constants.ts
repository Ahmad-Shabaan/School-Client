export const POSTS_PAGE_SIZE = 10;
export const POSTS_STALE_TIME = 60_000;
export const POSTS_GC_TIME = 1_800_000;
export const MAX_POST_LENGTH = 2000;
export const MAX_COMMENT_LENGTH = 2000;

export const POSTS_QUERY_KEY = {
  all: () => ["posts"] as const,
  feeds: () => ["posts", "feed"] as const,
  feed: (courseId: number) => ["posts", "feed", courseId] as const,
  detailsAll: () => ["posts", "details"] as const,
  details: (postId: number) => ["posts", "details", postId] as const,
};

export const POSTS_HUB_PATH = "/hubs/posts";
export const POST_CREATED_EVENT = "PostCreated";
export const POST_UPDATED_EVENT = "PostUpdated";
export const POST_DELETED_EVENT = "PostDeleted";
export const POST_COMMENT_ADDED_EVENT = "PostCommentAdded";
export const POST_COMMENT_UPDATED_EVENT = "PostCommentUpdated";
export const POST_COMMENT_DELETED_EVENT = "PostCommentDeleted";
