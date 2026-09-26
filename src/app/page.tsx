"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-10 pt-10">
      <div className="flex flex-1 flex-col justify-center">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-romance">
          PROOF OF VIBE
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight">
          Dates planned by friends.
          <span className="text-romance"> Not dry chat.</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-secondary">
          Pick your role. Bachelors discover people. Sharks vouch, negotiate, and
          lock real-world plans in three minutes.
        </p>

        <div className="mt-10 space-y-3">
          <button
            type="button"
            onClick={() => {
              setRole("bachelor");
              router.push("/onboarding/bachelor");
            }}
            className="flex w-full items-start gap-4 rounded-3xl card-surface p-4 text-left transition hover:border-romance/40"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-romance-soft text-romance">
              <Heart className="size-5 fill-romance" />
            </span>
            <span>
              <span className="block font-display text-lg font-extrabold">
                I’m a Bachelor
              </span>
              <span className="mt-0.5 block text-sm text-secondary">
                Swipe with a Shark in your corner. Whisper in Deal Room. Show up
                on dates.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("shark");
              router.push("/onboarding/shark");
            }}
            className="flex w-full items-start gap-4 rounded-3xl card-surface p-4 text-left transition hover:border-shark/40"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-shark-soft text-shark-deep">
              <Shield className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-extrabold">
                I’m a Shark
              </span>
              <span className="mt-0.5 block text-sm text-secondary">
                Vouch for your single, negotiate the date, lock the plan.
              </span>
            </span>
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-subtle">
        Demo mode · no accounts required · switch roles later in settings
      </p>
      <Button
        variant="ghost"
        className="mt-2"
        onClick={() => {
          setRole("bachelor");
          router.push("/onboarding/bachelor");
        }}
      >
        Skip intro as Bachelor
      </Button>
    </div>
  );
}
