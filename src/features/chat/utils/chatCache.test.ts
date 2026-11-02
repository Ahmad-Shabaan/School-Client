import { describe, expect, it } from "vitest";
import type {
  ChatMessageDto,
  ChatMessagesListResponse,
  ConversationDto,
  ConversationsListResponse,
} from "../types/chat.types";
import {
  appendMessageToCache,
  flattenChatMessages,
  markMessagesRead,
  sortConversationsByLastActivity,
  updateConversations,
  type ChatMessagesData,
  type ConversationsData,
} from "./chatCache";

const message = (overrides: Partial<ChatMessageDto> = {}): ChatMessageDto => ({
  id: 1,
  conversationId: 10,
  senderId: "student-1",
  senderName: "Student One",
  content: "Hello",
  createdAt: "2026-01-01T10:00:00Z",
  readAt: null,
  ...overrides,
});

const messagesPage = (
  items: ChatMessageDto[],
  pageIndex = 0,
): ChatMessagesListResponse => ({
  success: true,
  message: "ok",
  data: items,
  pagination: {
    pageIndex,
    pageSize: 20,
    totalCount: items.length,
    totalPages: 1,
  },
});

const messagesFeed = (
  ...pages: ChatMessagesListResponse[]
): ChatMessagesData => ({
  pages,
  pageParams: pages.map((_, index) => index),
});

const conversation = (
  overrides: Partial<ConversationDto> = {},
): ConversationDto => ({
  id: 1,
  studentId: "student-1",
  studentName: "Student One",
  lastMessage: "Hi",
  lastMessageAt: "2026-01-01T10:00:00Z",
  unreadCount: 0,
  createdAt: "2026-01-01T09:00:00Z",
  ...overrides,
});

const conversationsPage = (
  items: ConversationDto[],
  pageIndex = 0,
): ConversationsListResponse => ({
  success: true,
  message: "ok",
  data: items,
  pagination: {
    pageIndex,
    pageSize: 20,
    totalCount: items.length,
    totalPages: 1,
  },
});

const conversationsFeed = (
  ...pages: ConversationsListResponse[]
): ConversationsData => ({
  pages,
  pageParams: pages.map((_, index) => index),
});

describe("chatCache", () => {
  describe("flattenChatMessages", () => {
    it("returns empty array when there is no data", () => {
      expect(flattenChatMessages(undefined)).toEqual([]);
    });

    it("flattens pages newest-block first into chronological order", () => {
      const newest = messagesPage([
        message({ id: 2, createdAt: "2026-01-01T10:01:00Z" }),
        message({ id: 3, createdAt: "2026-01-01T10:02:00Z" }),
      ]);
      const older = messagesPage([
        message({ id: 1, createdAt: "2026-01-01T10:00:00Z" }),
      ]);

      const result = flattenChatMessages(messagesFeed(newest, older));

      expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    it("deduplicates messages across pages", () => {
      const duplicated = message({ id: 5 });

      const result = flattenChatMessages(
        messagesFeed(
          messagesPage([duplicated]),
          messagesPage([duplicated, message({ id: 6 })]),
        ),
      );

      expect(result.map((item) => item.id)).toEqual([5, 6]);
    });
  });

  describe("appendMessageToCache", () => {
    it("appends a new message to the newest page", () => {
      const feed = messagesFeed(messagesPage([message({ id: 1 })]));
      const incoming = message({ id: 2 });

      const next = appendMessageToCache(feed, incoming);

      expect(next?.pages[0].data.map((item) => item.id)).toEqual([1, 2]);
    });

    it("keeps the server pagination metadata untouched", () => {
      const feed = messagesFeed(messagesPage([message({ id: 1 })]));

      const next = appendMessageToCache(feed, message({ id: 2 }));

      expect(next?.pages[0].pagination?.totalCount).toBe(1);
    });

    it("does not duplicate an existing message", () => {
      const existing = message({ id: 1 });
      const feed = messagesFeed(messagesPage([existing]));

      const next = appendMessageToCache(feed, existing);

      expect(next?.pages[0].data.length).toBe(1);
      expect(next?.pages[0].pagination?.totalCount).toBe(1);
    });
    it("returns the same feed when there are no pages", () => {
      const feed = messagesFeed();

      expect(appendMessageToCache(feed, message())).toBe(feed);
    });
  });

  describe("markMessagesRead", () => {
    it("sets readAt on matching messages only", () => {
      const feed = messagesFeed(
        messagesPage([
          message({ id: 1, senderId: "student-1", readAt: null }),
          message({ id: 2, senderId: "admin-1", readAt: null }),
          message({
            id: 3,
            senderId: "student-1",
            readAt: "2026-01-01T11:00:00Z",
          }),
        ]),
      );

      const next = markMessagesRead(
        feed,
        (item) => item.senderId === "student-1",
        "2026-01-01T12:00:00Z",
      );

      const ids = next?.pages[0].data.map((item) => [item.id, item.readAt]);
      expect(ids).toEqual([
        [1, "2026-01-01T12:00:00Z"],
        [2, null],
        [3, "2026-01-01T11:00:00Z"],
      ]);
    });

    it("returns the same feed when nothing changes", () => {
      const feed = messagesFeed(
        messagesPage([message({ readAt: "2026-01-01T11:00:00Z" })]),
      );

      const next = markMessagesRead(
        feed,
        () => true,
        "2026-01-01T12:00:00Z",
      );

      expect(next).toBe(feed);
    });
  });

  describe("updateConversations", () => {
    it("updates the matching conversation", () => {
      const feed = conversationsFeed(
        conversationsPage([
          conversation({ id: 1, unreadCount: 2 }),
          conversation({ id: 2 }),
        ]),
      );

      const next = updateConversations(feed, (item) =>
        item.id === 1 ? { ...item, unreadCount: 0 } : item,
      );

      expect(next?.pages[0].data.map((item) => [item.id, item.unreadCount])).toEqual([
        [1, 0],
        [2, 0],
      ]);
    });

    it("returns the same feed when nothing changes", () => {
      const feed = conversationsFeed(conversationsPage([conversation()]));

      const next = updateConversations(feed, (item) => item);

      expect(next).toBe(feed);
    });
  });

  describe("sortConversationsByLastActivity", () => {
    it("sorts conversations by last activity descending", () => {
      const feed = conversationsFeed(
        conversationsPage([
          conversation({ id: 1, lastMessageAt: "2026-01-01T10:00:00Z" }),
          conversation({ id: 2, lastMessageAt: "2026-01-01T12:00:00Z" }),
        ]),
      );

      const next = sortConversationsByLastActivity(feed);

      expect(next.pages[0].data.map((item) => item.id)).toEqual([2, 1]);
    });
  });
});
