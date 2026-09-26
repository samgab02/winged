"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PoviMark } from "@/components/brand/povi-mark";

export default function WelcomePage() {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-hidden px-6 pb-10 pt-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=1600&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F4]/35 via-[#FFF8F4]/88 to-[#FFF8F4]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <PoviMark className="size-16 shadow-card" />
        <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight">
          POVI
        </h1>
        <p className="mt-1 text-sm font-semibold tracking-[0.18em] text-romance">
          PROOF OF VIBE
        </p>
        <p className="mt-8 max-w-[16ch] font-display text-3xl font-extrabold leading-[1.1]">
          Dates planned by friends.
        </p>
        <p className="mt-3 max-w-sm text-base text-secondary">
          Create your account to discover people, vouch as a Shark, and lock
          real plans in three minutes.
        </p>

        <div className="mt-auto space-y-3 pt-12">
          <Link
            href="/auth/signup"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-romance text-base font-bold text-white shadow-soft"
          >
            Create account
          </Link>
          <Link
            href="/auth/signin"
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface text-base font-bold"
          >
            Sign in
          </Link>
          <p className="pt-1 text-center text-xs text-subtle">
            By continuing you agree to POVI’s Terms & Privacy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
