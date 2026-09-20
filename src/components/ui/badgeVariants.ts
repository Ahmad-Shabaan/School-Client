import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-3 hover:shadow-sm active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/15 focus:ring-primary/20",
        secondary:
          "border-transparent bg-secondary/10 text-secondary hover:bg-secondary/15 focus:ring-secondary/20",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/15 focus:ring-destructive/20",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-400/10 focus:ring-emerald-500/20",
        warning:
          "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400 dark:bg-amber-400/10 focus:ring-amber-500/20",
        outline:
          "border-border/50 text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
