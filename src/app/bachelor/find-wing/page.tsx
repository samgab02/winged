"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import { proProfiles } from "@/lib/pro-network";
import { TIER_LABEL } from "@/lib/wing-network";
import { fairPlayBand, fairPlayLabel } from "@/lib/fraud/rules";
import { useFraud } from "@/lib/fraud/store";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function FindWingPage() {
  const showToast = useApp((s) => s.showToast);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const profile = useApp((s) => s.profile);
  const hirePro = useFraud((s) => s.hirePro);
  const fairPlay = useFraud((s) => s.fairPlay);

  const pros = useMemo(
    () => proProfiles.filter((w) => w.openToHire),
    []
  );

  function hire(id: string, name: string) {
    if (!profile) return;
    const result = hirePro({
      bachelorId: profile.accountId,
      wingId: id,
      otherBachelorId: "seed_match_partner",
    });
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    upsertProfile({ accountId: profile.accountId, linkedWingName: name });
    showToast(
      result.entry.wingShareIls > 0
        ? `Date Pass ₪${result.entry.amountIls} held in escrow for ${name}`
        : result.entry.note || `Hire recorded with ${name}`
    );
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
          Hire opens a Date Pass in escrow. Cash releases only after
          Proof-of-Stay — never for recycled pairs.
        </p>
      </header>

      <ul className="mt-5 space-y-3">
        {pros.map((w) => {
          const band = fairPlayBand(fairPlay(w.id) || w.stats.fairPlay);
          return (
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
                    {w.city} · {TIER_LABEL[w.tier]} · Fair-Play{" "}
                    {fairPlayLabel(band)}
                  </p>
                  <p className="mt-1 text-sm text-secondary line-clamp-2">
                    {w.bio}
                  </p>
                  <p className="mt-1 text-[11px] text-subtle">
                    {w.stats.showUpRate}% show-up · {w.stats.datesLocked} locks ·{" "}
                    {w.priceBand}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/bachelor/pro/${w.id}`}
                  className={cn(
                    "flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-xs font-bold"
                  )}
                >
                  Full profile
                </Link>
                <button
                  type="button"
                  onClick={() => hire(w.id, w.name)}
                  className="h-10 flex-1 rounded-xl bg-romance text-xs font-bold text-white"
                >
                  Hire + escrow
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </PageEnter>
  );
}
