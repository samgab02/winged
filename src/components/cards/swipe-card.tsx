"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { DuoCard } from "@/lib/mock-data";
import { PhotoStory } from "@/components/photos/photo-story";
import { WingBloom } from "@/components/motion/wing-bloom";
import { PageEnter } from "@/components/motion/page-enter";
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
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-7, 7]);
  const likeOpacity = useTransform(x, [40, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-130, -40], [1, 0]);
  const trailOpacity = useTransform(x, [-80, 0, 80], [0.35, 0, 0.35]);
  const photoParallax = useTransform(x, [-220, 220], [12, -12]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 800) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -800)
      onSwipe("left");
  }

  const { person } = card;

  return (
    <motion.article
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[1.5rem] bg-black shadow-card",
        active ? "z-20 cursor-grab active:cursor-grabbing" : "z-10"
      )}
      style={{ x: active ? x : 0, rotate: active && !reduced ? rotate : 0 }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={active ? handleDragEnd : undefined}
      initial={{ scale: 0.985, opacity: 0 }}
      animate={{ scale: active ? 1 : 0.97, opacity: active ? 1 : 0.4 }}
      exit={{
        x: exitDirection === "right" ? 460 : -460,
        opacity: 0,
        rotate: exitDirection === "right" ? 12 : -12,
        transition: { type: "spring", stiffness: 260, damping: 30 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {active && !reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-10 left-1/2 z-10 w-24 -translate-x-1/2 rounded-full bg-romance/25 blur-2xl"
          style={{ opacity: trailOpacity, x }}
        />
      )}

      {active && (
        <>
          <motion.div
            className="pointer-events-none absolute left-5 top-12 z-30 border border-white/70 px-3 py-1 font-display text-sm font-extrabold uppercase tracking-wide text-white"
            style={{ opacity: nopeOpacity, rotate: -8 }}
          >
            {actionLabel.left}
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-5 top-12 z-30 bg-romance px-3 py-1 font-display text-sm font-extrabold uppercase tracking-wide text-white"
            style={{ opacity: likeOpacity, rotate: 8 }}
          >
            {actionLabel.right}
          </motion.div>
        </>
      )}

      <motion.div
        className="absolute inset-0"
        style={active && !reduced ? { x: photoParallax } : undefined}
      >
        <PhotoStory photos={person.photos} className="absolute inset-0 h-full w-full">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-5 pt-28">
            <h2 className="font-display text-[2rem] font-extrabold leading-none text-white">
              {person.firstName}
              <span className="ml-2 text-xl font-semibold text-white/80">
                {person.age}
              </span>
            </h2>
            <p className="mt-1 text-sm text-white/75">{person.city}</p>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-snug text-white/92">
              {person.vibe}
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.wingAvatar}
                alt=""
                className="size-8 rounded-full object-cover ring-2 ring-wing/60"
              />
              <p className="text-sm text-white/90">
                <span className="font-semibold text-wing">{card.wingName}</span>
                {" · "}
                <span className="text-white/80">“{card.vouch}”</span>
              </p>
            </div>
          </div>
        </PhotoStory>
      </motion.div>
    </motion.article>
  );
}

export function SwipeDeck({
  cards,
  title,
  subtitle,
  rightLabel = "Vouch",
  leftLabel = "Pass",
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
  const [bloom, setBloom] = useState(false);
  const reduced = useReducedMotion();

  function handleSwipe(dir: "left" | "right") {
    setExitDirection(dir);
    if (dir === "right") {
      setBloom(true);
      setTimeout(() => setBloom(false), 720);
    }
    setStack((prev) => prev.slice(1));
  }

  const top = stack[0];
  const next = stack[1];

  return (
    <PageEnter className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 pt-2">
      <header className="mb-3 w-full text-center">
        <motion.h1
          layout
          className="font-display text-2xl font-extrabold tracking-tight"
        >
          {title}
        </motion.h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          {subtitle}
        </p>
      </header>

      <div className="relative mx-auto aspect-[3/4.7] w-full max-w-[22rem] max-h-[min(70dvh,640px)]">
        <WingBloom show={bloom} />
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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.5rem] bg-surface px-8 text-center shadow-card"
            >
              <motion.div
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -6, 0], rotate: [-2, 2, -2] }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="mb-3 text-3xl"
                aria-hidden
              >
                ✦
              </motion.div>
              <p className="font-display text-2xl font-extrabold">
                You’re caught up
              </p>
              <p className="mt-2 text-sm text-secondary">
                New people appear as Wings vouch. Check Matches for anything
                mutual.
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="mt-6 text-sm font-bold text-romance"
                onClick={() => setStack(cards)}
              >
                See people again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-stretch justify-center gap-3 safe-bottom">
        <motion.button
          type="button"
          disabled={!top}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          onClick={() => top && handleSwipe("left")}
          className="h-12 min-w-[7.5rem] rounded-full border border-border bg-surface px-5 text-sm font-bold text-secondary shadow-soft disabled:opacity-40"
        >
          {leftLabel}
        </motion.button>
        <motion.button
          type="button"
          disabled={!top}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          onClick={() => top && handleSwipe("right")}
          className="h-12 min-w-[9rem] rounded-full bg-romance px-6 text-sm font-bold text-white shadow-card disabled:opacity-40"
        >
          {rightLabel}
        </motion.button>
      </div>
    </PageEnter>
  );
}
