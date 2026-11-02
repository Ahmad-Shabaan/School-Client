import type { InfiniteData } from "@tanstack/react-query";
import type {
  ChatMessageDto,
  ChatMessagesListResponse,
  ConversationDto,
  ConversationsListResponse,
} from "../types/chat.types";

export type ChatMessagesData = InfiniteData<ChatMessagesListResponse, number>;

export type ConversationsData = InfiniteData<ConversationsListResponse, number>;

/**
 * Message pages are ordered newest-block first (page 0 holds the latest
 * window); within each block messages are ordered oldest → newest as
 * returned by the backend. Chronological order across the whole history is
 * therefore: last page block first, then previous blocks.
 */
export const flattenChatMessages = (
  feed: ChatMessagesData | undefined,
): ChatMessageDto[] => {
  if (!feed) return [];

  const seen = new Set<number>();
  const messages: ChatMessageDto[] = [];

  for (const page of [...feed.pages].reverse()) {
    for (const message of page.data) {
      if (seen.has(message.id)) continue;
      seen.add(message.id);
      messages.push(message);
    }
  }

  return messages;
};

export const appendMessageToCache = (
  feed: ChatMessagesData | undefined,
  message: ChatMessageDto,
): ChatMessagesData | undefined => {
  if (!feed || feed.pages.length === 0) return feed;

  const newestPage = feed.pages[0];

  if (
    newestPage.data.some((cached) => cached.id === message.id) ||
    flattenChatMessages(feed).some((cached) => cached.id === message.id)
  ) {
    return feed;
  }

  const pages = [
    { ...newestPage, data: [...newestPage.data, message] },
    ...feed.pages.slice(1),
  ];

  // The pagination metadata is left untouched on purpose: it comes from the
  // server and is refreshed on the next fetch. Inflating it locally would
  // make the pagination request one empty page too many.
  return { ...feed, pages };
};

export const readMessagesChanged = (
  feed: ChatMessagesData | undefined,
  updatedAt: (message: ChatMessageDto) => ChatMessageDto,
): ChatMessagesData | undefined => {
  if (!feed) return feed;

  let feedChanged = false;

  const pages = feed.pages.map((page) => {
    let pageChanged = false;

    const data = page.data.map((message) => {
      const next = updatedAt(message);
      if (next === message) return message;
      pageChanged = true;
      return next;
    });

    if (!pageChanged) return page;

    feedChanged = true;
    return { ...page, data };
  });

  return feedChanged ? { ...feed, pages } : feed;
};

export const markMessagesRead = (
  feed: ChatMessagesData | undefined,
  filter: (message: ChatMessageDto) => boolean,
  readAtUtc: string,
): ChatMessagesData | undefined =>
  readMessagesChanged(feed, (message) => {
    if (!filter(message)) return message;
    if (message.readAt != null) return message;

      return { ...message, readAt: readAtUtc };
    });

export type ConversationUpdater = (conversation: ConversationDto) => ConversationDto;

export const updateConversations = (
  feed: ConversationsData | undefined,
  updater: ConversationUpdater,
): ConversationsData | undefined => {
  if (!feed) return feed;

  let feedChanged = false;

  const pages = feed.pages.map((page) => {
    let pageChanged = false;

    const data = page.data.map((conversation) => {
      const next = updater(conversation);
      if (next === conversation) return conversation;
      pageChanged = true;
      return next;
    });

    if (!pageChanged) return page;

    feedChanged = true;
    return { ...page, data };
  });

  return feedChanged ? { ...feed, pages } : feed;
};

export const sortConversationsByLastActivity = (
  feed: ConversationsData,
): ConversationsData => {
  const toTime = (conversation: ConversationDto) =>
    new Date(conversation.lastMessageAt ?? conversation.createdAt).getTime();

  const sortedPages = feed.pages.map((page) => ({
    ...page,
    data: [...page.data].sort((previous, next) => toTime(next) - toTime(previous)),
  }));

  return { ...feed, pages: sortedPages };
};
