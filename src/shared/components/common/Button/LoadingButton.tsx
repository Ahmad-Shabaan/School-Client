const LoadingButton = ({ label }: { label: string }) => {
  return (
    <span className="flex items-center gap-2">
      <span className="size-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />
      {label}
    </span>
  );
};

export default LoadingButton;
