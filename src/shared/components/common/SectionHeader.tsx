import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const SectionHeader = ({
  link,
  to,
  hideLink,
  children,
}: {
  link: string;
  to: string;
  hideLink?: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      {hideLink && hideLink === true ? (
        <></>
      ) : (
        <Link
          to={to}
          className="absolute -top-6 sm:-top-8 -translate-y-1/2 right-0 z-1 inline-flex items-center gap-2 text-on-surface-variant hover:text-primary uppercase transition-colors group text-xs sm:text-sm font-medium"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          {link}
        </Link>
      )}

      <section className="bg-surface-container-low rounded-xl p-4 sm:p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-soft border border-outline-variant/10 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        {children}
      </section>
    </div>
  );
};

export default SectionHeader;
