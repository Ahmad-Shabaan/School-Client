import { MessageSquare } from "lucide-react";

interface ChatEmptyStateProps {
  heading: string;
  description: string;
}

export default function ChatEmptyState({
  heading,
  description,
}: ChatEmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-dashed border-line bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-line bg-teal-soft text-teal-dark">
        <MessageSquare className="size-8" />
      </div>
      <h2 className="text-lg font-extrabold text-ink">{heading}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-body-mute">
        {description}
      </p>
    </div>
  );
}
