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
        "absolute inset-0 overflow-hidden rounded-[1.15rem] bg-[color-mix(in_srgb,var(--canvas)_12%,#1a1514)] shadow-soft",
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
          className="pointer-events-none absolute inset-y-10 left-1/2 z-10 w-24 -translate-x-1/2 rounded-full bg-romance/20 blur-2xl"
          style={{ opacity: trailOpacity, x }}
        />
      )}

      {active && (
        <>
          <motion.div
            className="pointer-events-none absolute left-4 top-10 z-30 border border-white/70 px-3 py-1 font-display text-sm font-extrabold uppercase tracking-wide text-white"
            style={{ opacity: nopeOpacity, rotate: -8 }}
          >
            {actionLabel.left}
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-4 top-10 z-30 bg-romance px-3 py-1 font-display text-sm font-extrabold uppercase tracking-wide text-white"
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
          {/* Extra bottom padding so copy clears overlaid actions */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-[5.25rem] pt-32">
            <h2 className="font-display text-[2.15rem] font-extrabold leading-none text-white">
              {person.firstName}
              <span className="ml-2 text-xl font-semibold text-white/80">
                {person.age}
              </span>
            </h2>
            <p className="mt-1 text-sm text-white/75">{person.city}</p>
            <p className="mt-2.5 max-w-[36ch] text-[15px] leading-snug text-white/92">
              {person.vibe}
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.wingAvatar}
                alt=""
                className="size-7 rounded-full object-cover ring-2 ring-white/25"
              />
              <p className="text-sm text-white/90">
                <span className="font-semibold text-white">{card.wingName}</span>
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
    <PageEnter
      className={cn(
        "relative mx-auto flex w-full max-w-lg flex-1 flex-col",
        "lg:max-w-none lg:h-full"
      )}
    >
      {/*
        Explicit viewport height — absolute card faces need a real height.
        Mobile: header + bottom nav. Desktop: top chrome only (side nav).
      */}
      <div
        className={cn(
          "relative mx-auto w-full px-1 pb-0.5 pt-0.5",
          "h-[calc(100dvh-2.75rem-4.75rem)]",
          "lg:h-[min(calc(100dvh-3.5rem-2rem),780px)] lg:max-w-xl lg:rounded-[1.35rem] lg:shadow-card"
        )}
      >
        {/* Compact chrome on the photo — not a banner slab above */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-3 pt-2.5">
          <p className="rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white/95 backdrop-blur-sm">
            {title}
          </p>
          <p className="max-w-[58%] truncate rounded-full bg-black/20 px-2 py-0.5 text-right text-[10px] font-medium text-white/85 backdrop-blur-sm">
            {subtitle}
          </p>
        </div>

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
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.15rem] panel-soft px-8 text-center"
            >
              <motion.div
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -6, 0], rotate: [-2, 2, -2] }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="mb-3 text-3xl text-romance/70"
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

        {/* Actions overlaid on the card — tight, no chrome slab below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex items-center justify-center gap-3 px-4">
          <motion.button
            type="button"
            disabled={!top}
            whileTap={reduced ? undefined : { scale: 0.94 }}
            onClick={() => top && handleSwipe("left")}
            className="pointer-events-auto h-12 min-w-[6.75rem] rounded-full border border-white/35 bg-black/35 px-5 text-sm font-bold text-white backdrop-blur-md disabled:opacity-40"
          >
            {leftLabel}
          </motion.button>
          <motion.button
            type="button"
            disabled={!top}
            whileTap={reduced ? undefined : { scale: 0.94 }}
            onClick={() => top && handleSwipe("right")}
            className="pointer-events-auto h-12 min-w-[7.5rem] rounded-full bg-romance px-6 text-sm font-bold text-white shadow-soft disabled:opacity-40"
          >
            {rightLabel}
          </motion.button>
        </div>
      </div>
    </PageEnter>
  );
}
