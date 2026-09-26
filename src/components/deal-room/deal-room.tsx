"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Headphones, MapPin, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WingBloom } from "@/components/motion/wing-bloom";
import { PageEnter } from "@/components/motion/page-enter";
import { mockDealMessages, people } from "@/lib/mock-data";
import { useSession } from "@/lib/store";
import { cn, formatCountdown } from "@/lib/utils";

type Mode = "wing" | "bachelor";

const VENUES = [
  { id: "xo", name: "Cafe Xo, Florentin", when: "Thu · 20:00" },
  { id: "port", name: "The Port, Jaffa", when: "Fri · 19:30" },
  { id: "roof", name: "Norman Rooftop", when: "Sat · 21:00" },
];

export function DealRoomPanel({
  mode,
  matchId = "match_maya_eli",
}: {
  mode: Mode;
  matchId?: string;
}) {
  const lockDate = useSession((s) => s.lockDate);
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState(mockDealMessages);
  const [draft, setDraft] = useState("");
  const [endsAt] = useState(() => Date.now() + 135_000);
  const [secondsLeft, setSecondsLeft] = useState(135);
  const [locked, setLocked] = useState(false);
  const [bloom, setBloom] = useState(false);
  const [venueId, setVenueId] = useState("xo");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const venue = VENUES.find((v) => v.id === venueId) ?? VENUES[0];

  const progress = useMemo(
    () => Math.max(0, Math.min(1, secondsLeft / 180)),
    [secondsLeft]
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.round((endsAt - Date.now()) / 1000)));
    }, 400);
    return () => clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (mode !== "bachelor" || locked) return;
    const id = setInterval(() => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1600);
    }, 9000);
    return () => clearInterval(id);
  }, [mode, locked]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const expired = secondsLeft <= 0 && !locked;
  const lowTime = !locked && secondsLeft > 0 && secondsLeft <= 30;

  function send() {
    const body = draft.trim();
    if (!body || locked || expired) return;
    if (mode === "bachelor") {
      setMessages((prev) => [
        ...prev,
        { id: `ear_${Date.now()}`, role: "earpiece", name: "Maya", body },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `sh_${Date.now()}`,
          role: "wing",
          name: "Noa",
          body,
          self: true,
        },
      ]);
    }
    setDraft("");
  }

  function onLock() {
    setLocked(true);
    setBloom(true);
    setTimeout(() => setBloom(false), 900);
    lockDate(matchId);
    setMessages((prev) => [
      ...prev,
      {
        id: `lock_${Date.now()}`,
        role: "system",
        name: "Winged",
        body: `Locked · ${venue.name} · ${venue.when}`,
      },
    ]);
  }

  const flashHref =
    mode === "bachelor"
      ? `/bachelor/flash/${matchId}`
      : `/wing/flash/${matchId}`;

  return (
    <PageEnter className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3">
      <WingBloom show={bloom} />
      <header className="mb-3 flex flex-col items-center text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {mode === "wing" ? "Plan the date" : "They’re planning"}
        </h1>
        <p className="mt-0.5 text-sm text-secondary">Maya × Eli</p>
        <div className="mt-3">
          <motion.div
            className="relative mx-auto mb-1 size-14 rounded-full p-[2.5px]"
            animate={
              !reduced && !locked && !expired
                ? { scale: lowTime ? [1, 1.06, 1] : [1, 1.03, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: lowTime ? 0.7 : 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={
              {
                background: `conic-gradient(${
                  lowTime || expired ? "var(--romance)" : "var(--wing)"
                } calc(${progress} * 1turn), var(--border) 0)`,
              } as CSSProperties
            }
          >
            <div className="flex size-full items-center justify-center rounded-full bg-surface">
              <span
                className={cn(
                  "font-mono text-sm font-bold tabular-nums",
                  lowTime || expired ? "text-romance" : "text-foreground"
                )}
              >
                {formatCountdown(secondsLeft)}
              </span>
            </div>
          </motion.div>
          <p className="text-[11px] font-medium text-subtle">
            {locked ? "Locked" : expired ? "Ended" : "left"}
          </p>
        </div>
      </header>

      <div className="mb-3 flex flex-col items-center gap-2 text-center">
        <div className="flex -space-x-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={people.maya.photos[0]}
            alt=""
            className="size-12 rounded-full object-cover ring-2 ring-canvas"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={people.eli.photos[0]}
            alt=""
            className="size-12 rounded-full object-cover ring-2 ring-canvas"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center justify-center gap-1 text-sm font-semibold">
            <MapPin className="size-3.5 text-wing" />
            {venue.name}
          </p>
          <p className="text-sm text-secondary">{venue.when}</p>
        </div>
      </div>

      {mode === "wing" && !locked && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {VENUES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVenueId(v.id)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-left text-xs",
                venueId === v.id
                  ? "border-wing bg-wing-soft"
                  : "border-border bg-surface"
              )}
            >
              <span className="block font-semibold">{v.name}</span>
              <span className="text-subtle">{v.when}</span>
            </button>
          ))}
        </div>
      )}

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-2xl bg-surface p-3 shadow-soft"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={cn(
                "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-snug",
                m.role === "system" &&
                  "mx-auto max-w-full bg-elevated text-center text-xs font-medium text-secondary",
                m.role === "earpiece" &&
                  "border border-border bg-elevated text-secondary",
                m.role === "wing" &&
                  ("self" in m && m.self
                    ? "ml-auto bg-romance-soft"
                    : "bg-wing-soft")
              )}
            >
              {m.role === "earpiece" && (
                <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-subtle">
                  <Headphones className="size-3.5" /> Whisper · {m.name}
                </span>
              )}
              {m.role === "wing" && (
                <span className="mb-0.5 block text-[11px] font-semibold text-subtle">
                  {m.name}
                </span>
              )}
              {m.body}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <p className="text-xs font-medium text-subtle">Dani is typing…</p>
        )}
      </div>

      <div className="mt-3 space-y-2 safe-bottom">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={locked || expired}
            placeholder={
              mode === "bachelor"
                ? "Whisper to your Wing…"
                : "Message the other Wing…"
            }
            className="h-12 flex-1 rounded-2xl border border-border bg-surface px-3.5 text-sm outline-none focus:border-romance/40"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={send}
            disabled={!draft.trim() || locked || expired}
            className="rounded-2xl"
          >
            <Send className="size-4" />
          </Button>
        </div>

        {mode === "wing" ? (
          locked ? (
            <Link href={flashHref}>
              <Button className="w-full">
                <Sparkles className="size-4" /> Open chemistry flash
              </Button>
            </Link>
          ) : (
            <Button className="w-full" onClick={onLock} disabled={expired}>
              Lock the date
            </Button>
          )
        ) : locked ? (
          <Link href={flashHref}>
            <Button className="w-full">Join chemistry flash</Button>
          </Link>
        ) : (
          <p className="rounded-2xl bg-elevated px-3 py-2.5 text-center text-xs text-secondary">
            You’re on earpiece — whisper anytime. Only Wings can lock.
          </p>
        )}
      </div>
    </PageEnter>
  );
}
