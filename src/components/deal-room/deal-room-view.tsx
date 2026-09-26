"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Lock, Send, Timer, Zap } from "lucide-react";
import type { DealRoom, DealRoomMessage, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { formatCountdown, cn } from "@/lib/utils";

const TOTAL_MS = 180_000;

const incomingLines = [
  "Patio confirmed. Sending calendar invite…",
  "Earpiece: Eli says keep it under 90 minutes first date.",
  "System: Double-Keep available when both Sharks agree.",
  "Noa: Locking ₪70 Date Pass into escrow on confirm.",
];

export function DealRoomView({
  room,
  messages: initialMessages,
  sharkA,
  sharkB,
  bachelorA,
  bachelorB,
}: {
  room: DealRoom;
  messages: DealRoomMessage[];
  sharkA: Profile;
  sharkB: Profile;
  bachelorA: Profile;
  bachelorB: Profile;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const end = new Date(room.ends_at).getTime();
    return Math.max(0, Math.round((end - Date.now()) / 1000));
  });
  const [locked, setLocked] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineIdx = useRef(0);

  const progress = useMemo(
    () => Math.max(0, Math.min(1, secondsLeft / (TOTAL_MS / 1000))),
    [secondsLeft]
  );

  useEffect(() => {
    const tick = setInterval(() => {
      const end = new Date(room.ends_at).getTime();
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      setSecondsLeft(left);
      setUrgent(left > 0 && left <= 30);
    }, 250);
    return () => clearInterval(tick);
  }, [room.ends_at]);

  // Mock realtime: inject Shark chatter
  useEffect(() => {
    if (locked || secondsLeft <= 0) return;
    const id = setInterval(() => {
      const line = incomingLines[lineIdx.current % incomingLines.length];
      lineIdx.current += 1;
      const fromShark = lineIdx.current % 2 === 0 ? sharkA : sharkB;
      const role: DealRoomMessage["sender_role"] = line.startsWith("Earpiece")
        ? "earpiece"
        : line.startsWith("System")
          ? "system"
          : "shark";
      setMessages((prev) => [
        ...prev,
        {
          id: `live_${Date.now()}`,
          deal_room_id: room.id,
          sender_id: role === "shark" ? fromShark.id : role,
          sender_role: role,
          body: line.replace(/^(Earpiece|System):\s*/, ""),
          created_at: new Date().toISOString(),
        },
      ]);
    }, 9000);
    return () => clearInterval(id);
  }, [locked, secondsLeft, room.id, sharkA, sharkB]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function send() {
    const body = draft.trim();
    if (!body || locked || secondsLeft <= 0) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        deal_room_id: room.id,
        sender_id: sharkA.id,
        sender_role: "shark",
        body,
        created_at: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  function lockDate() {
    setLocked(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `lock_${Date.now()}`,
        deal_room_id: room.id,
        sender_id: "system",
        sender_role: "system",
        body: "Date locked. Escrow armed. Calendar sync stubbed — Stripe Connect next.",
        created_at: new Date().toISOString(),
      },
    ]);
  }

  const expired = secondsLeft <= 0 && !locked;

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3">
      <header className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink">
          Deal Room
        </p>
        <h1 className="text-xl font-black tracking-tight">
          {bachelorA.display_name.split(" ")[0]} ×{" "}
          {bachelorB.display_name.split(" ")[0]}
        </h1>
        <p className="text-xs text-muted">
          Sharks {sharkA.display_name.split(" ")[0]} &{" "}
          {sharkB.display_name.split(" ")[0]} negotiate · Bachelors on earpiece
        </p>
      </header>

      {/* Neon countdown */}
      <div
        className={cn(
          "relative mx-auto mb-4 flex size-36 items-center justify-center rounded-full p-[3px]",
          urgent || expired ? "animate-pulse-glow" : ""
        )}
      >
        <div
          className="countdown-ring absolute inset-0 rounded-full"
          style={
            {
              "--progress": progress,
              filter: urgent
                ? "drop-shadow(0 0 12px rgba(255,8,68,0.7))"
                : "drop-shadow(0 0 12px rgba(0,242,254,0.55))",
              background: urgent
                ? `conic-gradient(var(--pink) calc(${progress} * 1turn), rgba(255,255,255,0.08) 0)`
                : undefined,
            } as CSSProperties
          }
        />
        <div className="relative z-10 flex size-[calc(100%-10px)] flex-col items-center justify-center rounded-full bg-obsidian">
          <Timer
            className={cn(
              "mb-1 size-4",
              urgent || expired ? "text-pink" : "text-aqua"
            )}
          />
          <span
            className={cn(
              "font-mono text-3xl font-black tabular-nums",
              expired
                ? "neon-text-pink"
                : urgent
                  ? "neon-text-pink"
                  : "neon-text-aqua"
            )}
          >
            {formatCountdown(secondsLeft)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            {locked ? "Locked" : expired ? "Expired" : "Remaining"}
          </span>
        </div>
      </div>

      {/* Participants strip */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {[
          { p: sharkA, label: "Shark A" },
          { p: sharkB, label: "Shark B" },
          { p: bachelorA, label: "Earpiece" },
          { p: bachelorB, label: "Earpiece" },
        ].map(({ p, label }) => (
          <div
            key={p.id}
            className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.avatar_url}
              alt=""
              className="size-7 rounded-full object-cover"
            />
            <div>
              <p className="text-[10px] font-bold leading-none">{p.display_name.split(" ")[0]}</p>
              <p className="text-[9px] text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat feed */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-2.5 overflow-y-auto rounded-2xl border border-white/8 bg-surface/80 p-3"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "max-w-[92%] rounded-2xl px-3 py-2 text-sm",
                m.sender_role === "system" &&
                  "mx-auto max-w-full bg-gold/10 text-center text-xs text-gold",
                m.sender_role === "earpiece" &&
                  "ml-0 border border-coral/30 bg-pink/10 text-coral",
                m.sender_role === "shark" &&
                  m.sender_id === sharkA.id &&
                  "ml-auto bg-aqua/15 text-foreground neon-border-aqua",
                m.sender_role === "shark" &&
                  m.sender_id !== sharkA.id &&
                  "mr-auto bg-white/8 text-foreground"
              )}
            >
              {m.sender_role === "earpiece" && (
                <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pink">
                  <Headphones className="size-3" /> Earpiece whisper
                </span>
              )}
              {m.sender_role === "shark" && (
                <span className="mb-0.5 block text-[10px] font-bold text-aqua/80">
                  {m.sender_id === sharkA.id
                    ? sharkA.display_name.split(" ")[0]
                    : sharkB.display_name.split(" ")[0]}
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
              expired
                ? "Time's up"
                : locked
                  ? "Date locked"
                  : "Negotiate as Shark…"
            }
            className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none placeholder:text-muted focus:border-aqua/50 focus:ring-1 focus:ring-aqua/40"
          />
          <Button
            size="icon"
            onClick={send}
            disabled={!draft.trim() || locked || expired}
            aria-label="Send"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <Button
          variant={locked ? "gold" : "pink"}
          className="w-full"
          onClick={lockDate}
          disabled={locked || expired}
        >
          {locked ? (
            <>
              <Lock className="size-4" /> Date locked · Escrow armed
            </>
          ) : (
            <>
              <Zap className="size-4" /> Double-Keep · Lock date
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
