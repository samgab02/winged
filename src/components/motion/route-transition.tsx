"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPRITE = "/brand/winged-sprite-wing.png";
/** Total curtain lifetime including fade-out */
const CURTAIN_MS = 720;
const FADE_OUT_MS = 180;

/**
 * Cinematic route change: oversized wing curtain meets center,
 * peels to screen borders (edge roost), then fully unmounts.
 * Cancels in-flight overlays on every new navigation.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const reactId = useId();
  const prevPathRef = useRef(pathname);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Monotonic key so AnimatePresence always tears down the prior overlay */
  const [curtainKey, setCurtainKey] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    // Cancel any in-flight hide; drop previous overlay immediately via key change
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (reduced) {
      setCurtainKey(null);
      return;
    }

    const key = `${pathname}-${Date.now()}-${reactId}`;
    setCurtainKey(key);

    hideTimerRef.current = setTimeout(() => {
      setCurtainKey(null);
      hideTimerRef.current = null;
    }, CURTAIN_MS);

    return () => {
      if (hideTimerRef.current != null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [pathname, reduced, reactId]);

  // Unmount leftover on shell unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current != null) clearTimeout(hideTimerRef.current);
    };
  }, []);

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
            transition: {
              duration: reduced ? 0.18 : 0.4,
              delay: reduced ? 0 : 0.12,
            },
          }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.12 } }
              : {
                  opacity: 0.55,
                  scale: 0.97,
                  filter: "blur(5px)",
                  transition: { duration: 0.2 },
                }
          }
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {curtainKey && !reduced ? (
          <WingCurtainOverlay
            key={curtainKey}
            onFinished={() => {
              // Drop even if the hide timer was cleared by a fast re-nav
              setCurtainKey((k) => (k === curtainKey ? null : k));
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function WingCurtainOverlay({ onFinished }: { onFinished: () => void }) {
  const finishedRef = useRef(false);
  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished();
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{
        opacity: [1, 1, 0],
        transition: {
          duration: CURTAIN_MS / 1000,
          times: [0, (CURTAIN_MS - FADE_OUT_MS) / CURTAIN_MS, 1],
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      onAnimationComplete={finish}
      aria-hidden
    >
      {/* Soft letterbox flash — ends off-screen */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[5vh] bg-[color-mix(in_srgb,var(--canvas)_92%,var(--text-primary))]"
        initial={{ y: "-100%", opacity: 0.85 }}
        animate={{
          y: ["-100%", "0%", "0%", "-120%"],
          opacity: [0.85, 0.85, 0.85, 0],
        }}
        transition={{
          duration: 0.65,
          times: [0, 0.2, 0.55, 1],
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[5vh] bg-[color-mix(in_srgb,var(--canvas)_92%,var(--text-primary))]"
        initial={{ y: "100%", opacity: 0.85 }}
        animate={{
          y: ["100%", "0%", "0%", "120%"],
          opacity: [0.85, 0.85, 0.85, 0],
        }}
        transition={{
          duration: 0.65,
          times: [0, 0.2, 0.55, 1],
          ease: "easeInOut",
        }}
      />

      {/* Left wing → edge roost → opacity 0 */}
      <motion.img
        src={SPRITE}
        alt=""
        className="absolute top-1/2 h-[min(70vh,520px)] w-auto max-w-none origin-right object-contain"
        style={{ filter: "drop-shadow(0 8px 24px rgba(42,36,33,0.12))" }}
        initial={{ left: "-45%", y: "-50%", rotate: -18, opacity: 0, scale: 1.1 }}
        animate={{
          left: ["-45%", "6%", "-22%"],
          y: "-50%",
          rotate: [-18, -6, -24],
          opacity: [0, 0.92, 0],
          scale: [1.1, 1.22, 0.8],
        }}
        transition={{
          duration: 0.68,
          times: [0, 0.4, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Right wing (mirrored) → opacity 0 */}
      <motion.img
        src={SPRITE}
        alt=""
        className="absolute top-1/2 h-[min(70vh,520px)] w-auto max-w-none origin-left object-contain -scale-x-100"
        style={{ filter: "drop-shadow(0 8px 24px rgba(42,36,33,0.12))" }}
        initial={{ right: "-45%", y: "-50%", rotate: 18, opacity: 0, scale: 1.1 }}
        animate={{
          right: ["-45%", "6%", "-22%"],
          y: "-50%",
          rotate: [18, 6, 24],
          opacity: [0, 0.92, 0],
          scale: [1.1, 1.22, 0.8],
        }}
        transition={{
          duration: 0.68,
          times: [0, 0.4, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Corner roost accents — end at opacity 0 */}
      <motion.img
        src={SPRITE}
        alt=""
        className="absolute size-28 object-contain"
        initial={{
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          scale: 0.4,
          opacity: 0,
        }}
        animate={{
          left: ["50%", "3%"],
          top: ["50%", "7%"],
          x: ["-50%", "0%"],
          y: ["-50%", "0%"],
          scale: [0.4, 1],
          opacity: [0, 0.65, 0],
          rotate: [-30, -12],
        }}
        transition={{ duration: 0.62, times: [0, 0.5, 1] }}
      />
      <motion.img
        src={SPRITE}
        alt=""
        className="absolute size-28 object-contain -scale-x-100"
        initial={{ right: "50%", bottom: "50%", scale: 0.4, opacity: 0 }}
        animate={{
          right: ["50%", "3%"],
          bottom: ["50%", "9%"],
          scale: [0.4, 1],
          opacity: [0, 0.65, 0],
          rotate: [30, 12],
        }}
        transition={{ duration: 0.62, times: [0, 0.5, 1] }}
      />
    </motion.div>
  );
}
