import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm leading-7 text-body transition-colors outline-none placeholder:text-body-mute focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-teal/20 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
