"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedWingMark } from "@/components/motion/animated-wing-mark";
import { DevLoginBootstrap } from "@/components/auth/dev-login-bootstrap";

export default function WelcomePage() {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-hidden px-6 pb-10 pt-14">
      <DevLoginBootstrap />
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=1600&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color-mix(in_srgb,var(--canvas)_40%,transparent)] via-[color-mix(in_srgb,var(--canvas)_88%,transparent)] to-[var(--canvas)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col"
      >
        <AnimatedWingMark className="size-16 shadow-card" />
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 font-display text-5xl font-extrabold tracking-tight"
        >
          Winged
        </motion.h1>
        <p className="mt-1 text-sm font-semibold tracking-[0.18em] text-romance">
          DATES WITH A WINGMAN
        </p>
        <p className="mt-8 max-w-[18ch] font-display text-3xl font-extrabold leading-[1.1]">
          Dates planned by friends.
        </p>
        <p className="mt-3 max-w-sm text-base text-secondary">
          Create your account to discover people, vouch as a Wing, and lock
          real plans in three minutes.
        </p>

        <div className="mt-auto space-y-3 pt-12">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              href="/auth/signup"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-romance text-base font-bold text-white shadow-soft"
            >
              Create account
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              href="/auth/signin"
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface text-base font-bold"
            >
              Sign in
            </Link>
          </motion.div>
          <p className="pt-1 text-center text-xs text-subtle">
            By continuing you agree to Winged&apos;s Terms & Privacy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
