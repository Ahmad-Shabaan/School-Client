import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  brandMark,
  brandName,
  loginLabel,
  navLinks,
} from "@/landing/data/landing";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60]">
      <div className="border-b border-[var(--line)] bg-[var(--card)]/90 backdrop-blur-xl">
        <div className="landing-container flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
          {/* ── Brand ── */}
          <a
            href="#"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
            aria-label={brandName}
          >
            <span className="mark-tile flex size-9 flex-none items-center justify-center rounded-full text-base font-bold shadow-[0_6px_16px_rgba(18,61,52,0.18)] ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-[0_8px_20px_rgba(18,61,52,0.26)] sm:size-10 sm:text-lg">
              {brandMark}
            </span>
            <span className="truncate text-lg font-extrabold tracking-tight text-[var(--teal-dark)] sm:text-xl">
              {brandName}
            </span>
          </a>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="التنقل الرئيسي"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative whitespace-nowrap rounded-[10px] px-3.5 py-2 text-[0.9rem] font-semibold text-[var(--text)] transition-colors duration-200 hover:bg-[var(--teal-soft)] hover:text-[var(--teal-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden items-center whitespace-nowrap rounded-[10px] bg-[var(--teal-dark)] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(18,61,52,0.22)] transition-all duration-200 hover:bg-[var(--teal)] hover:shadow-[0_6px_16px_rgba(18,61,52,0.2)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] focus-visible:ring-offset-2 sm:px-5 sm:inline-flex"
            >
              {loginLabel}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className="flex size-10 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--teal-dark)] transition-colors duration-200 hover:bg-[var(--teal-soft)] md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <nav
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
              <a
                href="#"
                className="mt-2 flex items-center justify-center rounded-[10px] bg-[var(--teal-dark)] px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[var(--teal)]"
              >
                {loginLabel}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;