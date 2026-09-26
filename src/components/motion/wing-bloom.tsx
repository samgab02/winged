"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Rare celebration bloom for Vouch / Lock / Keep */
export function WingBloom({ show }: { show: boolean }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!reduced &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute size-3 rounded-full bg-romance/80"
                initial={{ scale: 0, x: 0, y: 0, opacity: 0.9 }}
                animate={{
                  scale: [0, 1, 0.4],
                  x: Math.cos((i / 6) * Math.PI * 2) * 72,
                  y: Math.sin((i / 6) * Math.PI * 2) * 52,
                  opacity: [0.9, 0.7, 0],
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ))}
          <motion.div
            initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0, rotate: -12 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { scale: [0.4, 1.12, 1], opacity: 1, rotate: 0 }
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
