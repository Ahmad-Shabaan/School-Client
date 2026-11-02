import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LessonWatermark from "./LessonWatermark";

const WATERMARK = {
  displayName: "أحمد شعبان",
  studentId: "9f8a1f4f-5b2e-4a3c-9a06-71ddf33e9ac1",
  maskedEmail: "a***@example.com",
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("LessonWatermark", () => {
  it("renders the student identity from the API", () => {
    render(<LessonWatermark watermark={WATERMARK} />);

    expect(screen.getByText("أحمد شعبان")).toBeTruthy();
    expect(
      screen.getByText("Student ID: 9f8a1f4f-5b2e-4a3c-9a06-71ddf33e9ac1"),
    ).toBeTruthy();
    expect(screen.getByText("a***@example.com")).toBeTruthy();
  });

  it("ignores pointer events so video interactions keep working", () => {
    const { container } = render(<LessonWatermark watermark={WATERMARK} />);

    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay.className).toContain("pointer-events-none");
  });

  it("moves between controlled positions periodically", () => {
    const { container } = render(<LessonWatermark watermark={WATERMARK} />);

    const overlay = container.firstElementChild as HTMLElement;
    const initialStyle = overlay.style.cssText;

    act(() => {
      vi.advanceTimersByTime(12_500);
    });
    expect(overlay.style.cssText).not.toBe(initialStyle);

    const secondStyle = overlay.style.cssText;

    act(() => {
      vi.advanceTimersByTime(12_000);
    });
    expect(overlay.style.cssText).not.toBe(secondStyle);

    act(() => {
      vi.advanceTimersByTime(24_000);
    });

    const fullCycleStyle = overlay.style.cssText;
    expect(fullCycleStyle.length).toBeGreaterThan(0);
  });

  it("clears the position timer on unmount", () => {
    const { unmount } = render(<LessonWatermark watermark={WATERMARK} />);

    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
