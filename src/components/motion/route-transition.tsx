"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPRITE = "/brand/winged-sprite-wing.png";
/** Corner accents only — keep under ~450ms */
const CORNER_MS = 380;

/**
 * Light route change: content fades without blur filters;
 * small wing accents roost briefly in the four corners, then unmount.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const reactId = useId();
  const prevPathRef = useRef(pathname);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [cornerKey, setCornerKey] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    // Hard-clear any leftover filter from a prior transition
    const el = contentRef.current;
    if (el) {
      el.style.filter = "none";
      el.style.backdropFilter = "none";
      el.style.setProperty("-webkit-backdrop-filter", "none");
    }

    if (reduced) {
      setCornerKey(null);
      return;
    }

    const key = `${pathname}-${Date.now()}-${reactId}`;
    setCornerKey(key);

    hideTimerRef.current = setTimeout(() => {
      setCornerKey(null);
      hideTimerRef.current = null;
    }, CORNER_MS);

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

  function clearContentFilters() {
    const el = contentRef.current;
    if (!el) return;
    // Drop Framer-applied filter so nothing stays soft after settle
    el.style.removeProperty("filter");
    el.style.removeProperty("backdrop-filter");
    el.style.removeProperty("-webkit-backdrop-filter");
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          ref={contentRef}
          className="flex min-h-0 flex-1 flex-col [filter:none!important] [backdrop-filter:none!important]"
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: 8 }
          }
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: reduced ? 0.15 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.1 } }
              : {
                  opacity: 0,
                  y: -6,
                  transition: { duration: 0.16 },
                }
          }
          onAnimationComplete={clearContentFilters}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {cornerKey && !reduced ? (
          <CornerWingAccents
            key={cornerKey}
            onFinished={() => {
              setCornerKey((k) => (k === cornerKey ? null : k));
              clearContentFilters();
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CornerWingAccents({ onFinished }: { onFinished: () => void }) {
  const finishedRef = useRef(false);
  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished();
  }

  const corners: {
    className: string;
    style?: CSSProperties;
    rotate: number;
  }[] = [
    { className: "left-1 top-2", rotate: -28 },
    {
      className: "right-1 top-2 -scale-x-100",
      rotate: 28,
    },
    {
      className: "bottom-16 left-1 -scale-y-100",
      rotate: -22,
    },
    {
      className: "bottom-16 right-1 -scale-x-100 -scale-y-100",
      rotate: 22,
    },
  ];

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{
        opacity: [0, 1, 1, 0],
        transition: {
          duration: CORNER_MS / 1000,
          times: [0, 0.15, 0.7, 1],
          ease: "easeOut",
        },
      }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      onAnimationComplete={finish}
      aria-hidden
    >
      {corners.map((c, i) => (
        <motion.img
          key={i}
          src={SPRITE}
          alt=""
          className={`absolute size-14 object-contain opacity-70 sm:size-16 ${c.className}`}
          style={{
            filter: "drop-shadow(0 2px 8px rgba(42,36,33,0.1))",
          }}
          initial={{ opacity: 0, scale: 0.7, rotate: c.rotate - 8 }}
          animate={{
            opacity: [0, 0.75, 0.75, 0],
            scale: [0.7, 1, 1, 0.85],
            rotate: [c.rotate - 8, c.rotate, c.rotate, c.rotate + 4],
          }}
          transition={{
            duration: CORNER_MS / 1000,
            times: [0, 0.2, 0.65, 1],
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.02,
          }}
        />
      ))}
    </motion.div>
  );
}
