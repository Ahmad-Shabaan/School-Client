import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { SectionAnimationParams } from "../types/common.types";
import { prefersReducedMotion } from "@/lib/utils/motion";

export function useCardsAnimation({
  sectionRef,
  dependencies,
}: SectionAnimationParams) {
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(sectionRef.current);
      gsap.fromTo(
        q("article"),
        { opacity: 0, scale: 0.95 }, // x: 28
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: { amount: 0.25, from: "start" },
          clearProps: "transform,opacity",
        },
      );
    },
    { dependencies },
  );
}
