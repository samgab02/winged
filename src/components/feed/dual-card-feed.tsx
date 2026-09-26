"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Heart, Sparkles, X } from "lucide-react";
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
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
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
  const sharkFirst = shark.display_name.split("·")[0].trim().split(" ")[0];

  return (
    <motion.article
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] card-surface",
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
        scale: active ? 1 : 0.96,
        opacity: active ? 1 : 0.5,
      }}
      exit={{
        x: exitDirection === "right" ? 440 : -440,
        opacity: 0,
        transition: { type: "spring", stiffness: 260, damping: 30 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {active && (
        <>
          <motion.div
            className="pointer-events-none absolute left-4 top-4 z-30 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-secondary shadow-soft"
            style={{ opacity: nopeOpacity }}
          >
            Skip
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-4 top-4 z-30 rounded-full bg-romance px-3 py-1 text-xs font-bold text-white shadow-soft"
            style={{ opacity: likeOpacity }}
          >
            Vouch
          </motion.div>
        </>
      )}

      <div className="relative min-h-0 flex-[1.35]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bachelor.media_urls[0] ?? bachelor.avatar_url}
          alt={bachelor.display_name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-4 pt-20">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">
            {bachelor.display_name.split(" ")[0]}
            <span className="ml-2 text-xl font-semibold text-white/85">
              {bachelor.age}
            </span>
          </h2>
          <p className="mt-1 text-sm text-white/85">{bachelor.city}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-surface px-4 py-3.5">
        <p className="text-sm leading-snug text-secondary">
          {bachelor.roast_profile ?? bachelor.bio}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {card.interests.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-elevated px-2.5 py-1 text-[11px] font-semibold text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="flex items-start gap-1.5 text-xs font-medium text-subtle">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-romance" strokeWidth={2} />
          <span>
            <span className="text-secondary">Perfect for </span>
            {card.perfect_for}
          </span>
        </p>

        <div className="flex items-center gap-2.5 rounded-2xl bg-shark-soft px-2.5 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shark.avatar_url}
            alt=""
            className="size-9 rounded-full object-cover ring-2 ring-shark/40"
            draggable={false}
          />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-shark-deep">
              {sharkFirst} is vouching
            </p>
            <p className="truncate text-sm leading-snug text-foreground">
              “{shark.vouch_quote}”
            </p>
          </div>
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
  const [pulse, setPulse] = useState(false);

  function handleSwipe(dir: "left" | "right") {
    setExitDirection(dir);
    if (dir === "right") {
      setPulse(true);
      setTimeout(() => setPulse(false), 450);
    }
    setStack((prev) => prev.slice(1));
  }

  const top = stack[0];
  const next = stack[1];

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3">
      <header className="mb-3">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Who’s next?
        </h1>
        <p className="mt-0.5 text-sm text-secondary">
          Your Shark friend already vetted them — vouch if the vibe hits.
        </p>
      </header>

      <div className="relative mx-auto aspect-[3/4.55] w-full max-h-[min(68dvh,620px)]">
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] card-surface px-8 text-center"
            >
              <p className="font-display text-xl font-extrabold">
                You’re all caught up
              </p>
              <p className="mt-2 text-sm text-secondary">
                Fresh duos drop when friends vouch for someone new. Peek at Deal
                Room if a date is cooking.
              </p>
              <button
                type="button"
                className="mt-5 text-sm font-bold text-romance"
                onClick={() => setStack(cards)}
              >
                Replay demo deck
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-5 safe-bottom">
        <button
          type="button"
          aria-label="Skip"
          disabled={!top}
          onClick={() => top && handleSwipe("left")}
          className="flex size-14 items-center justify-center rounded-full border border-border bg-surface text-secondary shadow-soft transition enabled:active:scale-95 disabled:opacity-40"
        >
          <X className="size-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Vouch"
          disabled={!top}
          onClick={() => top && handleSwipe("right")}
          className={cn(
            "flex size-16 items-center justify-center rounded-full bg-romance text-white shadow-card transition enabled:active:scale-95 disabled:opacity-40",
            pulse && "animate-heart-pulse"
          )}
        >
          <Heart className="size-6 fill-white" strokeWidth={1.75} />
        </button>
      </div>
    </section>
  );
}
