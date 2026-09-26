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
import type { DuoCard } from "@/lib/mock-data";
import { PhotoStory } from "@/components/photos/photo-story";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 120;

function CardFace({
  card,
  active,
  exitDirection,
  onSwipe,
  actionLabel,
}: {
  card: DuoCard;
  active: boolean;
  exitDirection?: "left" | "right" | null;
  onSwipe: (dir: "left" | "right") => void;
  actionLabel: { left: string; right: string };
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const likeOpacity = useTransform(x, [50, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -50], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 800) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -800)
      onSwipe("left");
  }

  const { person } = card;

  return (
    <motion.article
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] card-surface",
        active ? "z-20 cursor-grab active:cursor-grabbing" : "z-10"
      )}
      style={{ x: active ? x : 0, rotate: active ? rotate : 0 }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={active ? handleDragEnd : undefined}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: active ? 1 : 0.96, opacity: active ? 1 : 0.45 }}
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
            className="pointer-events-none absolute left-4 top-10 z-30 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-secondary shadow-soft"
            style={{ opacity: nopeOpacity }}
          >
            {actionLabel.left}
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-4 top-10 z-30 rounded-full bg-romance px-3 py-1 text-xs font-bold text-white shadow-soft"
            style={{ opacity: likeOpacity }}
          >
            {actionLabel.right}
          </motion.div>
        </>
      )}

      <PhotoStory photos={person.photos} className="min-h-0 flex-[1.4]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-20">
          <h2 className="font-display text-3xl font-extrabold text-white">
            {person.firstName}
            <span className="ml-2 text-xl font-semibold text-white/85">
              {person.age}
            </span>
          </h2>
          <p className="text-sm text-white/85">{person.city}</p>
        </div>
      </PhotoStory>

      <div className="flex flex-col gap-2.5 bg-surface px-4 py-3.5">
        <p className="text-sm leading-snug text-secondary">{person.vibe}</p>
        <div className="flex flex-wrap gap-1.5">
          {person.interests.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-elevated px-2.5 py-1 text-[11px] font-semibold text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="flex items-start gap-1.5 text-xs font-medium text-subtle">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-romance" />
          <span>
            <span className="text-secondary">Perfect for </span>
            {card.perfectFor}
          </span>
        </p>
        <div className="flex items-center gap-2.5 rounded-2xl bg-shark-soft px-2.5 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.sharkAvatar}
            alt=""
            className="size-9 rounded-full object-cover ring-2 ring-shark/40"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-shark-deep">
              {card.sharkName} is vouching
            </p>
            <p className="truncate text-sm text-foreground">“{card.vouch}”</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function SwipeDeck({
  cards,
  title,
  subtitle,
  rightLabel = "Vouch",
  leftLabel = "Skip",
  onEmptyAction,
}: {
  cards: DuoCard[];
  title: string;
  subtitle: string;
  rightLabel?: string;
  leftLabel?: string;
  onEmptyAction?: () => void;
}) {
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
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-secondary">{subtitle}</p>
      </header>

      <div className="relative mx-auto aspect-[3/4.6] w-full max-h-[min(66dvh,600px)]">
        {next && (
          <CardFace
            key={next.id + "-n"}
            card={next}
            active={false}
            onSwipe={() => {}}
            actionLabel={{ left: leftLabel, right: rightLabel }}
          />
        )}
        <AnimatePresence onExitComplete={() => setExitDirection(null)}>
          {top ? (
            <CardFace
              key={top.id}
              card={top}
              active
              exitDirection={exitDirection}
              onSwipe={handleSwipe}
              actionLabel={{ left: leftLabel, right: rightLabel }}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] card-surface px-8 text-center"
            >
              <p className="font-display text-xl font-extrabold">
                You’re caught up
              </p>
              <p className="mt-2 text-sm text-secondary">
                Fresh faces drop as Sharks vouch. Check Matches if something
                sparked.
              </p>
              <button
                type="button"
                className="mt-5 text-sm font-bold text-romance"
                onClick={() => {
                  setStack(cards);
                  onEmptyAction?.();
                }}
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
          aria-label={leftLabel}
          disabled={!top}
          onClick={() => top && handleSwipe("left")}
          className="flex size-14 items-center justify-center rounded-full border border-border bg-surface text-secondary shadow-soft disabled:opacity-40"
        >
          <X className="size-5" />
        </button>
        <button
          type="button"
          aria-label={rightLabel}
          disabled={!top}
          onClick={() => top && handleSwipe("right")}
          className={cn(
            "flex size-16 items-center justify-center rounded-full bg-romance text-white shadow-card disabled:opacity-40",
            pulse && "animate-heart-pulse"
          )}
        >
          <Heart className="size-6 fill-white" />
        </button>
      </div>
    </section>
  );
}
