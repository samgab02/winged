"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import {
  TIER_LABEL,
  mockNetworkWings,
} from "@/lib/wing-network";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function FindWingPage() {
  const showToast = useApp((s) => s.showToast);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const profile = useApp((s) => s.profile);
  const [hired, setHired] = useState<string | null>(null);

  const pros = useMemo(
    () => mockNetworkWings.filter((w) => w.openToHire),
    []
  );

  function hire(id: string, name: string) {
    if (!profile) return;
    upsertProfile({ accountId: profile.accountId, linkedWingName: name });
    setHired(id);
    showToast(`Hire request sent to ${name}`);
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <header className="text-center">
        <Link
          href="/bachelor/my-wing"
          className="text-sm font-semibold text-romance"
        >
          ← My Wing
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
          Find a Pro Wing
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          Open-to-hire Wings from the network. Date Pass pays them after
          check-in.
        </p>
      </header>

      <ul className="mt-5 space-y-3">
        {pros.map((w) => (
          <li key={w.id} className="rounded-3xl bg-surface p-4 shadow-soft">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.avatar}
                alt=""
                className="size-14 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1 text-left">
                <p className="font-display text-lg font-bold">{w.name}</p>
                <p className="text-xs text-secondary">
                  {w.city} · {TIER_LABEL[w.tier]}
                </p>
                <p className="mt-1 text-sm text-secondary">{w.bio}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => hire(w.id, w.name)}
                className={cn(
                  "h-10 flex-1 rounded-xl text-xs font-bold text-white",
                  hired === w.id ? "bg-wing" : "bg-romance"
                )}
              >
                {hired === w.id ? "Requested" : "Hire Pro"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </PageEnter>
  );
}
