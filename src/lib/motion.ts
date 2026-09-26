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

/** Page / tab content enter — directional feather slide */
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...fadeEase, staggerChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18 },
  },
};

export const pageEnterReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
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
