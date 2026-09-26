"use client";

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
  return (
    <motion.div
      className={className}
      variants={reduced ? pageEnterReduced : pageEnter}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
