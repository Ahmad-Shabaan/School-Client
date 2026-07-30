import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { SectionAnimationParams } from "../types/common.types";
import { prefersReducedMotion } from "@/lib/utils/motion";

export function useNotFoundAnimation({
  sectionRef,
  dependencies,
}: SectionAnimationParams) {
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(sectionRef.current);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(q("[data-animate='hero-illustration']"), { y: 50, opacity: 0, scale: 0.9, duration: 1.0 })
        .from(q("[data-animate='hero-title']"), { y: 24, opacity: 0, duration: 0.7 }, "-=0.35")
        .from(q("[data-animate='hero-desc']"), { y: 18, opacity: 0, duration: 0.55 }, "-=0.3")
        .from(
          q("[data-animate='cta-btn']"),
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.25",
        )
        .from(
          q("[data-animate='librarian-tip']"),
          { x: -24, opacity: 0, duration: 0.55 },
          "-=0.2",
        )
        .to(q("[data-animate='hero-illustration']"), {
          y: -12,
          duration: 3.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

      return () => {
        tl.kill();
      };
    },
    {  dependencies },
  );
}
