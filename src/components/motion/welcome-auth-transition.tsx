"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WingSprite } from "@/components/brand/winged-mark";
import {
  WELCOME_AUTH_EASE,
  WELCOME_AUTH_FLAG,
  WELCOME_AUTH_MS,
  finishWelcomeAuthTransition,
  getWelcomeAuthTransition,
  subscribeWelcomeAuthTransition,
} from "@/lib/welcome-auth-transition";

function useWelcomeAuthState() {
  return useSyncExternalStore(
    subscribeWelcomeAuthTransition,
    getWelcomeAuthTransition,
    () => ({ active: false, href: null, fadeAmbient: false })
  );
}

/**
 * Fixed portal: escort wing flies left→right (~2× viewport) while
 * the auth page slides in. Survives welcome unmount.
 */
export function WelcomeAuthTransitionHost() {
  const state = useWelcomeAuthState();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!state.active || !state.href) return;

    if (reduced) {
      router.push(state.href);
      finishWelcomeAuthTransition();
      return;
    }

    // Push once the wing/page motion is underway so auth can slide in sync
    const navAt = window.setTimeout(() => {
      router.push(state.href!);
    }, Math.round(WELCOME_AUTH_MS * 0.28));

    const doneAt = window.setTimeout(() => {
      finishWelcomeAuthTransition();
    }, WELCOME_AUTH_MS + 80);

    return () => {
      window.clearTimeout(navAt);
      window.clearTimeout(doneAt);
    };
  }, [state.active, state.href, reduced, router]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {state.active && !reduced ? (
        <motion.div
          key="welcome-auth-escort"
          className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          aria-hidden
        >
          {/* Escort wing: left → right across ~2× screen width */}
          <motion.div
            className="absolute top-[38%] will-change-transform"
            style={{ width: "min(42vw, 200px)" }}
            initial={{ x: "-15vw", y: 0, rotate: -22, opacity: 0.55 }}
            animate={{
              x: ["-15vw", "40vw", "100vw", "185vw"],
              y: [0, -14, -6, 10],
              rotate: [-22, -10, 4, 16],
              opacity: [0.55, 0.95, 0.7, 0],
              scaleY: [1, 0.82, 1.16, 0.95],
            }}
            transition={{
              duration: WELCOME_AUTH_MS / 1000,
              times: [0, 0.28, 0.6, 1],
              ease: WELCOME_AUTH_EASE,
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

/**
 * Wrap auth pages so they enter right→left when coming from welcome.
 * Never leaves opacity at 0 — starts partially visible.
 */
function readWelcomeAuthFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(WELCOME_AUTH_FLAG);
    if (!raw) return false;
    const data = JSON.parse(raw) as { t?: number };
    return Boolean(data.t && Date.now() - data.t < WELCOME_AUTH_MS + 500);
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
  // Sync read so the first client paint already slides (no blank / skipped enter)
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
        duration: (WELCOME_AUTH_MS * 0.72) / 1000,
        ease: WELCOME_AUTH_EASE,
      }}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
