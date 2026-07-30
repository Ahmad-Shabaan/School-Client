import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-3 hover:shadow-sm active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary/20",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive/20",
        outline:
          "border border-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
