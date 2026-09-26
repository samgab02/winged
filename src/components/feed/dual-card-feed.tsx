"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Heart, X } from "lucide-react";
import type { DualFeedCard } from "@/types/database";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 120;

function DualCard({
  card,
  onSwipe,
  active,
  exitDirection,
}: {
  card: DualFeedCard;
  onSwipe: (dir: "left" | "right") => void;
  active: boolean;
  exitDirection?: "left" | "right" | null;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [50, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -50], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 800) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -800) {
      onSwipe("left");
    }
  }

  const { bachelor, shark } = card;

  return (
    <motion.article
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        active ? "z-20 cursor-grab active:cursor-grabbing" : "z-10"
      )}
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={active ? handleDragEnd : undefined}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{
        scale: active ? 1 : 0.97,
        opacity: active ? 1 : 0.55,
      }}
      exit={{
        x: exitDirection === "right" ? 420 : -420,
        opacity: 0,
        transition: { type: "spring", stiffness: 260, damping: 32 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      {active && (
        <>
          <motion.div
            className="pointer-events-none absolute left-4 top-4 z-30 rounded-md border border-border bg-surface/90 px-2.5 py-1 text-xs font-medium text-secondary"
            style={{ opacity: nopeOpacity }}
          >
            Skip
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-4 top-4 z-30 rounded-md border border-accent/40 bg-surface/90 px-2.5 py-1 text-xs font-medium text-accent"
            style={{ opacity: likeOpacity }}
          >
            Vouch
          </motion.div>
        </>
      )}

      {/* Dominant bachelor photo */}
      <div className="relative min-h-0 flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bachelor.media_urls[0] ?? bachelor.avatar_url}
          alt={bachelor.display_name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 via-canvas/40 to-transparent px-4 pb-4 pt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
            {bachelor.display_name.split(" ")[0]}
            <span className="ml-2 text-lg font-medium text-white/80">
              {bachelor.age}
            </span>
          </h2>
        </div>
      </div>

      {/* Compact Shark vouch */}
      <div className="flex items-start gap-3 border-t border-border bg-surface px-4 py-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shark.avatar_url}
          alt=""
          className="size-10 shrink-0 rounded-full object-cover"
          draggable={false}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-subtle">
            Shark · {shark.display_name.split("·")[0].trim()}
          </p>
          <p className="mt-0.5 text-sm leading-snug text-secondary">
            “{shark.vouch_quote}”
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function DualCardFeed({ cards }: { cards: DualFeedCard[] }) {
  const [stack, setStack] = useState(cards);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  function handleSwipe(dir: "left" | "right") {
    setExitDirection(dir);
    setStack((prev) => prev.slice(1));
  }

  const top = stack[0];
  const next = stack[1];

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-4">
      <header className="mb-4">
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Feed
        </h1>
        <p className="mt-0.5 text-sm text-secondary">
          Vouch for a duo, or skip.
        </p>
      </header>

      <div className="relative mx-auto aspect-[3/4.2] w-full max-h-[min(64dvh,560px)]">
        {next && (
          <DualCard
            key={next.id + "-next"}
            card={next}
            active={false}
            onSwipe={() => {}}
          />
        )}
        <AnimatePresence onExitComplete={() => setExitDirection(null)}>
          {top ? (
            <DualCard
              key={top.id}
              card={top}
              active
              exitDirection={exitDirection}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-8 text-center"
            >
              <p className="font-display text-lg font-semibold">You’re caught up</p>
              <p className="mt-2 text-sm text-secondary">
                New duos appear when Sharks vouch fresh profiles.
              </p>
              <button
                type="button"
                className="mt-5 text-sm font-medium text-trust"
                onClick={() => setStack(cards)}
              >
                Reset demo deck
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 safe-bottom">
        <button
          type="button"
          aria-label="Skip duo"
          disabled={!top}
          onClick={() => top && handleSwipe("left")}
          className="flex size-14 items-center justify-center rounded-full border border-border bg-surface text-secondary transition enabled:active:scale-95 disabled:opacity-40"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Vouch for duo"
          disabled={!top}
          onClick={() => top && handleSwipe("right")}
          className="flex size-14 items-center justify-center rounded-full bg-accent text-white transition enabled:active:scale-95 disabled:opacity-40"
        >
          <Heart className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </section>
  );
}
