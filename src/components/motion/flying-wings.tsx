"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Single feather-wing silhouette (no tile) */
function WingGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      className={cn("block", className)}
      aria-hidden
    >
      <path
        d="M4 36c10-3 18-11 23-20 1.5-2.8 4.6-3.6 7.2-2.2 1.8.9 2.6 2.9 2.1 4.8C34.8 25 30.5 31.5 24 36.5 19.8 39.8 14 42 8.2 43c-.9.1-1.5-.6-1.3-1.4.2-1.5.9-3.2 1.8-5.1Z"
        fill="currentColor"
      />
      <path
        d="M28 10c4 1.6 8.4 5.4 11.6 11.2 1.2 2.2.1 4.8-2.1 5.6l-3.6 1.5c-1.9.8-4-.4-4.4-2.4L27.8 17c-.5-2 .8-4 2.8-4.7.1 0 .2-.1.3-.1Z"
        fill="currentColor"
        opacity=".92"
      />
      <path
        d="M36 6c5.4 2.6 11 8.2 14.6 16 1.1 2.2-.1 4.8-2.4 5.4l-2.8.8c-1.7.5-3.5-.7-3.8-2.4l-1.2-6.6c-.4-2.2 1-4.3 3.2-5 .2 0 .4-.1.6-.2Z"
        fill="currentColor"
        opacity=".75"
      />
      <path
        d="M44 4c4.2 2.8 8.4 8 11.2 14.8.8 1.9-.3 4-2.2 4.5l-1.8.6c-1.3.4-2.7-.4-3-1.7L47 16.4c-.4-1.7.6-3.4 2.3-3.9.2 0 .4-.1.6-.2Z"
        fill="currentColor"
        opacity=".55"
      />
    </svg>
  );
}

type Flyer = {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotate: number;
  opacity: number;
  color: string;
  flip?: boolean;
};

const FLYERS: Flyer[] = [
  {
    id: 1,
    top: "8%",
    left: "-6%",
    size: 72,
    duration: 14,
    delay: 0,
    driftX: 42,
    driftY: 18,
    rotate: -8,
    opacity: 0.14,
    color: "var(--romance)",
  },
  {
    id: 2,
    top: "22%",
    left: "78%",
    size: 56,
    duration: 16,
    delay: 1.2,
    driftX: -36,
    driftY: 22,
    rotate: 12,
    opacity: 0.12,
    color: "var(--wing)",
    flip: true,
  },
  {
    id: 3,
    top: "48%",
    left: "-4%",
    size: 88,
    duration: 18,
    delay: 0.6,
    driftX: 48,
    driftY: -16,
    rotate: -14,
    opacity: 0.1,
    color: "var(--text-primary)",
  },
  {
    id: 4,
    top: "62%",
    left: "72%",
    size: 64,
    duration: 15,
    delay: 2,
    driftX: -40,
    driftY: -20,
    rotate: 8,
    opacity: 0.13,
    color: "var(--romance)",
    flip: true,
  },
  {
    id: 5,
    top: "78%",
    left: "18%",
    size: 48,
    duration: 12,
    delay: 0.3,
    driftX: 28,
    driftY: -24,
    rotate: -6,
    opacity: 0.11,
    color: "var(--wing)",
  },
  {
    id: 6,
    top: "12%",
    left: "42%",
    size: 40,
    duration: 11,
    delay: 1.8,
    driftX: 20,
    driftY: 28,
    rotate: 16,
    opacity: 0.09,
    color: "var(--text-primary)",
  },
];

/** Ambient flying wings — elegant, transform/opacity only */
export function FlyingWings({
  className,
  density = "full",
}: {
  className?: string;
  density?: "full" | "light";
}) {
  const reduced = useReducedMotion();
  const set = density === "light" ? FLYERS.slice(0, 3) : FLYERS;

  if (reduced) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden opacity-40",
          className
        )}
      >
        <WingGlyph className="absolute left-[8%] top-[18%] size-14 text-romance/30" />
        <WingGlyph className="absolute right-[10%] top-[55%] size-12 scale-x-[-1] text-wing/30" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {set.map((w) => (
        <motion.div
          key={w.id}
          className="absolute"
          style={{
            top: w.top,
            left: w.left,
            width: w.size,
            color: w.color,
            opacity: w.opacity,
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: w.rotate,
            scaleY: 1,
          }}
          animate={{
            x: [0, w.driftX, 0],
            y: [0, w.driftY, 0],
            rotate: [w.rotate, w.rotate + 10, w.rotate - 6, w.rotate],
            scaleY: [1, 0.86, 1.06, 1],
          }}
          transition={{
            duration: w.duration,
            delay: w.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <WingGlyph className={cn("w-full", w.flip && "scale-x-[-1]")} />
        </motion.div>
      ))}
    </div>
  );
}

/** Soft flutter for interactive CTAs */
export function FlutterWing({
  className,
  side = "right",
}: {
  className?: string;
  side?: "left" | "right";
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={cn("inline-flex text-current", className)}
      animate={
        reduced
          ? undefined
          : { rotate: side === "right" ? [0, 8, -4, 0] : [0, -8, 4, 0], scaleY: [1, 0.9, 1.05, 1] }
      }
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <WingGlyph
        className={cn("size-4", side === "left" && "scale-x-[-1]")}
      />
    </motion.span>
  );
}

export { WingGlyph };
