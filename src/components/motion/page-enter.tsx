"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { pageEnter, pageEnterReduced } from "@/lib/motion";

export function PageEnter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  function clearFilters() {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("filter");
    el.style.removeProperty("backdrop-filter");
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={reduced ? pageEnterReduced : pageEnter}
      initial="initial"
      animate="animate"
      exit="exit"
      onAnimationComplete={clearFilters}
    >
      {children}
    </motion.div>
  );
}
