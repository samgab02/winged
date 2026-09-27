"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WingSprite } from "@/components/brand/winged-mark";
import {
  WELCOME_AUTH_EASE,
  WELCOME_AUTH_FLAG,
  WELCOME_AUTH_FLY_AT_MS,
  WELCOME_AUTH_FLY_MS,
  WELCOME_AUTH_MS,
  WELCOME_AUTH_NAV_AT_MS,
  WELCOME_AUTH_SLIDE_MS,
  finishWelcomeAuthTransition,
  getWelcomeAuthServerSnapshot,
  getWelcomeAuthTransition,
  markWelcomeAuthChoreographyArmed,
  setWelcomeAuthPhase,
  subscribeWelcomeAuthTransition,
} from "@/lib/welcome-auth-transition";

function useWelcomeAuthState() {
  return useSyncExternalStore(
    subscribeWelcomeAuthTransition,
    getWelcomeAuthTransition,
    getWelcomeAuthServerSnapshot
  );
}

/**
 * Sequenced welcome→auth (~1.7s):
 * 1) ambient wings fade
 * 2) left wing bird-flies + grows
 * 3) auth page slides in slowly
 */
export function WelcomeAuthTransitionHost() {
  const state = useWelcomeAuthState();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!state.active || !state.href) return;
    // Survive remounts: only arm timers once per transition
    if (state.choreographyArmed) return;

    const href = state.href;
    markWelcomeAuthChoreographyArmed();

    if (reduced) {
      routerRef.current.push(href);
      finishWelcomeAuthTransition();
      return;
    }

    const flyAt = window.setTimeout(() => {
      setWelcomeAuthPhase("fly", { hideEscort: true, escortOn: true });
    }, WELCOME_AUTH_FLY_AT_MS);

    const navAt = window.setTimeout(() => {
      setWelcomeAuthPhase("fly", {
        hideEscort: true,
        escortOn: true,
        slideAway: true,
      });
      routerRef.current.push(href);
    }, WELCOME_AUTH_NAV_AT_MS);

    const doneAt = window.setTimeout(() => {
      finishWelcomeAuthTransition();
    }, WELCOME_AUTH_MS + 120);

    timersRef.current = [flyAt, navAt, doneAt];

    return () => {
      // Keep timers alive across remount — only clear when transition ends
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active, state.href, state.choreographyArmed, reduced]);

  useEffect(() => {
    if (state.active) return;
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, [state.active]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {state.escortOn && !reduced ? (
        <motion.div
          key="welcome-auth-escort"
          data-welcome-auth-escort
          className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          aria-hidden
        >
          <motion.div
            className="absolute top-[36%] will-change-transform"
            style={{
              width: "min(38vw, 180px)",
              transformOrigin: "center center",
            }}
            initial={{
              x: "-12vw",
              y: 0,
              rotate: -28,
              opacity: 0.7,
              scale: 0.75,
            }}
            animate={{
              x: ["-12vw", "18vw", "55vw", "110vw", "195vw"],
              y: [0, -28, 10, -22, 16],
              rotate: [-28, -12, 6, -4, 18],
              opacity: [0.7, 0.95, 1, 0.85, 0],
              scale: [0.75, 1.05, 1.45, 1.9, 2.35],
              scaleY: [1, 0.72, 1.22, 0.78, 1.15, 0.85, 1],
            }}
            transition={{
              duration: WELCOME_AUTH_FLY_MS / 1000,
              times: [0, 0.22, 0.45, 0.72, 1],
              ease: WELCOME_AUTH_EASE,
              scaleY: {
                duration: WELCOME_AUTH_FLY_MS / 1000,
                times: [0, 0.14, 0.28, 0.45, 0.62, 0.8, 1],
                ease: "easeInOut",
              },
            }}
          >
            <WingSprite className="h-auto w-full drop-shadow-md" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function readWelcomeAuthFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(WELCOME_AUTH_FLAG);
    if (!raw) return false;
    const data = JSON.parse(raw) as { t?: number };
    return Boolean(data.t && Date.now() - data.t < WELCOME_AUTH_MS + 800);
  } catch {
    return false;
  }
}

export function AuthEnterFromWelcome({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [fromWelcome] = useState(readWelcomeAuthFlag);

  if (reduced || !fromWelcome) {
    return <div className="min-h-dvh opacity-100">{children}</div>;
  }

  return (
    <motion.div
      className="min-h-dvh opacity-100 will-change-transform"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      transition={{
        duration: WELCOME_AUTH_SLIDE_MS / 1000,
        ease: WELCOME_AUTH_EASE,
      }}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
