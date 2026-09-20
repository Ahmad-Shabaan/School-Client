import {
  brandMark,
  copyrightLine,
  footerBlurb,
  footerContactTitle,
  footerContacts,
  footerLinks,
  footerName,
  footerQuickTitle,
} from "@/landing/data/landing";
import { cn } from "@/lib/utils";

const Footer = () => (
  <footer className="relative overflow-hidden bg-[var(--ink)]">
    <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 md:pt-20">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="mark-tile flex size-11 flex-none items-center justify-center rounded-xl text-xl font-extrabold shadow-[0_6px_16px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
              {brandMark}
            </span>
            <h3 className="text-[1.4rem] font-extrabold tracking-tight text-white">
              {footerName}
            </h3>
          </div>
          <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-[#AEBDB6]">
            {footerBlurb}
          </p>
        </div>

        <div>
          <h4 className="text-[1.05rem] font-extrabold text-[var(--gold-soft)]">
            {footerQuickTitle}
          </h4>
          <ul className="mt-5 space-y-3">
            {footerLinks.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  className="text-[0.95rem] text-[#CBD6D0] transition-colors duration-200 hover:text-[var(--gold-soft)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[1.05rem] font-extrabold text-[var(--gold-soft)]">
            {footerContactTitle}
          </h4>
          <ul className="mt-5 space-y-3">
            {footerContacts.map((contact) => (
              <li
                key={contact.value}
                dir={contact.ltr ? "ltr" : undefined}
                className={cn(
                  "text-[0.95rem] text-[#CBD6D0]",
                  contact.ltr && "text-end",
                )}
              >
                {contact.value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 border-t border-white/[0.08] pt-6 text-center text-[0.85rem] text-[#8FA097]">
        {copyrightLine}
      </div>
    </div>
  </footer>
);

export default Footer;