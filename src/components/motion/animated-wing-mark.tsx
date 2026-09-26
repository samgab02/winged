"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  WingedMark,
  WingedLockup,
  WingSprite,
} from "@/components/brand/winged-mark";
import { cn } from "@/lib/utils";

/** Logo with an obvious one-shot flap on load */
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
      className={cn("relative inline-block", className)}
      initial={animate ? { scale: 0.82, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      {animate && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -left-[42%] top-[8%] w-[48%]"
            initial={{ rotate: 28, opacity: 0, x: -8 }}
            animate={{ rotate: [28, -6, 0], opacity: [0, 0.85, 0], x: [-8, 0, 4] }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <WingSprite flip className="w-full" />
          </motion.span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -right-[42%] top-[8%] w-[48%]"
            initial={{ rotate: -28, opacity: 0, x: 8 }}
            animate={{ rotate: [-28, 6, 0], opacity: [0, 0.85, 0], x: [8, 0, -4] }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <WingSprite className="w-full" />
          </motion.span>
        </>
      )}
      <motion.div
        animate={
          animate
            ? { scale: [1, 1.08, 0.97, 1], rotate: [0, -3, 2, 0] }
            : undefined
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <WingedMark className="size-full" title={title} />
      </motion.div>
    </motion.div>
  );
}

export function AnimatedWingLockup({
  className,
  title = "Winged",
}: {
  className?: string;
  title?: string;
  variant?: "horizontal" | "stacked";
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("inline-block", className)}
      initial={reduced ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
    >
      <WingedLockup className="size-full" title={title} />
    </motion.div>
  );
}
