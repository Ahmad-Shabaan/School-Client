import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { useLoginFormAnimation } from "../animations/form.animation";
// import Logo from "@/shared/components/common/Logo";

const AuthLayout = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useLoginFormAnimation({ sectionRef: containerRef });
  return (
    <main className="main-container pt-0 min-h-svh flex items-start sm:items-center justify-center relative">
      <div className="page-container" ref={containerRef}>
        {/* ── Atmospheric Orbs ── */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            data-animate="orb"
            className="absolute -left-[15%] -top-[15%] h-[55%] w-[55%] rounded-full bg-primary/15 blur-[80px] will-change-transform will-change-opacity"
          />
          <div
            data-animate="orb"
            className="absolute -right-[10%] top-[15%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[60px] will-change-transform will-change-opacity"
          />
          <div
            data-animate="orb"
            className="absolute bottom-[-5%] left-[30%] h-[35%] w-[35%] rounded-full bg-tertiary/8 blur-[80px] will-change-transform will-change-opacity"
          />
        </div>

        {/* ── Main Grid ── */}
        <div className="flex-1 relative z-10 grid lg:grid-cols-1">
          {/* <div>
            <img src="/images/hero-image.webp" alt="school" className="w-full" />
          </div> */}
          {/* ── LEFT PANEL (desktop only) ── */}
          {/* <div
            data-animate="brand"
            className="hidden lg:flex flex-col justify-center gap-4 
             border-r border-outline lg:pr-6 xl:max-w-lg xl:justify-self-end"
          >
            <Logo />
            <section className="space-y-4 ">
              <h2 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
                Your reading
                <br />
                <span className="text-gradient">life, organized.</span>
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Track every book, discover your next favorite, and share what
                you're reading with the world.
              </p>

              <div className="flex gap-10 pt-4">
                {[
                  { value: "2M+", label: "Readers" },
                  { value: "8M+", label: "Books tracked" },
                  { value: "4.9★", label: "App rating" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-primary">{value}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <article className="glass-panel rounded-2xl p-6 mt-1">
              <p className="text-sm text-on-surface-variant leading-relaxed italic">
                "Book Wise completely changed how I approach reading. I've read
                more this year than the last five combined."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/30 flex-center text-xs font-bold text-primary">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Sarah K.</p>
                  <p className="text-xs text-on-surface-variant">
                    Verified reader
                  </p>
                </div>
              </div>
            </article>
          </div> */}
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
