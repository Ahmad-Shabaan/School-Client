const Loading = () => {
  return (
    <main
      dir="rtl"
      lang="ar"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-paper px-6 font-tajawal"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -start-24 size-64 rounded-full bg-teal-soft/70 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -end-20 size-64 rounded-full bg-gold-soft/70 blur-3xl"
      />

      <div
        role="status"
        aria-live="polite"
        className="relative flex w-full max-w-xs flex-col items-center text-center"
      >
        <div className="relative flex size-20 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full border border-gold/30 [animation-duration:2.2s]"
          />
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-gold bg-gradient-to-br from-teal to-teal-dark text-2xl font-extrabold text-gold-soft shadow-[0_8px_24px_rgba(22,48,42,0.14)]">
            س
          </span>
        </div>

        <h1 className="mt-5 text-xl font-extrabold text-teal-dark">
          المدرسة النُّعمانية
        </h1>
        <p className="mt-1.5 text-sm text-body-mute">
          جارٍ تجهيز المحتوى...
        </p>

        <div className="mt-6 flex items-center gap-2 text-teal-dark">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-teal/20 border-t-teal-dark"
          />
          <span className="text-xs font-bold">لحظات من فضلك</span>
        </div>

        <div
          aria-hidden="true"
          className="mt-5 h-1 w-44 overflow-hidden rounded-full bg-line"
        >
          <span className="block h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-teal to-gold" />
        </div>
      </div>
    </main>
  );
};

export default Loading;
