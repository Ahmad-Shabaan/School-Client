import { useEffect, useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import {
  brandMark,
  brandName,
  navLinks,
} from "@/landing/data/landing";
import ServiceMenu from "./ServiceMenu";
import HeaderTopBar from "./HeaderTopBar";
import { PhoneIcon } from "./icons";

const useScrolled = (offset = 8) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* ── Part 1: scrolls away with the page ── */}
      <HeaderTopBar />

      {/* ── Part 2: sticks to the top on scroll ── */}
      <div
        className={`sticky top-0 z-[60] border-b border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_30px_rgba(18,61,52,0.12)]" : ""
        }`}
      >
        <div className="landing-container flex h-14 items-center justify-between gap-3 sm:h-16 md:justify-center md:gap-0">
          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="التنقل الرئيسي">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative whitespace-nowrap rounded-[10px] px-2.5 py-2 text-[0.85rem] font-semibold text-[var(--text)] transition-colors duration-200 hover:bg-[var(--teal-soft)] hover:text-[var(--teal-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] lg:px-3.5 lg:text-[0.9rem]"
              >
                {link.label}
              </a>
            ))}

            {/* ── Services dropdown ── */}
            <ServiceMenu />
          </nav>

          {/* ── Compact brand (sticky bar only) ── */}
          <a
            href="#"
            className="group flex min-w-0 items-center gap-2 md:hidden"
            aria-label={brandName}
          >
            <span className="mark-tile flex size-8 flex-none items-center justify-center rounded-full text-sm font-bold shadow-[0_6px_16px_rgba(18,61,52,0.18)] ring-1 ring-white/10">
              {brandMark}
            </span>
            <span className="truncate text-sm font-extrabold tracking-tight text-[var(--teal-dark)] sm:text-base">
              {brandName}
            </span>
          </a>

{/* ── Actions ── */}
          <div className="flex flex-none items-center gap-1.5">
            <a
              href="#inquiries"
              aria-label="اتصل بنا"
              className="flex size-9 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--teal-dark)] transition-colors duration-200 hover:bg-[var(--teal-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] sm:size-8 md:hidden"
            >
              <PhoneIcon className="size-4 sm:size-3.5" />
              <span className="sr-only">اتصل بنا</span>
            </a>

            <a
              href="/login"
              aria-label="تسجيل الدخول"
              className="flex size-9 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--teal-dark)] transition-colors duration-200 hover:bg-[var(--teal-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] sm:size-8 md:hidden"
            >
              <LogIn className="size-4 sm:size-3.5" />
              <span className="sr-only">تسجيل الدخول</span>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-nav"
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className="flex size-9 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--teal-dark)] transition-colors duration-200 hover:bg-[var(--teal-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] sm:size-8 md:hidden"
            >
              {menuOpen ? (
                <X className="size-4 sm:size-3.5" />
              ) : (
                <Menu className="size-4 sm:size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <nav
            id="landing-mobile-nav"
            className="border-t border-[var(--line)] bg-[var(--card)] md:hidden"
            aria-label="التنقل الرئيسي"
          >
            <div className="landing-container flex flex-col gap-1 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[10px] px-3 py-2.5 text-[0.95rem] font-semibold text-[var(--text)] transition-colors duration-200 hover:bg-[var(--teal-soft)] hover:text-[var(--teal-dark)]"
                >
                  {link.label}
                </a>
              ))}

              {/* ── Services dropdown ── */}
              <ServiceMenu />
            </div>
          </nav>
        )}
      </div>
    </>
  );
};

export default Header;