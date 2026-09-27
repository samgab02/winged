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
    start: { x: "-20%", y: "4%" },
    size: 190,
    duration: 7.5,
    delay: 0,
    driftX: [0, 90, 50, 110, 0],
    driftY: [0, 40, 90, 30, 0],
    rotate: [-22, -4, 12, -14, -22],
    opacity: [0.45, 0.82, 0.9, 0.65, 0.45],
    flap: 1.22,
  },
  {
    id: 2,
    start: { x: "72%", y: "2%" },
    size: 180,
    duration: 8,
    delay: 0.35,
    driftX: [0, -100, -60, -120, 0],
    driftY: [0, 50, 100, 40, 0],
    rotate: [22, 4, -12, 16, 22],
    opacity: [0.48, 0.85, 0.92, 0.62, 0.48],
    flip: true,
    flap: 1.2,
  },
  {
    id: 3,
    start: { x: "-26%", y: "34%" },
    size: 220,
    duration: 9,
    delay: 0.15,
    driftX: [0, 110, 140, 70, 0],
    driftY: [50, -30, 20, -50, 50],
    rotate: [-26, -6, 8, -18, -26],
    opacity: [0.5, 0.88, 0.95, 0.6, 0.5],
    flap: 1.25,
  },
  {
    id: 4,
    start: { x: "78%", y: "36%" },
    size: 210,
    duration: 9.5,
    delay: 0.55,
    driftX: [0, -115, -130, -70, 0],
    driftY: [40, -40, 10, -60, 40],
    rotate: [26, 8, -6, 18, 26],
    opacity: [0.52, 0.9, 0.95, 0.58, 0.52],
    flip: true,
    flap: 1.24,
  },
  {
    id: 5,
    start: { x: "2%", y: "68%" },
    size: 160,
    duration: 7,
    delay: 0.25,
    driftX: [0, 70, 110, 40, 0],
    driftY: [30, -70, -110, -50, 30],
    rotate: [-14, 8, 18, -6, -14],
    opacity: [0.55, 0.9, 0.8, 0.6, 0.55],
    flap: 1.18,
  },
  {
    id: 6,
    start: { x: "62%", y: "70%" },
    size: 166,
    duration: 7.5,
    delay: 0.7,
    driftX: [0, -75, -105, -35, 0],
    driftY: [20, -80, -120, -40, 20],
    rotate: [14, -6, -18, 10, 14],
    opacity: [0.55, 0.92, 0.82, 0.58, 0.55],
    flip: true,
    flap: 1.2,
  },
  {
    id: 7,
    start: { x: "22%", y: "-12%" },
    size: 150,
    duration: 10,
    delay: 0.4,
    driftX: [0, 55, -30, 70, 0],
    driftY: [0, 100, 170, 110, 0],
    rotate: [-8, 14, -10, 6, -8],
    opacity: [0.4, 0.78, 0.7, 0.5, 0.4],
    flap: 1.15,
  },
  {
    id: 8,
    start: { x: "42%", y: "86%" },
    size: 170,
    duration: 8,
    delay: 0.9,
    driftX: [0, -45, 30, -55, 0],
    driftY: [0, -90, -150, -70, 0],
    rotate: [10, -16, 8, -6, 10],
    opacity: [0.5, 0.88, 0.75, 0.55, 0.5],
    flip: true,
    flap: 1.22,
  },
  {
    id: 9,
    start: { x: "-10%", y: "52%" },
    size: 140,
    duration: 6.5,
    delay: 1.0,
    driftX: [0, 130, 180, 80, 0],
    driftY: [0, -20, 30, -10, 0],
    rotate: [-16, 0, 12, -8, -16],
    opacity: [0.42, 0.8, 0.7, 0.5, 0.42],
    flap: 1.16,
  },
  {
    id: 10,
    start: { x: "88%", y: "55%" },
    size: 144,
    duration: 6.8,
    delay: 1.2,
    driftX: [0, -140, -190, -90, 0],
    driftY: [0, 25, -15, 20, 0],
    rotate: [16, 0, -12, 8, 16],
    opacity: [0.42, 0.82, 0.72, 0.5, 0.42],
    flip: true,
    flap: 1.16,
  },
];

/** Left-side flyer used as the escort source (id 3 — mid-left, large) */
export const ESCORT_FLYER_ID = 3;

export function FlyingWings({
  className,
  density = "full",
  /** Fade ambient wings (escort id disappears into the portal wing) */
  fadeOut = false,
  hideEscort = false,
}: {
  className?: string;
  density?: "full" | "light";
  fadeOut?: boolean;
  hideEscort?: boolean;
}) {
  const reduced = useReducedMotion();
  const set = density === "light" ? FLYERS.slice(0, 4) : FLYERS;

  if (reduced) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500",
          fadeOut && "opacity-0",
          className
        )}
      >
        <WingSprite className="absolute left-[0%] top-[10%] w-44 opacity-70" />
        <WingSprite
          flip
          className="absolute right-[-4%] top-[18%] w-48 opacity-75"
        />
        <WingSprite className="absolute left-[2%] bottom-[14%] w-52 opacity-65" />
        <WingSprite
          flip
          className="absolute right-[-2%] bottom-[18%] w-44 opacity-70"
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
      {set.map((w) => {
        const isEscort = w.id === ESCORT_FLYER_ID;
        if (hideEscort && isEscort) return null;
        return (
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
            animate={
              fadeOut
                ? {
                    x: w.driftX[0],
                    y: w.driftY[0],
                    rotate: w.rotate[0],
                    opacity: 0,
                    scaleY: 1,
                  }
                : {
                    x: w.driftX,
                    y: w.driftY,
                    rotate: w.rotate,
                    opacity: w.opacity,
                    scaleY: [1, 0.82, w.flap ?? 1.12, 0.9, 1],
                  }
            }
            transition={
              fadeOut
                ? {
                    duration: 0.85,
                    ease: "easeOut",
                  }
                : {
                    duration: w.duration,
                    delay: w.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <WingSprite flip={w.flip} className="h-auto w-full drop-shadow-sm" />
          </motion.div>
        );
      })}
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
