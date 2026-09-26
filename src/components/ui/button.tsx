import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-romance/40 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary: "bg-romance text-white hover:bg-romance-deep shadow-soft",
        secondary:
          "bg-wing text-white hover:bg-wing-deep shadow-soft",
        ghost:
          "bg-transparent text-secondary hover:bg-elevated hover:text-foreground",
        destructive: "bg-romance-soft text-romance-deep hover:bg-romance/20",
        outline:
          "border border-border bg-surface text-foreground hover:bg-elevated",
        default: "bg-romance text-white hover:bg-romance-deep shadow-soft",
        danger: "bg-romance-soft text-romance-deep hover:bg-romance/20",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-9 rounded-xl px-3 text-xs",
        lg: "h-13 px-6 text-base",
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
