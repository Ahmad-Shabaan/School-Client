import { beforeEach, describe, expect, it, vi } from "vitest";

const hubMock = vi.hoisted(() => {
  const handlers = new Map<string, (...args: unknown[]) => void>();

  const connection = {
    state: "Disconnected",
    on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      handlers.set(event, handler);
      return connection;
    }),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
    start: vi.fn(async () => {
      connection.state = "Connected";
    }),
    stop: vi.fn(async () => {
      connection.state = "Disconnected";
    }),
  };

  const builder = {
    withUrl: vi.fn(() => builder),
    withAutomaticReconnect: vi.fn(() => builder),
    build: vi.fn(() => connection),
  };

  return { handlers, connection, builder };
});

vi.mock("@microsoft/signalr", () => ({
  HubConnectionBuilder: vi.fn(function HubConnectionBuilderMock() {
    return hubMock.builder;
  }),
  HubConnectionState: {
    Disconnected: "Disconnected",
    Connected: "Connected",
  },
}));

import {
  ensureChatConnection,
  onMessageSent,
  onMessagesRead,
  stopChatConnection,
} from "./chatHub";
import type { ChatMessageDto } from "../types/chat.types";

const validMessage: ChatMessageDto = {
  id: 11,
  conversationId: 7,
  senderId: "admin-1",
  senderName: "Admin",
  content: "Hello",
  createdAt: "2026-01-01T10:00:00Z",
  readAt: null,
};

const emit = (event: string, ...args: unknown[]) => {
  const handler = hubMock.handlers.get(event);
  if (!handler) throw new Error(`No handler registered for ${event}`);
  handler(...args);
};

beforeEach(() => {
  stopChatConnection();
  hubMock.handlers.clear();
  hubMock.builder.build.mockClear();
  hubMock.builder.withUrl.mockClear();
  hubMock.builder.withAutomaticReconnect.mockClear();
  hubMock.connection.on.mockClear();
  hubMock.connection.start.mockClear();
  hubMock.connection.stop.mockClear();
  hubMock.connection.state = "Disconnected";
});

describe("chatHub", () => {
  it("connects to the chat hub path with automatic reconnect", async () => {
    await ensureChatConnection("student-1");

    expect(hubMock.builder.withUrl).toHaveBeenCalledWith(
      "https://localhost:7000/hubs/chat",
      expect.objectContaining({ accessTokenFactory: expect.any(Function) }),
    );
    expect(hubMock.builder.withAutomaticReconnect).toHaveBeenCalled();
    expect(hubMock.connection.start).toHaveBeenCalledTimes(1);
  });

  it("reuses a single connection for the same authenticated user", async () => {
    await ensureChatConnection("student-1");
    await ensureChatConnection("student-1");

    expect(hubMock.builder.build).toHaveBeenCalledTimes(1);
    expect(hubMock.connection.start).toHaveBeenCalledTimes(1);
  });

  it("rebuilds the connection when the authenticated user changes", async () => {
    await ensureChatConnection("student-1");
    await ensureChatConnection("admin-1");

    expect(hubMock.builder.build).toHaveBeenCalledTimes(2);
    expect(hubMock.connection.stop).toHaveBeenCalledTimes(1);
  });

  it("forwards valid MessageSent payloads to listeners", async () => {
    await ensureChatConnection("student-1");

    const listener = vi.fn();
    const unsubscribe = onMessageSent(listener);

    emit("MessageSent", validMessage);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(validMessage);

    unsubscribe();
    emit("MessageSent", validMessage);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("ignores malformed MessageSent payloads", async () => {
    await ensureChatConnection("student-1");

    const listener = vi.fn();
    const unsubscribe = onMessageSent(listener);

    emit("MessageSent", { id: "11", conversationId: 7 });
    emit("MessageSent", null);

    expect(listener).not.toHaveBeenCalled();

    unsubscribe();
  });

  it("maps the positional MessagesRead payload sent by the backend", async () => {
    await ensureChatConnection("student-1");

    const listener = vi.fn();
    const unsubscribe = onMessagesRead(listener);

    emit("MessagesRead", 7, "student-1", "2026-01-01T11:00:00Z");

    expect(listener).toHaveBeenCalledWith({
      conversationId: 7,
      readerId: "student-1",
      readAtUtc: "2026-01-01T11:00:00Z",
    });

    unsubscribe();
  });

  it("ignores malformed MessagesRead payloads", async () => {
    await ensureChatConnection("student-1");

    const listener = vi.fn();
    const unsubscribe = onMessagesRead(listener);

    emit("MessagesRead", "7", "student-1", "2026-01-01T11:00:00Z");
    emit("MessagesRead", 7, "student-1");

    expect(listener).not.toHaveBeenCalled();

    unsubscribe();
  });

  it("stops the connection on demand", async () => {
    await ensureChatConnection("student-1");

    stopChatConnection();

    expect(hubMock.connection.stop).toHaveBeenCalledTimes(1);
  });
});
