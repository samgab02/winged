"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WingBloom } from "@/components/motion/wing-bloom";
import { PageEnter } from "@/components/motion/page-enter";
import { people } from "@/lib/mock-data";
import { useSession } from "@/lib/store";
import { formatCountdown, cn } from "@/lib/utils";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";

const PROMPTS = [
  "What’s a tiny red flag you secretly love?",
  "Worst first-date story — go.",
  "Pick: sunrise beach or midnight rooftop?",
];

export function ChemistryFlash({
  matchId,
  backHref,
}: {
  matchId: string;
  backHref: string;
}) {
  const setVerdict = useSession((s) => s.setFlashVerdict);
  const existing = useSession((s) => s.flashVerdicts[matchId]);
  const reduced = useReducedMotion();
  const [seconds, setSeconds] = useState(180);
  const [promptIndex, setPromptIndex] = useState(0);
  const [verdict, setLocal] = useState<"keep" | "skip" | null>(existing ?? null);
  const [bloom, setBloom] = useState(false);
  const [camError, setCamError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (verdict) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [verdict]);

  useEffect(() => {
    if (verdict) return;
    const id = setInterval(
      () => setPromptIndex((i) => (i + 1) % PROMPTS.length),
      15000
    );
    return () => clearInterval(id);
  }, [verdict]);

  useEffect(() => {
    let active = true;
    async function startCam() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamError("Camera API unavailable — prompts still run.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      } catch {
        setCamError("Camera permission denied — you can still Keep/Skip.");
      }
    }
    void startCam();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function choose(v: "keep" | "skip") {
    setLocal(v);
    setVerdict(matchId, v);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (v === "keep") {
      setBloom(true);
      setTimeout(() => setBloom(false), 900);
      const event = {
        title: "Winged date · Maya × Eli",
        details: "Kept after Chemistry Flash",
        location: "Cafe Xo, Florentin",
        startIso: new Date(Date.now() + 3 * 86400000).toISOString(),
      };
      downloadIcs(event);
    }
  }

  return (
    <PageEnter className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3 pb-6">
      <WingBloom show={bloom} />
      <p className="text-center text-xs font-bold uppercase tracking-wider text-romance">
        180s Flash
      </p>
      <h1 className="mt-1 text-center font-display text-2xl font-extrabold tracking-tight">
        Chemistry check
      </h1>
      <p className="mt-1 text-center text-sm text-secondary">
        Live camera preview + icebreakers. Keep locks the calendar.
      </p>

      <div className="relative mt-5 overflow-hidden rounded-3xl card-surface">
        <div className="grid grid-cols-2">
          <div className="relative aspect-[3/4] bg-black">
            <video
              ref={videoRef}
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            {camError && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={people.maya.photos[1]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            )}
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
              You · live
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={people.eli.photos[1]}
            alt=""
            className="aspect-[3/4] object-cover"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <motion.p
            animate={
              !reduced && !verdict
                ? { opacity: [1, 0.75, 1] }
                : { opacity: 1 }
            }
            transition={{ duration: 1.4, repeat: Infinity }}
            className="font-mono text-sm font-bold text-white"
          >
            {formatCountdown(seconds)}
          </motion.p>
          <AnimatePresence mode="wait">
            <motion.p
              key={promptIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-1 text-sm font-medium text-white/95"
            >
              {PROMPTS[promptIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      {camError && (
        <p className="mt-2 text-center text-[11px] text-subtle">{camError}</p>
      )}

      {verdict ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl card-surface p-5 text-center"
        >
          <p className="font-display text-xl font-extrabold">
            You chose {verdict === "keep" ? "Keep" : "Skip"}
          </p>
          <p className="mt-2 text-sm text-secondary">
            {verdict === "keep"
              ? "Calendar .ics downloaded. Add Google Calendar below if both Kept."
              : "All good — no hard feelings. We’ll unwind the hold."}
          </p>
          {verdict === "keep" && (
            <a
              href={googleCalendarUrl({
                title: "Winged date · Maya × Eli",
                details: "Kept after Chemistry Flash",
                location: "Cafe Xo, Florentin",
                startIso: new Date(Date.now() + 3 * 86400000).toISOString(),
              })}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-bold text-wing-deep"
            >
              Open Google Calendar
            </a>
          )}
          <Link href={backHref}>
            <Button className="mt-4 w-full">Done</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className={cn("h-14")}
            onClick={() => choose("skip")}
            disabled={seconds === 0}
          >
            Skip
          </Button>
          <Button
            className="h-14"
            onClick={() => choose("keep")}
            disabled={seconds === 0}
          >
            Keep
          </Button>
        </div>
      )}
    </PageEnter>
  );
}
