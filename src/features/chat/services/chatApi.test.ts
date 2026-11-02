import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/shared/api/axiosClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import axiosClient from "@/shared/api/axiosClient";
import {
  getMyConversationApi,
  getMyMessagesApi,
  sendStudentMessageApi,
  getMyUnreadCountApi,
  markMyMessagesAsReadApi,
  getConversationsApi,
  getAdminConversationApi,
  getAdminConversationMessagesApi,
  sendAdminMessageApi,
  markConversationMessagesAsReadApi,
} from "./chatService";

const mockGet = axiosClient.get as unknown as Mock;
const mockPost = axiosClient.post as unknown as Mock;

beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
});

describe("chatApi", () => {
  it("fetches the student conversation", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: {} } });

    await getMyConversationApi();

    expect(mockGet).toHaveBeenCalledWith("/chat/my-conversation");
  });

  it("fetches student messages with paging parameters", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getMyMessagesApi(2, 10);

    expect(mockGet).toHaveBeenCalledWith("/chat/my-messages", {
      params: { pageIndex: 2, pageSize: 10 },
    });
  });

  it("uses the default message page size", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getMyMessagesApi(0);

    expect(mockGet).toHaveBeenCalledWith("/chat/my-messages", {
      params: { pageIndex: 0, pageSize: 20 },
    });
  });

  it("sends a student message", async () => {
    mockPost.mockResolvedValue({ data: { success: true, data: {} } });

    await sendStudentMessageApi("Hello");

    expect(mockPost).toHaveBeenCalledWith("/chat/messages", { content: "Hello" });
  });

  it("fetches the student unread count", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: 3 } });

    const result = await getMyUnreadCountApi();

    expect(mockGet).toHaveBeenCalledWith("/chat/my-unread-count");
    expect(result.data).toBe(3);
  });

  it("marks student messages as read", async () => {
    mockPost.mockResolvedValue({ data: { success: true } });

    await markMyMessagesAsReadApi();

    expect(mockPost).toHaveBeenCalledWith("/chat/mark-as-read");
  });

  it("fetches admin conversations with paging parameters", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getConversationsApi(1, 10);

    expect(mockGet).toHaveBeenCalledWith("/admin/chat", {
      params: { pageIndex: 1, pageSize: 10 },
    });
  });

  it("uses the default conversation page size", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getConversationsApi(0);

    expect(mockGet).toHaveBeenCalledWith("/admin/chat", {
      params: { pageIndex: 0, pageSize: 20 },
    });
  });

  it("fetches an admin conversation by id", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: {} } });

    await getAdminConversationApi(7);

    expect(mockGet).toHaveBeenCalledWith("/admin/chat/conversations/7");
  });

  it("fetches admin conversation messages with paging parameters", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getAdminConversationMessagesApi(7, 2, 15);

    expect(mockGet).toHaveBeenCalledWith(
      "/admin/chat/conversations/7/messages",
      { params: { pageIndex: 2, pageSize: 15 } },
    );
  });

  it("sends an admin message", async () => {
    mockPost.mockResolvedValue({ data: { success: true, data: {} } });

    await sendAdminMessageApi(7, "Reply");

    expect(mockPost).toHaveBeenCalledWith("/admin/chat/messages", {
      conversationId: 7,
      content: "Reply",
    });
  });

  it("marks admin conversation messages as read", async () => {
    mockPost.mockResolvedValue({ data: { success: true } });

    await markConversationMessagesAsReadApi(7);

    expect(mockPost).toHaveBeenCalledWith(
      "/admin/chat/conversations/7/mark-as-read",
    );
  });
});
