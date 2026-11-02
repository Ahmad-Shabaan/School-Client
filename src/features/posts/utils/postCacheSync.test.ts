import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { POSTS_QUERY_KEY } from "../constants/posts.constants";
import type { CommentDto, PostDto, PostResponse } from "../types/post.types";
import type { PostsFeedData } from "./postCache";
import {
  syncCommentCreated,
  syncCommentDeleted,
  syncCommentUpdated,
  syncPostCreated,
  syncPostDeleted,
  syncPostUpdated,
} from "./postCacheSync";

const FEED_KEY = POSTS_QUERY_KEY.feed(1);

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

const makeFeed = (post: PostDto): PostsFeedData => ({
  pages: [
    {
      success: true,
      message: "",
      data: [post],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
        totalCount: 1,
        totalPages: 1,
      },
    },
  ],
  pageParams: [0],
});

const makeDetail = (post: PostDto): PostResponse => ({
  success: true,
  message: "",
  data: post,
});

describe("postCacheSync", () => {
  it("adds a real-time post only to the matching course feed", () => {
    const queryClient = new QueryClient();

    queryClient.setQueryData<PostsFeedData>(
      POSTS_QUERY_KEY.feed(1),
      makeFeed(makePost(1)),
    );
    queryClient.setQueryData<PostsFeedData>(
      POSTS_QUERY_KEY.feed(2),
      makeFeed(makePost(2, { courseId: 2 })),
    );

    syncPostCreated(queryClient, makePost(3, { courseId: 2 }));

    const firstFeed = queryClient.getQueryData<PostsFeedData>(
      POSTS_QUERY_KEY.feed(1),
    );
    const secondFeed = queryClient.getQueryData<PostsFeedData>(
      POSTS_QUERY_KEY.feed(2),
    );

    expect(firstFeed?.pages[0].data.map((post) => post.id)).toEqual([1]);
    expect(secondFeed?.pages[0].data.map((post) => post.id)).toEqual([3, 2]);
  });

  it("keeps one copy when a real-time post arrives after the mutation cache update", () => {
    const queryClient = new QueryClient();
    const post = makePost(1);

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));
    syncPostCreated(queryClient, post);
    syncPostCreated(queryClient, post);

    const feed = queryClient.getQueryData<PostsFeedData>(FEED_KEY);
    expect(feed?.pages[0].data).toHaveLength(1);
  });

  it("adds a real-time comment to the feed and open post details once", () => {
    const queryClient = new QueryClient();
    const post = makePost(1);
    const comment = makeComment(5);

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(post),
    );

    syncCommentCreated(queryClient, comment);
    syncCommentCreated(queryClient, comment);

    const feed = queryClient.getQueryData<PostsFeedData>(FEED_KEY);
    const detail = queryClient.getQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
    );

    expect(feed?.pages[0].data[0].comments).toHaveLength(1);
    expect(detail?.data.comments).toHaveLength(1);
  });

  it("updates post content without replacing newer cached comments", () => {
    const queryClient = new QueryClient();
    const cachedComment = makeComment(9);
    const cachedPost = makePost(1, { comments: [cachedComment] });

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(cachedPost));
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(cachedPost),
    );

    syncPostUpdated(queryClient, {
      ...makePost(1),
      content: "محتوى محدث",
      updatedAt: "2026-11-01T12:00:00Z",
      comments: [],
    });

    const feedPost = queryClient.getQueryData<PostsFeedData>(FEED_KEY)
      ?.pages[0].data[0];
    const detailPost = queryClient.getQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
    )?.data;

    expect(feedPost?.content).toBe("محتوى محدث");
    expect(feedPost?.comments[0].id).toBe(9);
    expect(detailPost?.comments[0].id).toBe(9);
  });

  it("updates comment content in both caches", () => {
    const queryClient = new QueryClient();
    const post = makePost(1, { comments: [makeComment(5)] });

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(post),
    );

    syncCommentUpdated(queryClient, {
      ...makeComment(5),
      content: "تعليق محدث",
      updatedAt: "2026-11-01T12:30:00Z",
    });

    const feedComment = queryClient.getQueryData<PostsFeedData>(FEED_KEY)
      ?.pages[0].data[0].comments[0];
    const detailComment = queryClient.getQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
    )?.data.comments[0];

    expect(feedComment?.content).toBe("تعليق محدث");
    expect(detailComment?.content).toBe("تعليق محدث");
  });

  it("does not overwrite a newer cached post with an older event", () => {
    const queryClient = new QueryClient();

    queryClient.setQueryData<PostsFeedData>(
      FEED_KEY,
      makeFeed(
        makePost(1, {
          content: "أحدث محليًا",
          updatedAt: "2026-11-01T12:00:00Z",
        }),
      ),
    );

    syncPostUpdated(queryClient, {
      ...makePost(1),
      content: "منشور قديم",
      updatedAt: "2026-11-01T11:00:00Z",
    });

    const feedPost = queryClient.getQueryData<PostsFeedData>(FEED_KEY)
      ?.pages[0].data[0];

    expect(feedPost?.content).toBe("أحدث محليًا");
    expect(feedPost?.updatedAt).toBe("2026-11-01T12:00:00Z");
  });

  it("applies a comment update and updates the timestamp", () => {
    const queryClient = new QueryClient();
    const post = makePost(1, { comments: [makeComment(5)] });

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(post),
    );

    syncCommentUpdated(queryClient, {
      ...makeComment(5),
      content: "تعليق محدث",
      updatedAt: "2026-11-01T12:30:00Z",
    });

    const detailComment = queryClient.getQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
    )?.data.comments[0];

    expect(detailComment?.content).toBe("تعليق محدث");
    expect(detailComment?.updatedAt).toBe("2026-11-01T12:30:00Z");
  });

  it("does not overwrite a newer cached comment with an older event", () => {
    const queryClient = new QueryClient();

    queryClient.setQueryData<PostsFeedData>(
      FEED_KEY,
      makeFeed(
        makePost(1, {
          comments: [
            makeComment(5, {
              content: "أحدث محليًا",
              updatedAt: "2026-11-01T13:00:00Z",
            }),
          ],
        }),
      ),
    );

    syncCommentUpdated(queryClient, {
      ...makeComment(5),
      content: "تعليق قديم",
      updatedAt: "2026-11-01T12:00:00Z",
    });

    const feedComment = queryClient.getQueryData<PostsFeedData>(FEED_KEY)
      ?.pages[0].data[0].comments[0];

    expect(feedComment?.content).toBe("أحدث محليًا");
    expect(feedComment?.updatedAt).toBe("2026-11-01T13:00:00Z");
  });

  it("removes a deleted post from all feeds and drops its details cache", () => {
    const queryClient = new QueryClient();

    queryClient.setQueryData<PostsFeedData>(
      FEED_KEY,
      makeFeed(makePost(1)),
    );
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(makePost(1)),
    );

    syncPostDeleted(queryClient, 1);
    syncPostDeleted(queryClient, 1);

    const feed = queryClient.getQueryData<PostsFeedData>(FEED_KEY);

    expect(feed?.pages[0].data).toHaveLength(0);
    expect(
      queryClient.getQueryData<PostResponse>(POSTS_QUERY_KEY.details(1)),
    ).toBeUndefined();
  });

  it("removes a deleted parent comment together with its nested replies", () => {
    const queryClient = new QueryClient();
    const reply = makeComment(6, { parentCommentId: 5 });
    const post = makePost(1, {
      comments: [makeComment(5, { replies: [reply] }), makeComment(7)],
    });

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(post),
    );

    syncCommentDeleted(queryClient, 1, 5);

    const feedComments = queryClient.getQueryData<PostsFeedData>(FEED_KEY)
      ?.pages[0].data[0].comments;
    const detailComments = queryClient.getQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
    )?.data.comments;

    expect(feedComments?.map((comment) => comment.id)).toEqual([7]);
    expect(detailComments?.map((comment) => comment.id)).toEqual([7]);
  });

  it("removes a deleted reply without touching sibling replies", () => {
    const queryClient = new QueryClient();
    const reply = makeComment(6, { parentCommentId: 5 });
    const siblingReply = makeComment(8, { parentCommentId: 5 });
    const post = makePost(1, {
      comments: [
        makeComment(5, { replies: [reply, siblingReply] }),
      ],
    });

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));

    syncCommentDeleted(queryClient, 1, 6);

    const parent = queryClient.getQueryData<PostsFeedData>(FEED_KEY)
      ?.pages[0].data[0].comments[0];

    expect(parent?.replies.map((comment) => comment.id)).toEqual([8]);
  });

  it("leaves the cache untouched when events reference unknown posts or comments", () => {
    const queryClient = new QueryClient();
    const post = makePost(1, { comments: [makeComment(5)] });

    queryClient.setQueryData<PostsFeedData>(FEED_KEY, makeFeed(post));
    queryClient.setQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
      makeDetail(post),
    );

    syncPostUpdated(queryClient, { ...makePost(99), content: "منشور جديد" });
    syncCommentUpdated(queryClient, {
      ...makeComment(99),
      postId: 1,
      content: "تعليق جديد",
    });
    syncCommentDeleted(queryClient, 1, 99);

    const feed = queryClient.getQueryData<PostsFeedData>(FEED_KEY);

    expect(feed?.pages[0].data[0].id).toBe(1);
    expect(feed?.pages[0].data[0].comments[0].id).toBe(5);
    expect(queryClient.getQueryData<PostResponse>(
      POSTS_QUERY_KEY.details(1),
    )?.data.comments[0].id).toBe(5);
  });
});
