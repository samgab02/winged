"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/store";

export function ToastHost() {
  const toast = useApp((s) => s.toast);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl bg-[#1A1A1A] px-4 py-3 text-sm font-medium text-white shadow-card"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
