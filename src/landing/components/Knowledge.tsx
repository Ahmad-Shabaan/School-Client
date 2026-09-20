import {
  knowledgeHeading,
  knowledgeText,
  pillars,
} from "@/landing/data/landing";
import SectionHeading from "./SectionHeading";

const Knowledge = () => (
  <section
    id="knowledge"
    className="landing-section relative scroll-mt-36 overflow-hidden bg-[var(--teal-soft)] sm:scroll-mt-28"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-32 right-0 size-64 rounded-full bg-[var(--gold)]/15 blur-3xl md:size-80"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-40 left-0 size-80 rounded-full bg-[var(--teal)]/20 blur-3xl md:size-96"
    />

    <div className="landing-container relative">
      <SectionHeading title={knowledgeHeading} />

      <div className="landing-heading-gap mx-auto max-w-3xl space-y-3 sm:space-y-4">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="group flex items-center gap-4 rounded-2xl border border-[rgba(18,61,52,0.08)] bg-[var(--card)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--gold)]/50 hover:shadow-[0_16px_34px_rgba(18,61,52,0.1)] sm:gap-5 sm:p-6"
          >
            <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-[var(--teal-soft)] text-lg font-extrabold text-[var(--teal-dark)] transition-transform duration-300 group-hover:scale-105 sm:size-11">
              {pillar.letter}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-[1.1rem] font-extrabold tracking-tight text-[var(--teal-dark)]">
                {pillar.title}
              </h4>
              <p className="mt-1 text-[0.95rem] leading-[1.75] text-[var(--text-mute)]">
                {pillar.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="landing-heading-gap mx-auto max-w-2xl text-center text-[1.05rem] leading-[1.85] text-[var(--text)] sm:text-[1.1rem]">
        {knowledgeText}
      </p>
    </div>
  </section>
);

export default Knowledge;