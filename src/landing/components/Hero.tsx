import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  heroSlides,
  heroTitleBefore,
  heroTitleHighlight,
  slideNextLabel,
  slideOrdinals,
  slidePrevLabel,
} from "@/landing/data/landing";
import { ChevronNextIcon, ChevronPrevIcon } from "./icons";

const AUTO_ADVANCE_MS = 5000;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = heroSlides.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((value) => (value + 1) % total);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  const goTo = (index: number) => {
    setCurrent(((index % total) + total) % total);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--teal-dark)]">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-pattern" aria-hidden="true" />

      <div className="relative landing-container pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5" aria-hidden="true">
            <span className="h-px w-8 bg-linear-to-l from-transparent to-[var(--gold)]/70 sm:w-14" />
            <span className="size-1.5 rounded-full bg-[var(--gold)]" />
            <span className="size-1.5 rounded-full bg-[var(--gold)]" />
            <span className="size-1.5 rounded-full bg-[var(--gold)]" />
            <span className="h-px w-8 bg-linear-to-r from-transparent to-[var(--gold)]/70 sm:w-14" />
          </div>

          <h1 className="landing-title-hero mt-6 font-extrabold tracking-tight text-white">
            {heroTitleBefore} {heroTitleHighlight}
          </h1>
        </div>

        <div
          className="landing-heading-gap relative mx-auto w-full max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative h-[260px] w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.2)] sm:h-[380px] md:h-[430px] lg:h-[470px]">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.src}
                className={cn("slide", index === current && "active")}
                aria-hidden={index !== current}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}

            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(18,61,52,0.3)] via-transparent to-black/5"
              aria-hidden="true"
            />

            <button
              type="button"
              aria-label={slidePrevLabel}
              onClick={() => goTo(current - 1)}
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[rgba(18,61,52,0.78)] text-white backdrop-blur-sm transition-all duration-200 hover:bg-[var(--gold)] hover:text-[var(--teal-dark)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] sm:right-4 sm:size-12"
            >
              <ChevronPrevIcon className="size-4 sm:size-5" />
            </button>

            <button
              type="button"
              aria-label={slideNextLabel}
              onClick={() => goTo(current + 1)}
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[rgba(18,61,52,0.78)] text-white backdrop-blur-sm transition-all duration-200 hover:bg-[var(--gold)] hover:text-[var(--teal-dark)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] sm:left-4 sm:size-12"
            >
              <ChevronNextIcon className="size-4 sm:size-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`الإعلان ${slideOrdinals[index] ?? index + 1}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    "size-2.5 rounded-full border-none transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.8)]",
                    index === current
                      ? "w-7 scale-110 bg-[var(--gold)]"
                      : "bg-white/50 hover:bg-white/80",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;