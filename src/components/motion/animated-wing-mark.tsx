"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  WingedMark,
  WingedLockup,
  WingedMarkLockup,
} from "@/components/brand/winged-mark";
import { cn } from "@/lib/utils";

export function AnimatedWingMark({
  className,
  flap = true,
  title = "Winged",
}: {
  className?: string;
  flap?: boolean;
  title?: string;
}) {
  const reduced = useReducedMotion();
  const animate = flap && !reduced;

  return (
    <motion.div
      className={cn("inline-block", className)}
      initial={animate ? { scale: 0.9, opacity: 0, rotate: -4 } : false}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <WingedMark className="size-full" title={title} />
    </motion.div>
  );
}

export function AnimatedWingLockup({
  className,
  title = "Winged",
  variant = "horizontal",
}: {
  className?: string;
  title?: string;
  variant?: "horizontal" | "stacked";
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("inline-block", className)}
      initial={reduced ? { opacity: 0 } : { scale: 0.92, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      {variant === "stacked" ? (
        <WingedMarkLockup className="size-full" title={title} />
      ) : (
        <WingedLockup className="size-full" title={title} />
      )}
    </motion.div>
  );
}
