import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@/features/notifications/services/notificationApi", () => ({
  getNotificationsApi: vi.fn(),
  getUnreadNotificationsCountApi: vi.fn(),
  markNotificationAsReadApi: vi.fn().mockResolvedValue({ success: true }),
  markAllNotificationsAsReadApi: vi.fn().mockResolvedValue({ success: true }),
  deleteNotificationApi: vi.fn().mockResolvedValue({ success: true }),
}));

import NotificationBell from "../components/NotificationBell";
import {
  deleteNotificationApi,
  getNotificationsApi,
  getUnreadNotificationsCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "../services/notificationApi";
import type {
  NotificationDto,
  NotificationsListResponse,
  UnreadNotificationsCountResponse,
} from "../types/notification.types";

const mockGetList = getNotificationsApi as ReturnType<typeof vi.fn>;
const mockGetCount = getUnreadNotificationsCountApi as ReturnType<typeof vi.fn>;

const notification = (
  id: string,
  overrides: Partial<NotificationDto> = {},
): NotificationDto => ({
  id,
  title: `Title ${id}`,
  message: `Message ${id}`,
  type: "Lesson",
  isRead: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const listResponse = (
  data: NotificationDto[],
): NotificationsListResponse => ({
  success: true,
  message: "",
  data,
  pagination: { pageIndex: 0, pageSize: 10, totalCount: data.length, totalPages: 1 },
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

const openPanel = async () => {
  await userEvent.click(screen.getByRole("button", { name: "الإشعارات" }));
  const panel = await screen.findByRole("dialog", { name: "الإشعارات" });
  return panel;
};

describe("NotificationBell / NotificationPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the unread count badge and hides it when there are no unread items", async () => {
    mockGetList.mockResolvedValue(listResponse([notification("n1", { isRead: true })]));
    mockGetCount.mockResolvedValue({
      success: true,
      message: "",
      data: 0,
    } satisfies UnreadNotificationsCountResponse);

    const { unmount } = render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    await waitFor(() => expect(mockGetCount).toHaveBeenCalled());

    expect(screen.queryByText("1")).toBeNull();
    unmount();

    mockGetCount.mockResolvedValue({ success: true, data: 2 });
    const second = render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    await waitFor(() => expect(screen.getByText("2")).toBeInTheDocument());
    second.unmount();
  });

  it("displays 99+ for large counts", async () => {
    mockGetList.mockResolvedValue(listResponse([]));
    mockGetCount.mockResolvedValue({ success: true, data: 150 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });

    await waitFor(() => expect(screen.getByText("99+")).toBeInTheDocument());
  });

  it("renders notifications inside the panel", async () => {
    mockGetList.mockResolvedValue(
      listResponse([notification("n1"), notification("n2", { isRead: true })]),
    );
    mockGetCount.mockResolvedValue({ success: true, data: 1 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    expect(within(panel).getByText("Title n1")).toBeInTheDocument();
    expect(within(panel).getByText("Title n2")).toBeInTheDocument();
  });

  it("shows an empty state when there are no notifications", async () => {
    mockGetList.mockResolvedValue(listResponse([]));
    mockGetCount.mockResolvedValue({ success: true, data: 0 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    expect(within(panel).getByText("لا توجد إشعارات")).toBeInTheDocument();
  });

  it("shows an error state when the list request fails", async () => {
    mockGetList.mockRejectedValue(new Error("boom"));
    mockGetCount.mockResolvedValue({ success: true, data: 0 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    expect(
      within(panel).getByText("تعذر تحميل الإشعارات. حاول مرة أخرى."),
    ).toBeInTheDocument();
  });

  it("marks a single notification as read when tapped", async () => {
    mockGetList.mockResolvedValue(listResponse([notification("n1")]));
    mockGetCount.mockResolvedValue({ success: true, data: 1 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    await userEvent.click(within(panel).getByText("Title n1"));

    await waitFor(() =>
      expect(markNotificationAsReadApi).toHaveBeenCalledWith({ id: "n1" }),
    );
  });

  it("marks all notifications as read", async () => {
    mockGetList.mockResolvedValue(listResponse([notification("n1")]));
    mockGetCount.mockResolvedValue({ success: true, data: 1 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    await userEvent.click(
      within(panel).getByRole("button", { name: "تحديد الكل كمقروء" }),
    );

    await waitFor(() => expect(markAllNotificationsAsReadApi).toHaveBeenCalled());
  });

  it("deletes a notification", async () => {
    mockGetList.mockResolvedValue(listResponse([notification("n1")]));
    mockGetCount.mockResolvedValue({ success: true, data: 1 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    await userEvent.click(
      within(panel).getByRole("button", { name: "حذف الإشعار" }),
    );

    await waitFor(() =>
      expect(deleteNotificationApi).toHaveBeenCalledWith({ id: "n1" }),
    );
  });

  it("does not show mark-all-read when everything is already read", async () => {
    mockGetList.mockResolvedValue(
      listResponse([notification("n1", { isRead: true }), notification("n2", { isRead: true })]),
    );
    mockGetCount.mockResolvedValue({ success: true, data: 0 });

    render(<NotificationBell />, { wrapper: createWrapper().wrapper });
    const panel = await openPanel();

    expect(
      within(panel).queryByRole("button", { name: "تحديد الكل كمقروء" }),
    ).toBeNull();
  });
});
