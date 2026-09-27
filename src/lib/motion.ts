"use client";

import type { Transition, Variants } from "framer-motion";

export const springSoft: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.85,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
};

export const fadeEase: Transition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

/** Page enter — keep content readable immediately (no opacity-0 trap) */
export const pageEnter: Variants = {
  initial: { opacity: 0.4, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

export const pageEnterReduced: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 1, transition: { duration: 0.01 } },
};

export const listItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: springSoft },
};

export const messageIn: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: springSoft },
};

export function pickVariants(reduced: boolean | null, full: Variants, simple: Variants) {
  return reduced ? simple : full;
}
