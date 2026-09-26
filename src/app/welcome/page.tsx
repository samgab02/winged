"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedWingMark } from "@/components/motion/animated-wing-mark";
import { FlyingWings, FlutterWing } from "@/components/motion/flying-wings";
import { DevLoginBootstrap } from "@/components/auth/dev-login-bootstrap";

export default function WelcomePage() {
  const reduced = useReducedMotion();
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-hidden px-6 pb-10 pt-12">
      <DevLoginBootstrap />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,var(--glow-a),transparent_55%),radial-gradient(ellipse_70%_50%_at_50%_100%,var(--glow-b),transparent_50%),radial-gradient(ellipse_60%_40%_at_50%_55%,var(--glow-c),transparent_55%),var(--canvas)]" />
        <FlyingWings />
      </div>

      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-1 flex-col items-center text-center"
      >
        <div className="flex flex-col items-center pt-4">
          <AnimatedWingMark className="size-24" />
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-2 font-display text-4xl font-extrabold tracking-tight text-foreground"
          >
            Winged
          </motion.span>
          {!reduced && (
            <motion.div
              aria-hidden
              className="mt-3 h-px w-16 origin-center bg-romance/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          )}
        </div>

        <motion.h1
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
          className="mt-10 max-w-[14ch] font-display text-[2.55rem] font-extrabold leading-[1.08] tracking-tight text-foreground"
        >
          Friends plan it. You show up.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="mt-4 max-w-sm text-[1.05rem] leading-relaxed text-secondary"
        >
          Discover people. Vouch as a Wing. Lock a real plan in three minutes —
          not another endless chat.
        </motion.p>

        <div className="mt-auto w-full max-w-sm space-y-3 pt-14">
          <motion.div
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoverPrimary(true)}
            onHoverEnd={() => setHoverPrimary(false)}
            className="relative"
          >
            {!reduced && hoverPrimary && (
              <motion.span
                className="pointer-events-none absolute -inset-1 rounded-[1.35rem] bg-romance/25 blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
            <Link
              href="/auth/signup"
              className="relative flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-romance text-base font-bold text-white shadow-soft"
            >
              Create account
              <FlutterWing key={hoverPrimary ? "p1" : "p0"} side="right" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoverSecondary(true)}
            onHoverEnd={() => setHoverSecondary(false)}
          >
            <Link
              href="/auth/signin"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface/90 text-base font-bold backdrop-blur-sm"
            >
              {hoverSecondary && <FlutterWing key="s1" side="left" />}
              Sign in
            </Link>
          </motion.div>

          <p className="pt-1 text-xs text-subtle">
            By continuing you agree to Winged&apos;s Terms & Privacy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
