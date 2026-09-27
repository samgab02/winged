"use client";

import Link from "next/link";
import { ChevronRight, Sparkles, UsersRound, Wallet } from "lucide-react";
import { PageEnter } from "@/components/motion/page-enter";
import { mockSingles } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import {
  DEFAULT_WING_STATS,
  MODE_LABEL,
  TIER_LABEL,
  modeSupportsPro,
  type WingMode,
} from "@/lib/wing-network";
import { cn } from "@/lib/utils";

const MODES: { id: WingMode; label: string; blurb: string }[] = [
  {
    id: "friend",
    label: "Friend",
    blurb: "Wing someone you know — linked bachelor only.",
  },
  {
    id: "pro",
    label: "Pro",
    blurb: "Wing strangers for money via Date Pass.",
  },
  {
    id: "both",
    label: "Both",
    blurb: "Friends at home, Pro on the network.",
  },
];

export default function WingHubPage() {
  const profile = useApp((s) => s.profile);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const showToast = useApp((s) => s.showToast);

  if (!profile) return null;

  const stats = profile.wingStats ?? DEFAULT_WING_STATS;
  const tier = profile.wingTier ?? "baby_wing";
  const mode = profile.wingMode ?? "friend";

  function setMode(next: WingMode) {
    upsertProfile({
      accountId: profile!.accountId,
      wingMode: next,
      openToHire: next === "pro" || next === "both",
      bio:
        next === "pro"
          ? `Pro Matchmaker · ${profile!.city}`
          : next === "both"
            ? `Friend + Pro Wing · ${profile!.city}`
            : `Friend Wing · ${profile!.city}`,
    });
    showToast(`Mode → ${MODE_LABEL[next]}`);
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-6 lg:max-w-5xl lg:px-6 lg:pt-6 xl:px-8">
      <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photos[0]}
          alt=""
          className="size-20 rounded-full object-cover ring-2 ring-wing/40"
        />
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
          {profile.displayName}
        </h1>
        <p className="mt-1 text-sm font-semibold text-wing-deep">
          {TIER_LABEL[tier]}
        </p>
        <p className="mt-1 max-w-xs text-sm text-secondary">
          {profile.bio || "Your Wing hub — friends, network, and earnings."}
        </p>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
        {[
          { label: "Dates locked", value: String(stats.datesLocked) },
          { label: "Conversion", value: `${stats.conversionPct}%` },
          { label: "Active singles", value: String(stats.activeSingles) },
          { label: "Notoriety", value: String(stats.notoriety) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-surface px-3 py-3 text-center shadow-soft lg:py-4"
          >
            <p className="font-display text-xl font-extrabold lg:text-2xl">
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-subtle">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
      <section className="mt-6 lg:mt-0">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-subtle lg:text-left">
          How you wing
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-center transition",
                mode === m.id
                  ? "border-wing bg-wing-soft"
                  : "border-border bg-surface"
              )}
            >
              <span className="block text-xs font-bold">{m.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-secondary">
          {MODES.find((m) => m.id === mode)?.blurb}
        </p>
      </section>

      <section className="mt-6 space-y-2 lg:mt-0">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-lg font-extrabold">My singles</h2>
          <Link
            href="/wing/singles"
            className="text-xs font-bold text-wing-deep"
          >
            See all
          </Link>
        </div>
        <div className="space-y-2 lg:grid lg:grid-cols-1 lg:gap-2 lg:space-y-0">
        {mockSingles.map((s) => (
          <Link
            key={s.id}
            href={`/wing/profile/${s.person.id}`}
            className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.person.photos[0]}
              alt=""
              className="size-12 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="font-semibold">{s.person.firstName}</p>
              <p className="text-xs text-secondary">{s.status}</p>
            </div>
            <UsersRound className="size-4 text-wing" />
          </Link>
        ))}
        </div>
        {modeSupportsPro(mode) && (
          <p className="px-1 text-xs text-secondary">
            Pro mode on — you can also pick up open singles from the network.
          </p>
        )}
      </section>
      </div>

      <section className="mt-6 space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        <Link
          href="/wing/network"
          className="flex items-center justify-between rounded-2xl bg-surface px-4 py-4 shadow-soft"
        >
          <span className="flex items-center gap-3 text-left">
            <span className="flex size-10 items-center justify-center rounded-full bg-wing-soft">
              <Sparkles className="size-5 text-wing-deep" />
            </span>
            <span>
              <span className="block font-semibold">Wings network</span>
              <span className="block text-sm text-secondary">
                Radar · briefs · collab rooms · one-tap hire
              </span>
            </span>
          </span>
          <ChevronRight className="size-5 text-subtle" />
        </Link>
        <Link
          href="/wing/pro/nw_noa"
          className="flex items-center justify-between rounded-2xl panel-soft px-4 py-3"
        >
          <span className="text-left text-sm font-semibold">
            Sample Pro profile (Noa)
          </span>
          <ChevronRight className="size-5 text-subtle" />
        </Link>

        {modeSupportsPro(mode) ? (
          <Link
            href="/wing/me/earnings"
            className="flex items-center justify-between rounded-2xl bg-romance px-4 py-4 text-white shadow-soft"
          >
            <span className="flex items-center gap-3 text-left">
              <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
                <Wallet className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">Earn with Date Pass</span>
                <span className="block text-sm text-white/85">
                  Wing strangers · payout after check-in
                </span>
              </span>
            </span>
            <ChevronRight className="size-5 text-white/80" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setMode("both")}
            className="flex w-full items-center justify-between rounded-2xl border border-dashed border-border panel-wash-wing px-4 py-4 text-left"
          >
            <span>
              <span className="block font-semibold text-wing-deep">
                Turn on Pro
              </span>
              <span className="block text-sm text-secondary">
                Wing strangers for money when you’re ready
              </span>
            </span>
            <ChevronRight className="size-5 text-wing" />
          </button>
        )}
      </section>

      <Link
        href="/wing/me"
        className="mt-6 block text-center text-sm font-semibold text-subtle"
      >
        Account settings →
      </Link>
    </PageEnter>
  );
}
