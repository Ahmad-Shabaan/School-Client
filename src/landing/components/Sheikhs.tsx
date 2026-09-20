import { sheikhs, sheikhsHeading, sheikhsLede } from "@/landing/data/landing";
import SectionHeading from "./SectionHeading";

const Sheikhs = () => (
  <section id="sheikhs" className="landing-section scroll-mt-36 bg-[var(--paper)] sm:scroll-mt-28">
    <div className="landing-container">
      <SectionHeading title={sheikhsHeading} lede={sheikhsLede} />

      <div className="landing-heading-gap mx-auto flex max-w-3xl flex-col gap-5">
        {sheikhs.map((sheikh) => (
          <article
            key={sheikh.name}
            className="group flex flex-col items-center gap-5 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--gold)]/50 hover:shadow-[0_16px_34px_rgba(18,61,52,0.1)] sm:flex-row sm:gap-7 sm:px-7 sm:text-start"
          >
            <div className="avatar-tile flex size-20 flex-none items-center justify-center rounded-2xl text-2xl font-extrabold">
              {sheikh.initial}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[1.2rem] font-extrabold tracking-tight text-[var(--teal-dark)]">
                {sheikh.name}
              </h3>
              <p className="mt-1 text-[0.95rem] font-bold text-[var(--gold)]">
                {sheikh.role}
              </p>
              <p className="mt-3 text-[0.95rem] leading-[1.8] text-[var(--text-mute)]">
                {sheikh.bio}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Sheikhs;