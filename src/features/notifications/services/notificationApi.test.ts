import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/shared/api/axiosClient", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import axiosClient from "@/shared/api/axiosClient";
import {
  deleteNotificationApi,
  getNotificationsApi,
  getUnreadNotificationsCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "./notificationApi";
import { NOTIFICATIONS_PAGE_SIZE } from "../constants/notification.constants";

const mockGet = axiosClient.get as unknown as Mock;
const mockPut = axiosClient.put as unknown as Mock;
const mockDelete = axiosClient.delete as unknown as Mock;

const ID = "9f8a1f4f-5b2e-4a3c-9a06-71ddf33e9ac1";

beforeEach(() => {
  mockGet.mockReset();
  mockPut.mockReset();
  mockDelete.mockReset();
});

describe("notificationApi", () => {
  it("fetches notifications with paging parameters", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getNotificationsApi(2);

    expect(mockGet).toHaveBeenCalledWith("/notifications", {
      params: { pageIndex: 2, pageSize: NOTIFICATIONS_PAGE_SIZE },
    });
  });

  it("uses the default page size", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });

    await getNotificationsApi(0, 20);

    expect(mockGet).toHaveBeenCalledWith("/notifications", {
      params: { pageIndex: 0, pageSize: 20 },
    });
  });

  it("fetches the unread count", async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: 5 } });

    const result = await getUnreadNotificationsCountApi();

    expect(mockGet).toHaveBeenCalledWith("/notifications/unread-count");
    expect(result.data).toBe(5);
  });

  it("marks a single notification as read", async () => {
    mockPut.mockResolvedValue({ data: { success: true } });

    await markNotificationAsReadApi({ id: ID });

    expect(mockPut).toHaveBeenCalledWith(`/notifications/${ID}/read`);
  });

  it("marks all notifications as read", async () => {
    mockPut.mockResolvedValue({ data: { success: true } });

    await markAllNotificationsAsReadApi();

    expect(mockPut).toHaveBeenCalledWith("/notifications/read-all");
  });

  it("deletes a single notification", async () => {
    mockDelete.mockResolvedValue({ data: { success: true } });

    await deleteNotificationApi({ id: ID });

    expect(mockDelete).toHaveBeenCalledWith(`/notifications/${ID}`);
  });
});
