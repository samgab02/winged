"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPRITE = "/brand/winged-sprite-wing.png";

/**
 * Cinematic route change: oversized wing curtain meets center,
 * peels to screen borders (edge roost), then settles.
 * Caps interaction block ~750ms. Reduced motion → soft crossfade.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [curtain, setCurtain] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname === prevPath) return;
    setPrevPath(pathname);
    if (reduced) return;
    setCurtain(true);
    const t = window.setTimeout(() => setCurtain(false), 780);
    return () => window.clearTimeout(t);
  }, [pathname, prevPath, reduced]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          className="flex min-h-0 flex-1 flex-col"
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.985, filter: "blur(6px)" }
          }
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: reduced ? 0.18 : 0.42, delay: reduced ? 0 : 0.22 },
          }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.12 } }
              : {
                  opacity: 0.55,
                  scale: 0.97,
                  filter: "blur(5px)",
                  transition: { duration: 0.22 },
                }
          }
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {curtain && !reduced && (
          <motion.div
            key={`curtain-${pathname}`}
            className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            aria-hidden
          >
            {/* Soft letterbox flash */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[6vh] bg-[color-mix(in_srgb,var(--canvas)_92%,var(--text-primary))]"
              initial={{ y: "-100%" }}
              animate={{ y: ["-100%", "0%", "0%", "-110%"] }}
              transition={{ duration: 0.72, times: [0, 0.18, 0.55, 1], ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[6vh] bg-[color-mix(in_srgb,var(--canvas)_92%,var(--text-primary))]"
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "0%", "110%"] }}
              transition={{ duration: 0.72, times: [0, 0.18, 0.55, 1], ease: "easeInOut" }}
            />

            {/* Left wing curtain → edge roost */}
            <motion.img
              src={SPRITE}
              alt=""
              className="absolute top-1/2 h-[min(70vh,520px)] w-auto max-w-none origin-right object-contain"
              style={{ filter: "drop-shadow(0 8px 24px rgba(42,36,33,0.12))" }}
              initial={{ left: "-45%", x: 0, y: "-50%", rotate: -18, opacity: 0.92 }}
              animate={{
                left: ["-45%", "8%", "-18%"],
                x: [0, 0, 0],
                y: ["-50%", "-50%", "-50%"],
                rotate: [-18, -6, -22],
                opacity: [0.92, 0.95, 0.55],
                scale: [1.15, 1.25, 0.85],
              }}
              transition={{ duration: 0.75, times: [0, 0.42, 1], ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Right wing (mirrored) */}
            <motion.img
              src={SPRITE}
              alt=""
              className="absolute top-1/2 h-[min(70vh,520px)] w-auto max-w-none origin-left object-contain"
              style={{
                transform: "scaleX(-1)",
                filter: "drop-shadow(0 8px 24px rgba(42,36,33,0.12))",
              }}
              initial={{ right: "-45%", y: "-50%", rotate: 18, opacity: 0.92 }}
              animate={{
                right: ["-45%", "8%", "-18%"],
                y: ["-50%", "-50%", "-50%"],
                rotate: [18, 6, 22],
                opacity: [0.92, 0.95, 0.55],
                scale: [1.15, 1.25, 0.85],
              }}
              transition={{ duration: 0.75, times: [0, 0.42, 1], ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Corner roost accents */}
            <motion.img
              src={SPRITE}
              alt=""
              className="absolute size-28 object-contain opacity-80"
              initial={{ left: "50%", top: "50%", x: "-50%", y: "-50%", scale: 0.4, opacity: 0 }}
              animate={{
                left: ["50%", "4%"],
                top: ["50%", "8%"],
                x: ["-50%", "0%"],
                y: ["-50%", "0%"],
                scale: [0.4, 1],
                opacity: [0, 0.7, 0],
                rotate: [-30, -12],
              }}
              transition={{ duration: 0.7, times: [0, 0.55, 1] }}
            />
            <motion.img
              src={SPRITE}
              alt=""
              className="absolute size-28 object-contain opacity-80"
              style={{ transform: "scaleX(-1)" }}
              initial={{ right: "50%", bottom: "50%", scale: 0.4, opacity: 0 }}
              animate={{
                right: ["50%", "4%"],
                bottom: ["50%", "10%"],
                scale: [0.4, 1],
                opacity: [0, 0.7, 0],
                rotate: [30, 12],
              }}
              transition={{ duration: 0.7, times: [0, 0.55, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
