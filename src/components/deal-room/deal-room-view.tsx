"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, Send, Sparkles } from "lucide-react";
import type { DealRoom, DealRoomMessage, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { formatCountdown, cn } from "@/lib/utils";

const TOTAL_SECONDS = 180;

const incomingLines: Array<{
  role: DealRoomMessage["sender_role"];
  body: string;
  fromA?: boolean;
}> = [
  {
    role: "shark",
    fromA: false,
    body: "Patio works. Holding a table for 20:00.",
  },
  {
    role: "earpiece",
    body: "Tell them I like a booth if patio’s full.",
  },
  {
    role: "shark",
    fromA: true,
    body: "Booth backup noted. Shall we lock it?",
  },
];

function ConfettiBurst() {
  const bits = Array.from({ length: 14 }, (_, i) => i);
  const colors = ["#FF4D6D", "#2EC4B6", "#E8B923", "#FF8FA3", "#7ED9CF"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center gap-1 overflow-hidden">
      {bits.map((i) => (
        <span
          key={i}
          className="confetti-bit size-2 rounded-full"
          style={{
            background: colors[i % colors.length],
            animationDelay: `${i * 35}ms`,
          }}
        />
      ))}
    </div>
  );
}

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
  const [proposal] = useState({
    venue: "Cafe Xo, Florentin",
    time: "Thu · 20:00",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineIdx = useRef(0);

  const progress = useMemo(
    () => Math.max(0, Math.min(1, secondsLeft / TOTAL_SECONDS)),
    [secondsLeft]
  );

  useEffect(() => {
    const tick = setInterval(() => {
      const end = new Date(room.ends_at).getTime();
      setSecondsLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
    }, 500);
    return () => clearInterval(tick);
  }, [room.ends_at]);

  useEffect(() => {
    if (locked || secondsLeft <= 0) return;
    const id = setInterval(() => {
      const line = incomingLines[lineIdx.current % incomingLines.length];
      lineIdx.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `live_${Date.now()}`,
          deal_room_id: room.id,
          sender_id:
            line.role === "shark"
              ? line.fromA
                ? sharkA.id
                : sharkB.id
              : line.role,
          sender_role: line.role,
          body: line.body,
          created_at: new Date().toISOString(),
        },
      ]);
    }, 12000);
    return () => clearInterval(id);
  }, [locked, secondsLeft, room.id, sharkA.id, sharkB.id]);

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
        body: "Date locked ✨ Calendar invite on the way — go make it cute.",
        created_at: new Date().toISOString(),
      },
    ]);
  }

  const expired = secondsLeft <= 0 && !locked;
  const lowTime = !locked && secondsLeft > 0 && secondsLeft <= 30;

  return (
    <section className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3">
      {locked && <ConfettiBurst />}

      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Plan the date
          </h1>
          <p className="mt-0.5 text-sm text-secondary">
            {bachelorA.display_name.split(" ")[0]} ×{" "}
            {bachelorB.display_name.split(" ")[0]} · friends negotiating
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

      <div className="mb-3 rounded-2xl card-surface px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
          Tonight’s plan
        </p>
        <p className="mt-1 font-display text-lg font-bold tracking-tight">
          {proposal.venue}
        </p>
        <p className="text-sm font-medium text-secondary">{proposal.time}</p>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-2xl card-surface p-3"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isSelf =
              m.sender_role === "shark" && m.sender_id === sharkA.id;
            const isOtherShark =
              m.sender_role === "shark" && m.sender_id !== sharkA.id;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-snug",
                  m.sender_role === "system" &&
                    "mx-auto max-w-full bg-elevated text-center text-xs font-medium text-secondary",
                  m.sender_role === "earpiece" &&
                    "border border-border bg-elevated text-secondary",
                  isSelf && "ml-auto bg-romance-soft text-foreground",
                  isOtherShark && "bg-shark-soft text-foreground"
                )}
              >
                {m.sender_role === "earpiece" && (
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-subtle">
                    <Headphones className="size-3.5" strokeWidth={1.75} />
                    Whisper ·{" "}
                    {bachelorA.display_name.split(" ")[0]}
                  </span>
                )}
                {m.sender_role === "shark" && (
                  <span className="mb-0.5 block text-[11px] font-semibold text-subtle">
                    {isSelf
                      ? sharkA.display_name.split(" ")[0]
                      : sharkB.display_name.split(" ")[0]}
                  </span>
                )}
                {m.body}
              </motion.div>
            );
          })}
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
                ? "Time’s up"
                : locked
                  ? "Date locked"
                  : "Suggest a tweak…"
            }
            className="h-12 flex-1 rounded-2xl border border-border bg-surface px-3.5 text-sm outline-none placeholder:text-subtle focus:border-romance/40 focus:ring-2 focus:ring-romance/15"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={send}
            disabled={!draft.trim() || locked || expired}
            aria-label="Send"
            className="rounded-2xl"
          >
            <Send className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
        <Button
          variant={locked ? "outline" : "primary"}
          className={cn(
            "w-full",
            locked && "border-spark bg-spark-soft text-foreground hover:bg-spark-soft"
          )}
          onClick={lockDate}
          disabled={locked || expired}
        >
          {locked ? (
            <>
              <Sparkles className="size-4 text-spark" /> Date locked
            </>
          ) : (
            "Lock the date"
          )}
        </Button>
      </div>
    </section>
  );
}
