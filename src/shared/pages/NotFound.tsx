import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useNotFoundAnimation } from "../animations/notFound.animation";

const NotFound = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useNotFoundAnimation({ sectionRef });
  return (
    <main
      ref={sectionRef}
      className="main-container pt-0 relative min-h-svh flex flex-col"
    >
      {/* Background Atmospheric Elements */}
      <div className="pointer-events-none fixed inset-0 h-dvh z-0">
        <div className="bg-primary/40 absolute top-1/4 -left-20 h-96 w-96 rounded-full blur-[100px]" />
        <div className="bg-secondary/40 absolute bottom-1/4 -right-20 h-80 w-80 rounded-full blur-[100px]" />
      </div>

      {/* Main 404 Canvas */}
      <div className="page-container relative z-10 flex-1 flex flex-col items-center justify-start sm:justify-center">
        <section className=" w-full text-center">
          {/* Hero Illustration */}
          <div
            data-animate="hero-illustration"
            className=" relative mb-4 sm:mb-6 inline-block"
          >
            <div className="bg-primary/20 absolute inset-0 scale-75 rounded-full blur-3xl" />
            <div className="bg-surface-container-low relative inline-block overflow-hidden rounded-3xl border border-surface-container-highest p-4 backdrop-blur-xl">
              <img
                src="/images/not-found.webp"
                alt="Lost in the Stacks"
                className="h-76 w-52 rounded-xl object-cover shadow-2xl grayscale brightness-75 transition-all duration-700 hover:grayscale-0"
              />
              <div className="from-surface-container-lowest/80 absolute inset-0 flex items-end justify-center bg-linear-to-t to-transparent pb-8">
                <span className="text-on-surface/50 text-3xl sm:text-6xl font-black tracking-tighter">
                  404
                </span>
              </div>
            </div>
          </div>

          <h1
            data-animate="hero-title"
            className=" section-header block text-4xl md:text-5xl"
          >
            Lost in the Stacks.
          </h1>
          <p data-animate="hero-desc" className="section-description">
            The chapter you&apos;re looking for has vanished into the ether. It
            may have been archived or moved to a secret shelf.
          </p>

          {/* CTA Buttons */}
          <div className="col-center gap-4 sm:gap-6 sm:flex-row">
            <button
              data-animate="cta-btn"
              onClick={() => navigate("/")}
              className=" btn-primary group w-auto!  font-semibold sm:font-bold"
            >
              <span>Back to Home</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
      </div>

      {/* Floating Librarian Tip */}
      <div
        data-animate="librarian-tip"
        className=" pointer-events-none fixed bottom-10 left-10 z-20 hidden lg:block"
      >
        <div className="bg-surface-container-low flex items-center gap-4 rounded-2xl border border-surface-container-highest p-4 shadow-soft-dim backdrop-blur-xl">
          <div className="bg-primary/20 flex size-10 items-center justify-center rounded-full">
            <BookOpen className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface">
              Librarian&apos;s Tip
            </p>
            <p className="text-sm text-on-surface-variant">
              Check your spelling or try Discover.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
