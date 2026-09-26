import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust/50 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-[#d64f45]",
        secondary:
          "bg-trust text-white hover:bg-[#34897e]",
        ghost:
          "bg-transparent text-secondary hover:bg-elevated hover:text-foreground",
        destructive:
          "bg-danger/15 text-danger hover:bg-danger/25",
        // aliases kept for any leftover call sites
        default:
          "bg-accent text-white hover:bg-[#d64f45]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-elevated",
        danger:
          "bg-danger/15 text-danger hover:bg-danger/25",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
