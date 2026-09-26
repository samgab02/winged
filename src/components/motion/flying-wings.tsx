"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WingSprite } from "@/components/brand/winged-mark";
import { cn } from "@/lib/utils";

type Flyer = {
  id: number;
  /** start off / at edge */
  start: { x: string; y: string };
  size: number;
  duration: number;
  delay: number;
  driftX: number[];
  driftY: number[];
  rotate: number[];
  opacity: number[];
  flip?: boolean;
  flap?: number;
};

/**
 * Large, obvious flying wings for welcome — sprite-based, opacity peaks ≥ 0.35.
 * Not dust motes.
 */
const FLYERS: Flyer[] = [
  {
    id: 1,
    start: { x: "-18%", y: "8%" },
    size: 148,
    duration: 9,
    delay: 0,
    driftX: [0, 70, 40, 90, 0],
    driftY: [0, 30, 70, 20, 0],
    rotate: [-18, -6, 8, -12, -18],
    opacity: [0.2, 0.55, 0.7, 0.45, 0.2],
    flap: 1.15,
  },
  {
    id: 2,
    start: { x: "78%", y: "6%" },
    size: 140,
    duration: 10,
    delay: 0.5,
    driftX: [0, -80, -50, -100, 0],
    driftY: [0, 40, 80, 30, 0],
    rotate: [18, 6, -8, 14, 18],
    opacity: [0.22, 0.6, 0.72, 0.4, 0.22],
    flip: true,
    flap: 1.12,
  },
  {
    id: 3,
    start: { x: "-22%", y: "38%" },
    size: 176,
    duration: 11,
    delay: 0.2,
    driftX: [0, 90, 120, 60, 0],
    driftY: [40, -20, 10, -40, 40],
    rotate: [-22, -8, 4, -16, -22],
    opacity: [0.25, 0.58, 0.65, 0.42, 0.25],
    flap: 1.2,
  },
  {
    id: 4,
    start: { x: "82%", y: "40%" },
    size: 168,
    duration: 11.5,
    delay: 0.8,
    driftX: [0, -95, -110, -55, 0],
    driftY: [30, -30, 0, -50, 30],
    rotate: [22, 10, -4, 16, 22],
    opacity: [0.28, 0.62, 0.68, 0.4, 0.28],
    flip: true,
    flap: 1.18,
  },
  {
    id: 5,
    start: { x: "8%", y: "72%" },
    size: 120,
    duration: 8.5,
    delay: 0.3,
    driftX: [0, 50, 90, 30, 0],
    driftY: [20, -50, -90, -40, 20],
    rotate: [-10, 6, 14, -4, -10],
    opacity: [0.35, 0.65, 0.55, 0.4, 0.35],
    flap: 1.1,
  },
  {
    id: 6,
    start: { x: "68%", y: "74%" },
    size: 124,
    duration: 9,
    delay: 1.1,
    driftX: [0, -55, -85, -25, 0],
    driftY: [10, -60, -100, -30, 10],
    rotate: [12, -4, -14, 8, 12],
    opacity: [0.32, 0.68, 0.58, 0.38, 0.32],
    flip: true,
    flap: 1.14,
  },
  {
    id: 7,
    start: { x: "28%", y: "-8%" },
    size: 110,
    duration: 12,
    delay: 0.6,
    driftX: [0, 40, -20, 50, 0],
    driftY: [0, 80, 140, 90, 0],
    rotate: [-6, 10, -8, 4, -6],
    opacity: [0.2, 0.5, 0.45, 0.35, 0.2],
    flap: 1.08,
  },
  {
    id: 8,
    start: { x: "48%", y: "88%" },
    size: 132,
    duration: 10,
    delay: 1.4,
    driftX: [0, -30, 20, -40, 0],
    driftY: [0, -70, -120, -60, 0],
    rotate: [8, -12, 6, -4, 8],
    opacity: [0.3, 0.6, 0.55, 0.4, 0.3],
    flip: true,
    flap: 1.16,
  },
];

export function FlyingWings({
  className,
  density = "full",
}: {
  className?: string;
  density?: "full" | "light";
}) {
  const reduced = useReducedMotion();
  const set = density === "light" ? FLYERS.slice(0, 4) : FLYERS;

  if (reduced) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          className
        )}
      >
        <WingSprite className="absolute left-[4%] top-[14%] w-28 opacity-40" />
        <WingSprite
          flip
          className="absolute right-[2%] top-[22%] w-32 opacity-45"
        />
        <WingSprite className="absolute left-[8%] bottom-[18%] w-36 opacity-35" />
        <WingSprite
          flip
          className="absolute right-[6%] bottom-[22%] w-28 opacity-40"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {set.map((w) => (
        <motion.div
          key={w.id}
          className="absolute will-change-transform"
          style={{
            top: w.start.y,
            left: w.start.x,
            width: w.size,
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: w.rotate[0],
            opacity: 0,
            scaleY: 1,
          }}
          animate={{
            x: w.driftX,
            y: w.driftY,
            rotate: w.rotate,
            opacity: w.opacity,
            scaleY: [1, 0.82, w.flap ?? 1.12, 0.9, 1],
          }}
          transition={{
            duration: w.duration,
            delay: w.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <WingSprite flip={w.flip} className="h-auto w-full drop-shadow-sm" />
        </motion.div>
      ))}
    </div>
  );
}

/** Soft flutter for interactive CTAs — uses sprite so it reads as a wing */
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
      className={cn("inline-flex", className)}
      animate={
        reduced
          ? undefined
          : {
              rotate: side === "right" ? [0, 14, -8, 0] : [0, -14, 8, 0],
              scaleY: [1, 0.78, 1.12, 1],
            }
      }
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <WingSprite
        flip={side === "left"}
        className="size-5"
      />
    </motion.span>
  );
}

export { WingSprite as WingGlyph };
