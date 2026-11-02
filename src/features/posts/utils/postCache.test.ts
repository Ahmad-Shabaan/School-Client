import { describe, expect, it } from "vitest";
import type { CommentDto, PostDto, PostsResponse } from "../types/post.types";
import {
  addCommentToPost,
  addPostToFeed,
  flattenPosts,
  removeCommentFromPost,
  removePostFromFeed,
  updateCommentInPost,
  type PostsFeedData,
} from "./postCache";

const makeComment = (
  id: number,
  overrides: Partial<CommentDto> = {},
): CommentDto => ({
  id,
  lessonId: null,
  postId: 1,
  parentCommentId: null,
  authorId: "user-1",
  authorName: "أحمد علي",
  content: `تعليق ${id}`,
  createdAt: "2026-11-01T10:00:00Z",
  updatedAt: null,
  replies: [],
  ...overrides,
});

const makePost = (id: number, overrides: Partial<PostDto> = {}): PostDto => ({
  id,
  authorId: "user-1",
  courseId: 1,
  authorName: "أحمد علي",
  content: `منشور ${id}`,
  createdAt: "2026-11-01T09:00:00Z",
  updatedAt: null,
  comments: [],
  ...overrides,
});

const makeResponse = (
  data: PostDto[],
  pageIndex = 0,
  totalCount = data.length,
): PostsResponse => ({
  success: true,
  message: "",
  data,
  pagination: {
    pageIndex,
    pageSize: 10,
    totalCount,
    totalPages: Math.ceil(totalCount / 10),
  },
});

const makeFeed = (...pages: PostsResponse[]): PostsFeedData => ({
  pages,
  pageParams: pages.map((page) => page.pagination?.pageIndex ?? 0),
});

describe("postCache", () => {
  it("prepends a new post and updates pagination", () => {
    const feed = makeFeed(makeResponse([makePost(2)]));
    const next = addPostToFeed(feed, makePost(1));

    expect(next?.pages[0].data.map((post) => post.id)).toEqual([1, 2]);
    expect(next?.pages[0].pagination?.totalCount).toBe(2);
  });

  it("does not add a post that already exists in the feed", () => {
    const feed = makeFeed(makeResponse([makePost(1)]));

    expect(addPostToFeed(feed, makePost(1))).toBe(feed);
  });

  it("flattens pages without duplicate posts", () => {
    const feed = makeFeed(
      makeResponse([makePost(3), makePost(2)]),
      makeResponse([makePost(2), makePost(1)], 1, 4),
    );

    expect(flattenPosts(feed).map((post) => post.id)).toEqual([3, 2, 1]);
  });

  it("removes a post and decrements pagination once", () => {
    const feed = makeFeed(makeResponse([makePost(2), makePost(1)]));
    const next = removePostFromFeed(feed, 2);

    expect(next?.pages[0].data.map((post) => post.id)).toEqual([1]);
    expect(next?.pages[0].pagination?.totalCount).toBe(1);
  });

  it("adds top-level comments and replies without duplicates", () => {
    const post = makePost(1);
    const comment = makeComment(5);
    const reply = makeComment(6, { parentCommentId: 5 });

    const withComment = addCommentToPost(post, comment);
    const withReply = addCommentToPost(withComment, reply);

    expect(withReply.comments).toHaveLength(1);
    expect(withReply.comments[0].replies.map((item) => item.id)).toEqual([6]);
    expect(addCommentToPost(withReply, comment)).toBe(withReply);
    expect(addCommentToPost(withReply, reply)).toBe(withReply);
  });

  it("rejects replies to replies and orphan replies", () => {
    const post = makePost(1, {
      comments: [
        makeComment(5, {
          replies: [makeComment(6, { parentCommentId: 5 })],
        }),
      ],
    });

    expect(
      addCommentToPost(post, makeComment(7, { parentCommentId: 6 })),
    ).toBe(post);
    expect(
      addCommentToPost(post, makeComment(8, { parentCommentId: 99 })),
    ).toBe(post);
  });

  it("removes a top-level comment with its replies", () => {
    const post = makePost(1, {
      comments: [
        makeComment(5, {
          replies: [makeComment(6, { parentCommentId: 5 })],
        }),
        makeComment(7),
      ],
    });

    expect(removeCommentFromPost(post, 5).comments.map((item) => item.id)).toEqual(
      [7],
    );
  });

  it("updates nested reply content", () => {
    const post = makePost(1, {
      comments: [
        makeComment(5, {
          replies: [makeComment(6, { parentCommentId: 5 })],
        }),
      ],
    });

    const next = updateCommentInPost(
      post,
      6,
      "رد معدل",
      "2026-11-01T11:00:00Z",
    );

    expect(next.comments[0].replies[0].content).toBe("رد معدل");
    expect(next.comments[0].replies[0].updatedAt).toBe(
      "2026-11-01T11:00:00Z",
    );
  });
});
