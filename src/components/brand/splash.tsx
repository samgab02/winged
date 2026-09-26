"use client";

import { motion } from "framer-motion";
import { PoviMark } from "@/components/brand/povi-mark";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,77,109,0.18),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(46,196,182,0.12),transparent_50%)]" />
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <PoviMark className="size-24 shadow-card" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-5 font-display text-3xl font-extrabold tracking-tight"
      >
        POVI
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-1 text-xs font-semibold tracking-[0.2em] text-romance"
      >
        PROOF OF VIBE
      </motion.p>
    </div>
  );
}
