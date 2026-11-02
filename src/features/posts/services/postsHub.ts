import {
  type HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { config } from "@/config/env";
import { store } from "@/store/store";
import {
  POSTS_HUB_PATH,
  POST_COMMENT_ADDED_EVENT,
  POST_COMMENT_DELETED_EVENT,
  POST_COMMENT_UPDATED_EVENT,
  POST_CREATED_EVENT,
  POST_DELETED_EVENT,
  POST_UPDATED_EVENT,
} from "../constants/posts.constants";
import type { CommentDto, PostDto } from "../types/post.types";

type PostCreatedListener = (post: PostDto) => void;
type PostDeletedPayload = {
  id: number;
  courseId: number;
};
type CommentDeletedPayload = {
  id: number;
  courseId: number;
  postId: number;
  parentCommentId: number | null;
};

type CommentAddedListener = (comment: CommentDto) => void;
type ReconnectedListener = () => void;

const postCreatedListeners = new Set<PostCreatedListener>();
const commentAddedListeners = new Set<CommentAddedListener>();
const reconnectedListeners = new Set<ReconnectedListener>();

type PostUpdatedListener = (post: PostDto) => void;
type PostDeletedListener = (payload: PostDeletedPayload) => void;
type CommentUpdatedListener = (comment: CommentDto) => void;
type CommentDeletedListener = (payload: CommentDeletedPayload) => void;

const postUpdatedListeners = new Set<PostUpdatedListener>();
const postDeletedListeners = new Set<PostDeletedListener>();
const commentUpdatedListeners = new Set<CommentUpdatedListener>();
const commentDeletedListeners = new Set<CommentDeletedListener>();

let connection: HubConnection | null = null;
let connectedUserId: string | null = null;

const hubUrl = () =>
  `${config.apiUrl.replace(/\/api\/?$/, "")}${POSTS_HUB_PATH}`;

const isCommentPayload = (payload: unknown): payload is CommentDto => {
  if (typeof payload !== "object" || payload === null) return false;

  const comment = payload as CommentDto;
  return (
    typeof comment.id === "number" &&
    typeof comment.postId === "number" &&
    typeof comment.authorId === "string" &&
    typeof comment.authorName === "string" &&
    typeof comment.content === "string" &&
    typeof comment.createdAt === "string" &&
    Array.isArray(comment.replies)
  );
};

const isPostPayload = (payload: unknown): payload is PostDto => {
  if (typeof payload !== "object" || payload === null) return false;

  const post = payload as PostDto;
  return (
    typeof post.id === "number" &&
    typeof post.courseId === "number" &&
    typeof post.authorId === "string" &&
    typeof post.authorName === "string" &&
    typeof post.content === "string" &&
    typeof post.createdAt === "string" &&
    Array.isArray(post.comments)
  );
};

const isPostDeletedPayload = (payload: unknown): payload is PostDeletedPayload => {
  if (typeof payload !== "object" || payload === null) return false;

  const post = payload as PostDeletedPayload;
  return (
    typeof post.id === "number" &&
    typeof post.courseId === "number"
  );
};

const isCommentDeletedPayload = (
  payload: unknown,
): payload is CommentDeletedPayload => {
  if (typeof payload !== "object" || payload === null) return false;

  const comment = payload as CommentDeletedPayload;
  return (
    typeof comment.id === "number" &&
    typeof comment.courseId === "number" &&
    typeof comment.postId === "number" &&
    (comment.parentCommentId === null ||
      typeof comment.parentCommentId === "number")
  );
};

export const onPostCreated = (listener: PostCreatedListener): (() => void) => {
  postCreatedListeners.add(listener);
  return () => postCreatedListeners.delete(listener);
};

export const onPostUpdated = (listener: PostUpdatedListener): (() => void) => {
  postUpdatedListeners.add(listener);
  return () => postUpdatedListeners.delete(listener);
};

export const onPostDeleted = (listener: PostDeletedListener): (() => void) => {
  postDeletedListeners.add(listener);
  return () => postDeletedListeners.delete(listener);
};

export const onPostCommentAdded = (
  listener: CommentAddedListener,
): (() => void) => {
  commentAddedListeners.add(listener);
  return () => commentAddedListeners.delete(listener);
};

export const onPostCommentUpdated = (
  listener: CommentUpdatedListener,
): (() => void) => {
  commentUpdatedListeners.add(listener);
  return () => commentUpdatedListeners.delete(listener);
};

export const onPostCommentDeleted = (
  listener: CommentDeletedListener,
): (() => void) => {
  commentDeletedListeners.add(listener);
  return () => commentDeletedListeners.delete(listener);
};

export const onPostsReconnected = (
  listener: ReconnectedListener,
): (() => void) => {
  reconnectedListeners.add(listener);
  return () => reconnectedListeners.delete(listener);
};

export async function ensurePostsConnection(userId: string): Promise<void> {
  if (
    connection &&
    connectedUserId === userId &&
    connection.state !== HubConnectionState.Disconnected
  ) {
    return;
  }

  if (connection) {
    const stale = connection;
    connection = null;
    connectedUserId = null;
    await stale.stop().catch(() => undefined);
  }

  const built = new HubConnectionBuilder()
    .withUrl(hubUrl(), {
      accessTokenFactory: () => store.getState().auth.accessToken ?? "",
    })
    .withAutomaticReconnect()
    .build();

  built.on(POST_CREATED_EVENT, (payload: unknown) => {
    if (!isPostPayload(payload)) return;
    postCreatedListeners.forEach((listener) => listener(payload));
  });

  built.on(POST_UPDATED_EVENT, (payload: unknown) => {
    if (!isPostPayload(payload)) return;
    postUpdatedListeners.forEach((listener) => listener(payload));
  });

  built.on(POST_DELETED_EVENT, (payload: unknown) => {
    if (!isPostDeletedPayload(payload)) return;
    postDeletedListeners.forEach((listener) => listener(payload));
  });

  built.on(POST_COMMENT_ADDED_EVENT, (payload: unknown) => {
    if (!isCommentPayload(payload)) return;
    commentAddedListeners.forEach((listener) => listener(payload));
  });

  built.on(POST_COMMENT_UPDATED_EVENT, (payload: unknown) => {
    if (!isCommentPayload(payload)) return;
    commentUpdatedListeners.forEach((listener) => listener(payload));
  });

  built.on(POST_COMMENT_DELETED_EVENT, (payload: unknown) => {
    if (!isCommentDeletedPayload(payload)) return;
    commentDeletedListeners.forEach((listener) => listener(payload));
  });

  built.onreconnected(() => reconnectedListeners.forEach((listener) => listener()));

  built.onclose(() => {
    if (connection === built) {
      connection = null;
      connectedUserId = null;
    }
  });

  connection = built;
  connectedUserId = userId;

  try {
    await built.start();

    if (connection !== built) {
      await built.stop().catch(() => undefined);
    }
  } catch {
    if (connection === built) {
      connection = null;
      connectedUserId = null;
    }
  }
}

export function stopPostsConnection(): void {
  const active = connection;
  connection = null;
  connectedUserId = null;

  if (active && active.state !== HubConnectionState.Disconnected) {
    active.stop().catch(() => undefined);
  }
}
