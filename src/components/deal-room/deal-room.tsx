"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockDealMessages, people } from "@/lib/mock-data";
import { useSession } from "@/lib/store";
import { cn, formatCountdown } from "@/lib/utils";

type Mode = "shark" | "bachelor";

export function DealRoomPanel({
  mode,
  matchId = "match_maya_eli",
}: {
  mode: Mode;
  matchId?: string;
}) {
  const lockDate = useSession((s) => s.lockDate);
  const [messages, setMessages] = useState(mockDealMessages);
  const [draft, setDraft] = useState("");
  const [endsAt] = useState(() => Date.now() + 135_000);
  const [secondsLeft, setSecondsLeft] = useState(135);
  const [locked, setLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const expired = secondsLeft <= 0 && !locked;
  const lowTime = !locked && secondsLeft > 0 && secondsLeft <= 30;

  function send() {
    const body = draft.trim();
    if (!body || locked || expired) return;
    if (mode === "bachelor") {
      setMessages((prev) => [
        ...prev,
        {
          id: `ear_${Date.now()}`,
          role: "earpiece",
          name: "Maya",
          body,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `sh_${Date.now()}`,
          role: "shark",
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
    lockDate(matchId);
    setMessages((prev) => [
      ...prev,
      {
        id: `lock_${Date.now()}`,
        role: "system",
        name: "POVI",
        body: "Date locked ✨ Next up: a quick chemistry flash.",
      },
    ]);
  }

  const flashHref =
    mode === "bachelor"
      ? `/bachelor/flash/${matchId}`
      : `/shark/flash/${matchId}`;

  return (
    <section className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3">
      {locked && (
        <div className="pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="confetti-bit size-2 rounded-full"
              style={{
                background: ["#FF4D6D", "#2EC4B6", "#E8B923"][i % 3],
                animationDelay: `${i * 40}ms`,
              }}
            />
          ))}
        </div>
      )}

      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {mode === "shark" ? "Plan the date" : "Your date’s cooking"}
          </h1>
          <p className="mt-0.5 text-sm text-secondary">
            Maya × Eli ·{" "}
            {mode === "shark" ? "you’re negotiating" : "observe + whisper"}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div
            className="relative mx-auto mb-1 size-14 rounded-full p-[2.5px]"
            style={
              {
                background: `conic-gradient(${
                  lowTime || expired ? "var(--romance)" : "var(--shark)"
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
          </div>
          <p className="text-[11px] font-medium text-subtle">
            {locked ? "Locked" : expired ? "Time’s up" : "to plan"}
          </p>
        </div>
      </header>

      <div className="mb-3 flex items-center gap-3 rounded-2xl card-surface p-3">
        <div className="flex -space-x-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={people.maya.photos[0]}
            alt=""
            className="size-12 rounded-full object-cover ring-2 ring-surface"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={people.eli.photos[0]}
            alt=""
            className="size-12 rounded-full object-cover ring-2 ring-surface"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
            Tonight’s plan
          </p>
          <p className="font-display text-base font-bold">Cafe Xo, Florentin</p>
          <p className="text-sm text-secondary">Thu · 20:00</p>
        </div>
        <Link
          href={
            mode === "bachelor"
              ? "/bachelor/profile/eli"
              : "/shark/profile/eli"
          }
          className="text-xs font-bold text-romance"
        >
          Photos
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-2xl card-surface p-3"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-snug",
                m.role === "system" &&
                  "mx-auto max-w-full bg-elevated text-center text-xs font-medium text-secondary",
                m.role === "earpiece" &&
                  "border border-border bg-elevated text-secondary",
                m.role === "shark" &&
                  ("self" in m && m.self
                    ? "ml-auto bg-romance-soft"
                    : "bg-shark-soft")
              )}
            >
              {m.role === "earpiece" && (
                <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-subtle">
                  <Headphones className="size-3.5" /> Whisper · {m.name}
                </span>
              )}
              {m.role === "shark" && (
                <span className="mb-0.5 block text-[11px] font-semibold text-subtle">
                  {m.name}
                </span>
              )}
              {m.body}
            </motion.div>
          ))}
        </AnimatePresence>
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
                ? "Whisper to your Shark…"
                : "Suggest a tweak…"
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

        {mode === "shark" ? (
          locked ? (
            <Link href={flashHref}>
              <Button className="w-full border-spark bg-spark-soft text-foreground hover:bg-spark-soft">
                <Sparkles className="size-4 text-spark" /> Continue to Flash
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
            Your Shark is negotiating. Whisper anytime — you can’t lock for them.
          </p>
        )}
      </div>
    </section>
  );
}
