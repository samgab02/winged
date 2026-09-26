"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { BadgeCheck, Flame, X, Heart, Sparkles } from "lucide-react";
import type { DualFeedCard, SharkTier } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 120;

const tierLabel: Record<SharkTier, string> = {
  friend_shark: "Friend Shark",
  baby_shark: "Baby Shark",
  pro_matchmaker: "Pro Matchmaker",
  rizz_master: "Rizz Master",
};

function SharkTierBadge({ tier }: { tier: SharkTier | null }) {
  if (!tier) return null;
  const isMaster = tier === "rizz_master" || tier === "pro_matchmaker";
  return (
    <Badge
      className={cn(
        isMaster
          ? "bg-gold/15 text-gold neon-border-gold"
          : "bg-aqua/15 text-aqua neon-border-aqua"
      )}
    >
      <Sparkles className="size-3" />
      {tierLabel[tier]}
    </Badge>
  );
}

function DualCard({
  card,
  onSwipe,
  active,
}: {
  card: DualFeedCard;
  onSwipe: (dir: "left" | "right") => void;
  active: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -40], [1, 0]);
  const glowPink = useTransform(x, [-200, 0], [0.55, 0]);
  const glowAqua = useTransform(x, [0, 200], [0, 0.55]);

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
        "absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-charcoal",
        active ? "cursor-grab active:cursor-grabbing z-20" : "z-10 scale-[0.96] opacity-70"
      )}
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        boxShadow: active
          ? undefined
          : "0 8px 40px rgba(0,0,0,0.45)",
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={active ? handleDragEnd : undefined}
      initial={{ scale: 0.92, opacity: 0, y: 24 }}
      animate={{ scale: active ? 1 : 0.96, opacity: active ? 1 : 0.7, y: 0 }}
      exit={{
        x: x.get() > 0 ? 420 : -420,
        opacity: 0,
        transition: { type: "spring", stiffness: 280, damping: 28 },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      {/* Neon edge glows on drag */}
      {active && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl ring-2 ring-aqua"
            style={{ opacity: glowAqua }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl ring-2 ring-pink"
            style={{ opacity: glowPink }}
          />
          <motion.div
            className="pointer-events-none absolute left-5 top-8 z-40 rounded-lg border-2 border-pink px-3 py-1 text-2xl font-black uppercase tracking-widest text-pink"
            style={{ opacity: nopeOpacity, rotate: -12 }}
          >
            Skip
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-5 top-8 z-40 rounded-lg border-2 border-aqua px-3 py-1 text-2xl font-black uppercase tracking-widest text-aqua"
            style={{ opacity: likeOpacity, rotate: 12 }}
          >
            Vouch
          </motion.div>
        </>
      )}

      {/* 60% Bachelor media */}
      <div className="relative h-[60%] min-h-0 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bachelor.media_urls[0] ?? bachelor.avatar_url}
          alt={bachelor.display_name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-lg">
              {bachelor.display_name}
              <span className="ml-2 text-lg font-bold text-white/80">
                {bachelor.age}
              </span>
            </h2>
            {bachelor.is_verified && (
              <BadgeCheck className="size-5 text-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
            )}
          </div>
          <p className="mt-0.5 text-sm text-white/75">
            {bachelor.city} · Bachelor
          </p>
        </div>
      </div>

      {/* 40% Shark pane */}
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 border-t border-aqua/20 bg-gradient-to-br from-surface via-charcoal to-obsidian p-4">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shark.avatar_url}
            alt={shark.display_name}
            className="size-14 shrink-0 rounded-2xl object-cover ring-2 ring-aqua/50 shadow-[0_0_16px_rgba(0,242,254,0.35)]"
            draggable={false}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold text-aqua">
                {shark.display_name}
              </p>
              <SharkTierBadge tier={shark.shark_tier} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Flame className="size-3.5 text-coral" />
              {shark.notoriety_points.toLocaleString()} notoriety
            </p>
          </div>
        </div>
        <blockquote className="relative flex-1 rounded-2xl bg-white/5 p-3 text-sm leading-relaxed text-foreground/90 neon-border-aqua">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-aqua/80">
            Shark Vouch
          </span>
          “{shark.vouch_quote}”
        </blockquote>
        {bachelor.roast_profile && (
          <p className="line-clamp-2 text-xs text-coral/90">
            <span className="font-bold text-pink">Roast · </span>
            {bachelor.roast_profile}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export function DualCardFeed({ cards }: { cards: DualFeedCard[] }) {
  const [stack, setStack] = useState(cards);
  const [flash, setFlash] = useState<"left" | "right" | null>(null);
  const [emptyPulse, setEmptyPulse] = useState(false);

  function handleSwipe(dir: "left" | "right") {
    setFlash(dir);
    setTimeout(() => setFlash(null), 350);
    setStack((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) setEmptyPulse(true);
      return next;
    });
  }

  const top = stack[0];
  const next = stack[1];

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-aqua">
            Dual Feed
          </p>
          <h1 className="text-xl font-black tracking-tight">Swipe the Duo</h1>
        </div>
        <p className="text-xs text-muted">{stack.length} left</p>
      </header>

      <div
        className={cn(
          "relative mx-auto aspect-[3/4.4] w-full max-h-[min(68dvh,620px)]",
          flash === "right" && "animate-pulse-glow",
          flash === "left" && "animate-shake"
        )}
      >
        {next && (
          <DualCard
            key={next.id + "-next"}
            card={next}
            active={false}
            onSwipe={() => {}}
          />
        )}
        <AnimatePresence>
          {top ? (
            <DualCard
              key={top.id}
              card={top}
              active
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-surface p-8 text-center neon-border-aqua",
                emptyPulse && "animate-pulse-glow"
              )}
            >
              <Sparkles className="mb-3 size-10 text-aqua" />
              <h2 className="text-lg font-black">Feed cleared</h2>
              <p className="mt-2 text-sm text-muted">
                New duos drop when Sharks vouch fresh bachelors. Check Deal Room
                for live locks.
              </p>
              <button
                type="button"
                className="mt-6 text-sm font-bold text-aqua underline-offset-4 hover:underline"
                onClick={() => {
                  setStack(cards);
                  setEmptyPulse(false);
                }}
              >
                Reset demo deck
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 safe-bottom">
        <button
          type="button"
          aria-label="Skip duo"
          disabled={!top}
          onClick={() => top && handleSwipe("left")}
          className="flex size-14 items-center justify-center rounded-full border border-pink/40 bg-pink/10 text-pink shadow-[0_0_20px_rgba(255,8,68,0.25)] transition enabled:active:scale-90 disabled:opacity-40"
        >
          <X className="size-7" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label="Vouch for duo"
          disabled={!top}
          onClick={() => top && handleSwipe("right")}
          className="flex size-16 items-center justify-center rounded-full border border-aqua/50 bg-aqua/15 text-aqua shadow-[0_0_28px_rgba(0,242,254,0.4)] transition enabled:active:scale-90 disabled:opacity-40"
        >
          <Heart className="size-8 fill-aqua" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
