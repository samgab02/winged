"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WingSprite } from "@/components/brand/winged-mark";

/** Visible celebration bloom for Vouch / Lock / Keep — large wing burst */
export function WingBloom({ show }: { show: boolean }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!reduced &&
            Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const dist = 90 + (i % 2) * 28;
              return (
                <motion.span
                  key={i}
                  className="absolute w-16"
                  initial={{ scale: 0.2, x: 0, y: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    scale: [0.2, 1.15, 0.9],
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist * 0.85,
                    opacity: [0, 0.85, 0],
                    rotate: [0, (i % 2 === 0 ? 1 : -1) * 40],
                  }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                >
                  <WingSprite flip={i % 2 === 0} className="w-full" />
                </motion.span>
              );
            })}
          <motion.div
            initial={
              reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0, rotate: -12 }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { scale: [0.4, 1.15, 1], opacity: 1, rotate: 0 }
            }
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="rounded-full bg-romance px-5 py-2 font-display text-sm font-extrabold tracking-wide text-white shadow-card"
          >
            Winged
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
