import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap.config";

import type React from "react";
import { prefersReducedMotion } from "@/lib/utils/motion";

type AnimationProps = {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  dependencies?: unknown[]; // allow passing dependencies to re-run animation on updates (e.g. when books data changes)
};


export function useLoginFormAnimation({ sectionRef }: AnimationProps) {
  useGSAP(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(sectionRef.current);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        q("[data-animate='orb']"),
        { opacity: 0, scale: 0.35 },
        {
          opacity: 0.65,
          scale: 1,
          duration: 0.4,
          stagger: 0.18,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      )
        // .fromTo(
        //   q("[data-animate='brand']"),
        //   { opacity: 0, x: -36 },
        //   {
        //     opacity: 1,
        //     x: 0,
        //     duration: 0.7,
        //     ease: "power3.out",
        //     clearProps: "transform,opacity",
        //   },
        //   "-=0.55",
        // )
        // .fromTo(
        //   q("[data-animate='header'] > *"),
        //   { opacity: 0, y: 22 },
        //   {
        //     opacity: 1,
        //     y: 0,
        //     duration: 0.65,
        //     stagger: 0.12,
        //     ease: "power2.out",
        //     clearProps: "transform,opacity",
        //   },
        //   "-=0.4",
        // )
        .fromTo(
          q("[data-animate='form'] > *"),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.35",
        );
      return () => {
        tl.kill();
      };
    });
    mm.add("(max-width: 1023.98px)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        q("[data-animate='brand-mobile']"),
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          // clearProps: "transform,opacity",
        },
        "-=0.55",
      )
        // .fromTo(
        //   q("[data-animate='header'] > *"),
        //   { opacity: 0, y: 22 },
        //   {
        //     opacity: 1,
        //     y: 0,
        //     duration: 0.65,
        //     stagger: 0.12,
        //     ease: "power2.out",
        //     // clearProps: "transform,opacity",
        //   },
        //   "-=0.4",
        // )
        .fromTo(
          q("[data-animate='form'] > *"),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            // clearProps: "transform,opacity",
          },
          "-=0.35",
        );
      return () => tl.kill();
    });
    return () => mm.kill();
  });
}
