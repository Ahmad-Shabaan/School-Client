import { useEffect, useRef, useState } from "react";
import { servicesLinks, servicesTitle } from "@/landing/data/landing";
import { MenuIcon } from "./icons";

const ServiceMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={ref} data-open={open} className="services-menu fixed right-4 top-44 z-50 sm:right-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        title={servicesTitle}
        className="flex size-12 items-center justify-center rounded-full bg-[var(--teal-dark)] text-[var(--gold-soft)] shadow-[0_10px_24px_rgba(18,61,52,0.24)] ring-1 ring-white/15 transition-all duration-200 hover:bg-[var(--teal)] hover:shadow-[0_4px_14px_rgba(18,61,52,0.18)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] focus-visible:ring-offset-2"
      >
        <MenuIcon className="size-6" />
      </button>

      <div
        className="services-panel absolute right-0 top-[62px] w-60 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_20px_50px_rgba(18,61,52,0.22)]"
        role="menu"
        aria-label={servicesTitle}
      >
        <h3 className="border-b border-[var(--line)] pb-3 text-base font-extrabold text-[var(--teal-dark)]">
          {servicesTitle}
        </h3>
        <ul className="mt-1 list-none">
          {servicesLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                role="menuitem"
                className="group mt-0.5 flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:bg-[var(--teal-soft)] hover:pe-3 hover:text-[var(--teal-dark)]"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 flex-none rounded-full bg-[var(--gold)]/50 transition-colors duration-200 group-hover:bg-[var(--gold)]"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceMenu;