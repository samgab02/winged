"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedWingMark } from "@/components/motion/animated-wing-mark";
import { FlyingWings } from "@/components/motion/flying-wings";

export function SplashScreen() {
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,var(--glow-a),transparent_55%),radial-gradient(ellipse_at_80%_80%,var(--glow-b),transparent_50%)]" />
      <FlyingWings density="light" />
      <div className="relative z-10 flex flex-col items-center">
        <AnimatedWingMark className="size-20" />
        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground"
        >
          Winged
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.35 }}
          className="mt-2 max-w-[18ch] text-center font-display text-base font-bold tracking-tight text-foreground/90"
        >
          Friends plan it. You show up.
        </motion.p>
      </div>
    </div>
  );
}
