import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan to-aqua text-obsidian shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:brightness-110",
        pink: "bg-gradient-to-r from-pink to-coral text-white shadow-[0_0_20px_rgba(255,8,68,0.35)] hover:brightness-110",
        gold: "bg-gradient-to-r from-amber-400 to-gold text-obsidian shadow-[0_0_20px_rgba(255,215,0,0.35)] hover:brightness-110",
        outline:
          "border border-white/15 bg-white/5 text-foreground hover:bg-white/10",
        ghost: "text-foreground hover:bg-white/8",
        danger: "bg-pink/20 text-pink border border-pink/40 hover:bg-pink/30",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
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
