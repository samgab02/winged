"use client";

import { AlertCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WingedMark } from "@/components/brand/winged-mark";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <motion.div
        animate={reduced ? undefined : { y: [0, -5, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <WingedMark className="h-10 w-10" />
      </motion.div>
      <p className="text-sm font-medium text-secondary">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center"
    >
      <motion.div
        className="flex size-16 items-center justify-center rounded-full bg-elevated"
        animate={
          reduced
            ? undefined
            : { y: [0, -8, 0], rotate: [-3, 3, -3] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <WingedMark className="h-9 w-9" />
      </motion.div>
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="max-w-xs text-sm text-secondary">{body}</p>
      {actionLabel && onAction && (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export function ErrorState({
  title = "Something went sideways",
  body = "Something went wrong — try again in a moment.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-romance-soft">
        <AlertCircle className="size-6 text-romance" strokeWidth={1.75} />
      </div>
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="max-w-xs text-sm text-secondary">{body}</p>
      {onRetry && (
        <Button variant="outline" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  );
}
