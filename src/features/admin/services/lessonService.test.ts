import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/shared/api/axiosClient", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

import axiosClient from "@/shared/api/axiosClient";
import { getLessonWatermark } from "./lessonService";

const mockGet = axiosClient.get as unknown as Mock;

beforeEach(() => {
  mockGet.mockReset();
});

describe("lessonService watermark", () => {
  it("fetches the lesson watermark from the watermark endpoint", async () => {
    const watermark = {
      displayName: "أحمد شعبان",
      studentId: "9f8a1f4f-5b2e-4a3c-9a06-71ddf33e9ac1",
      maskedEmail: "a***@example.com",
    };

    mockGet.mockResolvedValue({
      data: { success: true, message: "", data: watermark },
    });

    const result = await getLessonWatermark(12);

    expect(mockGet).toHaveBeenCalledWith("/lessons/12/watermark");
    expect(result.success).toBe(true);
    expect(result.data).toEqual(watermark);
  });
});
