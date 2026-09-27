"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPRITE = "/brand/winged-sprite-wing.png";
/** Side wings linger while the page is already visible */
const WING_MS = 1000;

/**
 * Route change: page content always visible (no AnimatePresence / opacity trap).
 * Left + right wing accents fade slowly after the page is already shown.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const reactId = useId();
  const prevPathRef = useRef(pathname);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wingKey, setWingKey] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (reduced) {
      setWingKey(null);
      return;
    }

    const key = `${pathname}-${Date.now()}-${reactId}`;
    setWingKey(key);

    hideTimerRef.current = setTimeout(() => {
      setWingKey(null);
      hideTimerRef.current = null;
    }, WING_MS + 100);

    return () => {
      if (hideTimerRef.current != null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [pathname, reduced, reactId]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current != null) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Current route content — always mounted, never opacity-gated */}
      <div className="flex min-h-0 flex-1 flex-col opacity-100">
        {children}
      </div>

      <AnimatePresence initial={false}>
        {wingKey && !reduced ? (
          <SideWingAccents
            key={wingKey}
            onFinished={() => {
              setWingKey((k) => (k === wingKey ? null : k));
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** One wing on the left edge, one on the right — slow fade (~1s) */
function SideWingAccents({ onFinished }: { onFinished: () => void }) {
  const finishedRef = useRef(false);
  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished();
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        transition: {
          duration: WING_MS / 1000,
          times: [0, 0.1, 0.4, 1],
          ease: "easeOut",
        },
      }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      onAnimationComplete={finish}
      aria-hidden
    >
      <motion.img
        src={SPRITE}
        alt=""
        className="absolute left-[-6px] top-1/2 size-[4.5rem] -translate-y-1/2 object-contain sm:size-20"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(42,36,33,0.12))",
        }}
        initial={{ opacity: 0, x: -16, rotate: -24 }}
        animate={{
          opacity: [0, 0.85, 0.75, 0],
          x: [-16, 0, 0, -8],
          rotate: [-24, -16, -16, -20],
        }}
        transition={{
          duration: WING_MS / 1000,
          times: [0, 0.12, 0.45, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      <motion.img
        src={SPRITE}
        alt=""
        className="absolute right-[-6px] top-1/2 size-[4.5rem] -translate-y-1/2 -scale-x-100 object-contain sm:size-20"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(42,36,33,0.12))",
        }}
        initial={{ opacity: 0, x: 16, rotate: 24 }}
        animate={{
          opacity: [0, 0.85, 0.75, 0],
          x: [16, 0, 0, 8],
          rotate: [24, 16, 16, 20],
        }}
        transition={{
          duration: WING_MS / 1000,
          times: [0, 0.12, 0.45, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.div>
  );
}
