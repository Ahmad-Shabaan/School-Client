import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  servicesLabel,
  servicesLinks,
  servicesTitle,
} from "@/landing/data/landing";

const ServiceMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = () => {
    setOpen(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      data-open={open}
      className="services-menu relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        title={servicesTitle}
        className="group flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-3.5 py-2 text-[0.9rem] font-semibold text-[var(--text)] transition-colors duration-200 hover:bg-[var(--teal-soft)] hover:text-[var(--teal-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)] data-[open=true]:bg-[var(--teal-soft)] data-[open=true]:text-[var(--teal-dark)]"
      >
        {servicesLabel}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 flex-none text-[var(--teal-dark)] transition-transform duration-300 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        id={panelId}
        className="services-panel absolute left-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-2rem)] origin-top-left rounded-2xl border border-[var(--line)] bg-[var(--card)]/95 p-2 shadow-[0_24px_60px_rgba(18,61,52,0.24)] ring-1 ring-black/[0.04] backdrop-blur-xl"
        role="menu"
        aria-label={servicesTitle}
      >
        <h3 className="mb-1 flex items-center gap-2 px-2.5 pt-1.5 pb-2.5 text-[0.7rem] font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase">
          <span
            aria-hidden="true"
            className="h-3.5 w-1 flex-none rounded-full bg-[var(--gold)]"
          />
          {servicesTitle}
        </h3>

        <ul className="list-none">
          {servicesLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                role="menuitem"
                className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm font-medium text-[var(--text)] transition-all duration-200 hover:bg-[var(--teal-soft)] hover:ps-3.5 hover:text-[var(--teal-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(169,130,44,0.6)]"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 flex-none rounded-full bg-[var(--gold)]/45 transition-all duration-200 group-hover:scale-125 group-hover:bg-[var(--gold)]"
                />
                <span className="flex-1">{link.label}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-3.5 flex-none text-[var(--teal-dark)] opacity-0 transition-opacity duration-200 group-hover:opacity-60"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceMenu;