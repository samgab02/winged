"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PoviMark } from "@/components/brand/povi-mark";
import { LoadingState } from "@/components/ui/states";
import { useSession } from "@/lib/store";

export default function WelcomePage() {
  const router = useRouter();
  const role = useSession((s) => s.role);
  const onboarding = useSession((s) => s.onboarding);
  const setRole = useSession((s) => s.setRole);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (role && onboarding === "ready") {
      router.replace(role === "bachelor" ? "/bachelor/discover" : "/shark/swipe");
    } else if (role && onboarding !== "welcome") {
      router.replace(
        role === "bachelor" ? "/onboarding/bachelor" : "/onboarding/shark"
      );
    }
  }, [hydrated, role, onboarding, router]);

  if (!hydrated || (role && onboarding !== "welcome")) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-hidden px-6 pb-10 pt-14">
      {/* Atmosphere photo plane */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=1600&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F4]/40 via-[#FFF8F4]/85 to-[#FFF8F4]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-col items-start gap-4">
          <PoviMark className="size-16 shadow-card" />
          <div>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground">
              POVI
            </h1>
            <p className="mt-1 text-sm font-semibold tracking-[0.18em] text-romance">
              PROOF OF VIBE
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-[18ch] font-display text-3xl font-extrabold leading-[1.1] tracking-tight">
          Dates planned by friends.
        </p>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-secondary">
          Continue as who you are tonight. Singles discover. Sharks vouch and lock
          the plan in three minutes.
        </p>

        <div className="mt-auto space-y-3 pt-12">
          <button
            type="button"
            onClick={() => {
              setRole("bachelor");
              router.push("/onboarding/bachelor");
            }}
            className="flex w-full items-center justify-between rounded-2xl bg-romance px-5 py-4 text-left text-white shadow-soft transition active:scale-[0.99]"
          >
            <span>
              <span className="block font-display text-lg font-extrabold">
                Continue as Bachelor
              </span>
              <span className="mt-0.5 block text-sm text-white/85">
                Discover people · whisper · show up
              </span>
            </span>
            <span className="text-2xl font-light text-white/80">→</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("shark");
              router.push("/onboarding/shark");
            }}
            className="flex w-full items-center justify-between rounded-2xl bg-shark px-5 py-4 text-left text-white shadow-soft transition active:scale-[0.99]"
          >
            <span>
              <span className="block font-display text-lg font-extrabold">
                Continue as Shark
              </span>
              <span className="mt-0.5 block text-sm text-white/85">
                Vouch · negotiate · lock the date
              </span>
            </span>
            <span className="text-2xl font-light text-white/80">→</span>
          </button>

          <p className="pt-2 text-center text-xs text-subtle">
            By continuing you agree to POVI’s Terms & Privacy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
