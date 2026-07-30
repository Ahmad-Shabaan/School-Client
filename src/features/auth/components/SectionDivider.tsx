const SectionDivider = ({ label }: { label: string }) => {
  return (
    <div className="relative flex items-center py-1">
      <div
        className="grow border-t border-outline-variant/15"
        aria-hidden="true"
      />
      <span className="px-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </span>
      <div
        className="grow border-t border-outline-variant/15"
        aria-hidden="true"
      />
    </div>
  );
};

export default SectionDivider;
