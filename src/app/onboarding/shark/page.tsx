"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SharkOnboardingPage() {
  const router = useRouter();
  const complete = useSession((s) => s.completeSharkOnboarding);
  const [name, setName] = useState("Noa");
  const [mode, setMode] = useState<"friend" | "pro">("friend");
  const [bachelorName, setBachelorName] = useState("Maya");

  function finish() {
    complete({ name, mode, bachelorName });
    router.replace("/shark/swipe");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-8 pt-8">
      <p className="text-xs font-bold uppercase tracking-wider text-shark">
        Shark setup
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
        Who are you wingmanning?
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Friend Sharks link one bachelor. Pro Sharks work the community.
      </p>

      <div className="mt-8 space-y-5 flex-1">
        <div>
          <label className="text-xs font-semibold text-subtle">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-shark/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["friend", "Friend Shark", "Linked to one bachelor"],
              ["pro", "Pro Shark", "Community matchmaking"],
            ] as const
          ).map(([id, title, sub]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={cn(
                "rounded-2xl border p-3 text-left",
                mode === id
                  ? "border-shark bg-shark-soft"
                  : "border-border bg-surface"
              )}
            >
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-xs text-secondary">{sub}</p>
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-subtle">
            {mode === "friend" ? "Bachelor you’re linked to" : "Demo bachelor focus"}
          </label>
          <input
            value={bachelorName}
            onChange={(e) => setBachelorName(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-shark/40"
          />
        </div>
      </div>

      <Button
        variant="secondary"
        className="mt-6 w-full"
        disabled={!name.trim() || !bachelorName.trim()}
        onClick={finish}
      >
        Start swiping
      </Button>
    </div>
  );
}
