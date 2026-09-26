"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedWingMark } from "@/components/motion/animated-wing-mark";

export function SplashScreen() {
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,var(--glow-a),transparent_55%),radial-gradient(ellipse_at_80%_80%,var(--glow-b),transparent_50%)]" />
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-40 w-[120%] -translate-y-1/2 opacity-[0.07]"
          initial={{ x: "-8%", rotate: -4 }}
          animate={{ x: "8%", rotate: 4 }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
          style={{
            background:
              "radial-gradient(ellipse at center, var(--romance) 0%, transparent 68%)",
          }}
        />
      )}
      <AnimatedWingMark className="size-24 shadow-card" />
      <motion.p
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, letterSpacing: "0.12em" }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0, letterSpacing: "0.02em" }
        }
        transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 font-display text-3xl font-extrabold tracking-tight"
      >
        Winged
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        className="mt-1 text-xs font-semibold tracking-[0.2em] text-romance"
      >
        DATES WITH A WINGMAN
      </motion.p>
    </div>
  );
}
