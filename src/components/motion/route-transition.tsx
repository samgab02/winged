"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPRITE = "/brand/winged-sprite-wing.png";
/** Side wings linger and fade slowly while the page is already visible */
const WING_MS = 2200;

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
    }, WING_MS + 160);

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

/**
 * Anatomical left wing on the LEFT edge, right wing on the RIGHT.
 * Sprite faces right by default → flip on the left side.
 */
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
          times: [0, 0.12, 0.58, 1],
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      onAnimationComplete={finish}
      aria-hidden
    >
      {/* LEFT wing — mirrored so feathers read as left side */}
      <motion.img
        src={SPRITE}
        alt=""
        data-route-wing="left"
        className="absolute left-[-8px] top-1/2 size-[4.75rem] -translate-y-1/2 -scale-x-100 object-contain sm:size-[5.25rem]"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(42,36,33,0.12))",
        }}
        initial={{ opacity: 0, x: -28, rotate: 18 }}
        animate={{
          opacity: [0, 0.9, 0.85, 0.55, 0],
          x: [-28, 0, 0, -6, -14],
          rotate: [18, 10, 10, 14, 16],
        }}
        transition={{
          duration: WING_MS / 1000,
          times: [0, 0.14, 0.45, 0.72, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      {/* RIGHT wing — natural sprite orientation */}
      <motion.img
        src={SPRITE}
        alt=""
        data-route-wing="right"
        className="absolute right-[-8px] top-1/2 size-[4.75rem] -translate-y-1/2 object-contain sm:size-[5.25rem]"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(42,36,33,0.12))",
        }}
        initial={{ opacity: 0, x: 28, rotate: -18 }}
        animate={{
          opacity: [0, 0.9, 0.85, 0.55, 0],
          x: [28, 0, 0, 6, 14],
          rotate: [-18, -10, -10, -14, -16],
        }}
        transition={{
          duration: WING_MS / 1000,
          times: [0, 0.14, 0.45, 0.72, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.div>
  );
}
