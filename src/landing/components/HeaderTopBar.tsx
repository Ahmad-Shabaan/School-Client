import { useState } from "react";
import { brandMark, brandName } from "@/landing/data/landing";
import { PhoneIcon } from "./icons";

const formatToday = (date: Date) =>
  new Intl.DateTimeFormat("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(date);

const HeaderTopBar = () => {
  const [today] = useState(() => formatToday(new Date()));

  return (
    <div className="hidden border-b border-[var(--line)] bg-[var(--teal-dark)] text-white md:block">
      <div className="landing-container flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2 sm:gap-x-6 sm:gap-y-2">
        {/* ── Logo ── */}
        <a
          href="#"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label={brandName}
        >
          <span className="mark-tile flex size-9 flex-none items-center justify-center rounded-full text-base font-bold text-[var(--teal-dark)] shadow-[0_6px_16px_rgba(0,0,0,0.22)] ring-1 ring-white/25 transition-shadow duration-300 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
            {brandMark}
          </span>
          <span className="hidden truncate text-lg font-extrabold tracking-tight text-white sm:inline">
            {brandName}
          </span>
        </a>

        {/* ── Middle: today's date ── */}
        <p className="order-last w-full text-center text-[0.78rem] font-semibold text-white/85 sm:order-none sm:w-auto sm:flex-1 sm:text-center">
          <time dateTime={new Date().toISOString().slice(0, 10)}>{today}</time>
        </p>

        {/* ── Actions ── */}
        <div className="flex flex-none items-center gap-1.5 sm:gap-2">
          <a
            href="#inquiries"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-[10px] border border-white/25 px-2.5 py-1.5 text-[0.75rem] font-bold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] sm:px-3 sm:text-[0.78rem]"
          >
            <PhoneIcon className="size-4 flex-none" />
            اتصل بنا
          </a>
          <a
            href="/login"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-white px-3 py-1.5 text-[0.75rem] font-bold text-[var(--teal-dark)] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-[var(--gold-soft)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.24)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--teal-dark)] sm:px-3.5 sm:text-[0.78rem]"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderTopBar;