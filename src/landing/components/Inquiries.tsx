import type { ComponentType } from "react";
import type { ContactIconName } from "@/landing/types/landing";
import { cn } from "@/lib/utils";
import {
  contactDescription,
  contactFields,
  contactRows,
  contactTitle,
  inquiriesHeading,
  inquiriesLede,
  sendLabel,
} from "@/landing/data/landing";
import { ClockIcon, EnvelopeIcon, PhoneIcon } from "./icons";
import SectionHeading from "./SectionHeading";

const contactIcons: Record<ContactIconName, ComponentType<{ className?: string }>> = {
  email: EnvelopeIcon,
  phone: PhoneIcon,
  clock: ClockIcon,
};

const inputClasses =
  "w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[0.95rem] text-white placeholder:text-[#8DA098] transition-colors duration-200 focus:border-[var(--gold)] focus:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30";

const Inquiries = () => (
  <section
    id="inquiries"
    className="landing-section relative scroll-mt-36 overflow-hidden bg-[var(--teal-dark)] sm:scroll-mt-28"
  >
    <div className="hero-atmosphere" aria-hidden="true" />
    <div className="hero-pattern" aria-hidden="true" />

    <div className="landing-container relative">
      <SectionHeading
        tone="dark"
        title={inquiriesHeading}
        lede={inquiriesLede}
      />

      <div className="landing-heading-gap mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] shadow-[0_28px_70px_rgba(0,0,0,0.32)] backdrop-blur sm:rounded-3xl">
        <div className="grid md:grid-cols-[1fr_1.3fr]">
          <div className="border-b border-white/10 bg-[rgba(0,0,0,0.14)] p-6 md:border-b-0 md:border-e md:p-8 lg:p-10">
            <h3 className="text-[1.3rem] font-extrabold tracking-tight text-white sm:text-[1.35rem]">
              {contactTitle}
            </h3>
            <p className="mt-2 text-[0.95rem] leading-[1.8] text-[#C7D3CD]">
              {contactDescription}
            </p>

            <ul className="mt-7 space-y-5 sm:mt-8 sm:space-y-6">
              {contactRows.map((row) => {
                const Icon = contactIcons[row.icon];
                return (
                  <li key={row.title} className="flex items-start gap-4">
                    <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-[rgba(169,130,44,0.22)] text-[var(--gold)]">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.95rem] font-bold text-white">{row.title}</p>
                      <p
                        dir={row.ltr ? "ltr" : undefined}
                        className={cn(
                          "mt-0.5 break-words text-[0.85rem] leading-6 text-[#B9C6C0]",
                          row.ltr && "text-end",
                        )}
                      >
                        {row.value}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {contactFields.slice(0, 2).map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-2 block text-[0.88rem] font-bold text-[#C7D3CD]">
                    {field.label}
                  </span>
                  <input
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    className={inputClasses}
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 sm:mt-5">
              {contactFields.slice(2).map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-2 block text-[0.88rem] font-bold text-[#C7D3CD]">
                    {field.label}
                  </span>
                  {field.textarea ? (
                    <textarea
                      rows={field.rows ?? 4}
                      placeholder={field.placeholder}
                      className={inputClasses}
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      className={inputClasses}
                    />
                  )}
                </label>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-[var(--gold)] py-3.5 text-[0.95rem] font-extrabold text-[var(--teal-dark)] shadow-[0_16px_34px_rgba(0,0,0,0.3)] transition-all duration-200 hover:bg-[#C39A3F] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)]/70 sm:mt-7"
            >
              {sendLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Inquiries;