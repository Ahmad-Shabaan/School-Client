import type { InfiniteData } from "@tanstack/react-query";
import type {
  CommentDto,
  PostDto,
  PostsResponse,
} from "../types/post.types";

export type PostsFeedData = InfiniteData<PostsResponse, number>;

const adjustPagination = (
  feed: PostsFeedData,
  delta: number,
): PostsFeedData => ({
  ...feed,
  pages: feed.pages.map((page) => {
    if (!page.pagination) return page;

    const totalCount = Math.max(0, page.pagination.totalCount + delta);
    const totalPages =
      page.pagination.pageSize > 0
        ? Math.ceil(totalCount / page.pagination.pageSize)
        : 0;

    return {
      ...page,
      pagination: {
        ...page.pagination,
        totalCount,
        totalPages,
      },
    };
  }),
});

const commentExists = (comments: CommentDto[], commentId: number): boolean =>
  comments.some(
    (comment) =>
      comment.id === commentId ||
      commentExists(comment.replies ?? [], commentId),
  );

const findCommentInTree = (
  comments: CommentDto[],
  commentId: number,
): CommentDto | null => {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;

    const match = findCommentInTree(comment.replies ?? [], commentId);
    if (match) return match;
  }

  return null;
};

export const findCommentInPost = (
  post: PostDto,
  commentId: number,
): CommentDto | null => findCommentInTree(post.comments, commentId);

const postExistsInFeed = (feed: PostsFeedData, postId: number): boolean =>
  feed.pages.some((page) => page.data.some((post) => post.id === postId));

export const addPostToFeed = (
  feed: PostsFeedData | undefined,
  post: PostDto,
): PostsFeedData | undefined => {
  if (!feed || feed.pages.length === 0 || postExistsInFeed(feed, post.id)) {
    return feed;
  }

  const [firstPage, ...rest] = feed.pages;
  const next: PostsFeedData = {
    ...feed,
    pages: [
      { ...firstPage, data: [post, ...firstPage.data] },
      ...rest,
    ],
  };

  return adjustPagination(next, 1);
};

export const updatePostInFeed = (
  feed: PostsFeedData,
  postId: number,
  updater: (post: PostDto) => PostDto,
): PostsFeedData => {
  let changed = false;

  const pages = feed.pages.map((page) => {
    const index = page.data.findIndex((post) => post.id === postId);
    if (index === -1) return page;

    const current = page.data[index];
    const updated = updater(current);
    if (updated === current) return page;

    changed = true;
    const data = [...page.data];
    data[index] = updated;
    return { ...page, data };
  });

  return changed ? { ...feed, pages } : feed;
};

/**
 * Applies a per-post patch to every post cached in a feed. Used when the
 * updater target is known only by an id stored inside the post tree
 * (e.g. optimistic comment edits, where the mutation input has no postId).
 */
export const patchEveryPostInFeed = (
  feed: PostsFeedData,
  updater: (post: PostDto) => PostDto,
): PostsFeedData => {
  let changed = false;

  const pages = feed.pages.map((page) => {
    const data = page.data.map((post) => {
      const updated = updater(post);
      if (updated === post) return post;

      changed = true;
      return updated;
    });

    return changed ? { ...page, data } : page;
  });

  return changed ? { ...feed, pages } : feed;
};

export const removePostFromFeed = (
  feed: PostsFeedData | undefined,
  postId: number,
): PostsFeedData | undefined => {
  if (!feed || !postExistsInFeed(feed, postId)) return feed;

  const pages = feed.pages.map((page) => ({
    ...page,
    data: page.data.filter((post) => post.id !== postId),
  }));

  return adjustPagination({ ...feed, pages }, -1);
};

export const flattenPosts = (
  feed: PostsFeedData | undefined,
): PostDto[] => {
  if (!feed) return [];

  const seen = new Set<number>();
  const posts: PostDto[] = [];

  for (const page of feed.pages) {
    for (const post of page.data) {
      if (seen.has(post.id)) continue;
      seen.add(post.id);
      posts.push(post);
    }
  }

  return posts;
};

export const addCommentToPost = (
  post: PostDto,
  comment: CommentDto,
): PostDto => {
  if (commentExists(post.comments, comment.id)) return post;

  if (comment.parentCommentId == null) {
    return { ...post, comments: [...post.comments, comment] };
  }

  const parent = post.comments.find(
    (item) => item.id === comment.parentCommentId,
  );
  if (!parent) return post;

  return {
    ...post,
    comments: post.comments.map((item) =>
      item.id === parent.id
        ? { ...item, replies: [...item.replies, comment] }
        : item,
    ),
  };
};

const removeCommentFromTree = (
  comments: CommentDto[],
  commentId: number,
): { comments: CommentDto[]; removed: boolean } => {
  let removed = false;
  const next: CommentDto[] = [];

  for (const comment of comments) {
    if (comment.id === commentId) {
      removed = true;
      continue;
    }

    const replies = removeCommentFromTree(comment.replies, commentId);
    if (replies.removed) {
      removed = true;
      next.push({ ...comment, replies: replies.comments });
    } else {
      next.push(comment);
    }
  }

  return removed ? { comments: next, removed } : { comments, removed };
};

export const removeCommentFromPost = (
  post: PostDto,
  commentId: number,
): PostDto => {
  const result = removeCommentFromTree(post.comments, commentId);
  return result.removed ? { ...post, comments: result.comments } : post;
};

const updateCommentInTree = (
  comments: CommentDto[],
  commentId: number,
  content: string,
  updatedAt: string | null,
): { comments: CommentDto[]; changed: boolean } => {
  let changed = false;

  const next = comments.map((comment) => {
    if (comment.id === commentId) {
      changed = true;
      return { ...comment, content, updatedAt };
    }

    const replies = updateCommentInTree(
      comment.replies,
      commentId,
      content,
      updatedAt,
    );
    if (replies.changed) {
      changed = true;
      return { ...comment, replies: replies.comments };
    }

    return comment;
  });

  return changed ? { comments: next, changed } : { comments, changed };
};

export const updateCommentInPost = (
  post: PostDto,
  commentId: number,
  content: string,
  updatedAt: string | null,
): PostDto => {
  const result = updateCommentInTree(
    post.comments,
    commentId,
    content,
    updatedAt,
  );
  return result.changed ? { ...post, comments: result.comments } : post;
};
