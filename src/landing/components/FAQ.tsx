import { useState } from "react";
import type { FaqItem } from "@/landing/types/landing";
import { faqHeading, faqItems } from "@/landing/data/landing";
import { PlusIcon } from "./icons";
import SectionHeading from "./SectionHeading";

interface FaqItemCardProps {
  item: FaqItem;
}

const FaqItemCard = ({ item }: FaqItemCardProps) => {
  const [open, setOpen] = useState(item.defaultOpen ?? false);

  return (
    <details
      open={open}
      className="group rounded-2xl border border-[var(--line)] bg-[var(--card)] transition-all duration-200 open:shadow-[0_14px_34px_rgba(18,61,52,0.1)] open:border-[var(--gold)]/50"
    >
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen((value) => !value);
        }}
        className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[1.02rem] font-extrabold leading-[1.6] text-[var(--teal-dark)] transition-colors duration-200 hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:ring-inset [&::-webkit-details-marker]:hidden sm:gap-4 sm:px-6 sm:py-5 sm:text-[1.05rem]"
      >
        {item.question}
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-[var(--teal-soft)] text-[var(--teal-dark)] transition-all duration-300 group-open:rotate-45 group-open:bg-[var(--gold)] group-open:text-white">
          <PlusIcon className="size-4" />
        </span>
      </summary>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <p className="border-t border-[var(--line)] pt-4 text-[0.95rem] leading-[1.8] text-[var(--text-mute)]">
          {item.answer}
        </p>
      </div>
    </details>
  );
};

const FAQ = () => (
  <section id="faq" className="landing-section scroll-mt-36 bg-[var(--paper)] sm:scroll-mt-28">
    <div className="landing-container">
      <SectionHeading title={faqHeading} />

      <div className="landing-heading-gap mx-auto max-w-2xl space-y-3 sm:space-y-4">
        {faqItems.map((item) => (
          <FaqItemCard key={item.question} item={item} />
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;