export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const START_SCROLL_TRIGGER: string = "top 65%";

type MotionConfig = {
  start?: string;
  /** Stagger between each item in seconds. Default: 0.12 */
  stagger?: number;
  /** Animation duration. Default: 0.8 */
  duration?: number;
  /** GSAP ease. Default: "power3.out" */
  ease?: string;

  delay?: number;

  y?: number;
  opacity?: number;
  x?: number;
};

// my code
const createMovingUp = (config?: MotionConfig) => {
  return {
    y: config?.y ?? 30,
    opacity: config?.opacity ?? 0,
    duration: config?.duration ?? 0.9,
    stagger: config?.stagger ?? 0.015,
    ease: config?.ease ?? "power3.out",
  };
};

const createMovingLeft = (config?: MotionConfig) => ({
  x: config?.x ?? 40,
  opacity: config?.opacity ?? 0,
  duration: config?.duration ?? 0.9,
  stagger: config?.stagger ?? 0.015,
  ease: config?.ease ?? "power3.out",
});

const createMovingRight = (config?: MotionConfig) => ({
  x: config?.x ?? -40,
  opacity: config?.opacity ?? 0,
  duration: config?.duration ?? 0.9,
  stagger: config?.stagger ?? 0.015,
  ease: config?.ease ?? "power3.out",
});

const createFade = (config?: MotionConfig) => ({
  opacity: config?.opacity ?? 0,
  duration: config?.duration ?? 0.9,
  stagger: config?.stagger ?? 0.015,
  ease: config?.ease ?? "power2.out",
});

export const motion = {
  // 🟢 Base preset (default UI)
  movingUp: createMovingUp({
    y: 30,
    duration: 0.9,
    stagger: 0.015,
  }),

  // 🟡 Small UI elements (buttons, icons, small text)
  movingUpSoft: createMovingUp({
    y: 12,
    duration: 0.45,
    stagger: 0.01,
    ease: "power2.out",
  }),

  // 🔵 Medium sections (cards, lists)
  movingUpStrong: createMovingUp({
    y: 60,
    duration: 1,
    stagger: 0.02,
  }),

  // 🔥 Hero / cinematic sections
  movingUpCinematic: createMovingUp({
    y: 100,
    duration: 1.2,
    stagger: 0.03,
    ease: "expo.out",
  }),

  // ⬅️ LEFT
  movingLeft: createMovingLeft({
    x: 40,
    duration: 0.9,
  }),

  // ➡️ RIGHT
  movingRight: createMovingRight({
    x: -40,
    duration: 0.9,
  }),

  // 🌫 FADE
  fade: createFade({
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  }),

  fadeSoft: createFade({
    opacity: 0,
    duration: 0.4,
    ease: "power1.out",
  }),
};
