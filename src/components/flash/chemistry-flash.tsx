"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WingBloom } from "@/components/motion/wing-bloom";
import { PageEnter } from "@/components/motion/page-enter";
import { people } from "@/lib/mock-data";
import { useSession } from "@/lib/store";
import { formatCountdown, cn } from "@/lib/utils";

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

  function choose(v: "keep" | "skip") {
    setLocal(v);
    setVerdict(matchId, v);
    if (v === "keep") {
      setBloom(true);
      setTimeout(() => setBloom(false), 900);
    }
  }

  return (
    <PageEnter className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3 pb-6">
      <WingBloom show={bloom} />
      <p className="text-xs font-bold uppercase tracking-wider text-romance">
        180s Flash
      </p>
      <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
        Chemistry check
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Icebreaker prompts · Keep if you want the date to stand.
      </p>

      <div className="relative mt-5 overflow-hidden rounded-3xl card-surface">
        <div className="grid grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={people.maya.photos[1]}
            alt=""
            className="aspect-[3/4] object-cover"
          />
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
              ? "If both Keep, the calendar stays locked."
              : "All good — no hard feelings. We’ll unwind the hold."}
          </p>
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
