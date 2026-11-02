import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ShieldOff, GraduationCap, MoveRight } from "lucide-react";
import { useNotFoundAnimation } from "../animations/notFound.animation";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/config/routes";

/**
 * 403 page — shown when the signed-in user's roles don't satisfy a route
 * guard. Follows the student design language of `NotFound` (atmospheric
 * blurs, serif header, illustrated card, role-aware CTA).
 */
const AccessDenied = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useNotFoundAnimation({ sectionRef });

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const firstRole = useAppSelector(
    (state) => state.auth.user?.roles?.[0] ?? null,
  );
  const dashboardPath = isAuthenticated && firstRole
    ? ROUTES[firstRole].basePath
    : null;

  return (
    <main
      ref={sectionRef}
      className="main-container pt-0 relative min-h-svh flex flex-col"
    >
      {/* Background Atmospheric Elements */}
      <div className="pointer-events-none fixed inset-0 h-dvh z-0">
        <div className="bg-primary/40 absolute top-1/4 -left-20 h-96 w-96 rounded-full blur-[100px]" />
        <div className="bg-error/20 absolute bottom-1/4 -right-20 h-80 w-80 rounded-full blur-[100px]" />
      </div>

      {/* Main 403 Canvas */}
      <div className="page-container relative z-10 flex-1 flex flex-col items-center justify-start sm:justify-center">
        <section className="w-full text-center">
          {/* Hero Illustration — locked section card */}
          <div
            data-animate="hero-illustration"
            className="relative mb-4 sm:mb-6 inline-block"
          >
            <div className="bg-primary/20 absolute inset-0 scale-75 rounded-full blur-3xl" />
            <div className="bg-surface-container-low relative inline-block overflow-hidden rounded-3xl border border-surface-container-highest backdrop-blur-xl py-10 px-10 sm:py-14 sm:px-16">
              <div className="gradient-primary/10 absolute inset-0" aria-hidden="true" />
              <div className="relative flex flex-col items-center gap-3">
                <div className="bg-primary/20 flex size-16 items-center justify-center rounded-full">
                  <ShieldOff className="size-8 text-primary" />
                </div>
                <span className="text-on-surface/40 text-4xl sm:text-6xl font-black tracking-tighter">
                  403
                </span>
              </div>
            </div>
          </div>

          <h1
            data-animate="hero-title"
            className="section-header block text-4xl md:text-5xl sm:justify-center"
          >
            This Section Is Off-Limits.
          </h1>
          <p data-animate="hero-desc" className="section-description">
            This page is reserved for another role, so your account can&apos;t
            open it. If you think you should have access, ask a school
            administrator to review your permissions.
          </p>

          {/* CTA Buttons */}
          <div className="col-center gap-4 sm:gap-6 sm:flex-row">
            <button
              data-animate="cta-btn"
              onClick={() => navigate("/")}
              className="btn-secondary w-auto! font-semibold sm:font-bold"
            >
              <Home className="size-4" />
              <span>Back to Home</span>
            </button>

            {dashboardPath ? (
              <Link
                data-animate="cta-btn"
                to={dashboardPath}
                className="btn-primary group w-auto! font-semibold sm:font-bold"
              >
                <GraduationCap className="size-4" />
                <span>Go to My Space</span>
                <MoveRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                data-animate="cta-btn"
                onClick={() => navigate("/login")}
                className="btn-primary group w-auto! font-semibold sm:font-bold"
              >
                <span>Sign In</span>
                <MoveRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Floating Tip — mirrors the librarian tip of the 404 page */}
      <div
        data-animate="librarian-tip"
        className="pointer-events-none fixed bottom-10 left-10 z-20 hidden lg:block"
      >
        <div className="bg-surface-container-low flex items-center gap-4 rounded-2xl border border-surface-container-highest p-4 shadow-soft-dim backdrop-blur-xl">
          <div className="bg-primary/20 flex size-10 items-center justify-center rounded-full">
            <ShieldOff className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface">
              Access Note
            </p>
            <p className="text-sm text-on-surface-variant">
              Access is granted by your account&apos;s role.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccessDenied;
