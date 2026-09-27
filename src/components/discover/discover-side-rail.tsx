"use client";

import Link from "next/link";
import { Feather, HeartHandshake, Sparkles } from "lucide-react";
import { mockMatches } from "@/lib/mock-data";
import { mockMyWing, TIER_LABEL, MODE_LABEL } from "@/lib/wing-network";
import { useApp } from "@/lib/store";

const previews: Record<string, string> = {
  match_maya_eli: "Patio + oat milk confirmed…",
  match_maya_tom: "Waiting on Wings",
};

export function DiscoverSideRail() {
  const profile = useApp((s) => s.profile);
  const wingName = profile?.linkedWingName || mockMyWing.name;

  return (
    <aside className="hidden w-full max-w-sm flex-col gap-4 lg:flex xl:max-w-none">
      <section className="rounded-3xl bg-surface/90 p-5 shadow-soft backdrop-blur-sm">
        <div className="flex items-center gap-2 text-romance">
          <HeartHandshake className="size-4" />
          <h2 className="font-display text-base font-extrabold text-foreground">
            Matches
          </h2>
        </div>
        <ul className="mt-3 space-y-2.5">
          {mockMatches.slice(0, 3).map((m) => (
            <li key={m.id}>
              <Link
                href={
                  m.status === "deal_room"
                    ? `/bachelor/deal-room/${m.id}`
                    : `/bachelor/profile/${m.other.id}`
                }
                className="flex items-center gap-3 rounded-2xl px-1 py-1.5 transition hover:bg-elevated/70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.other.photos[0]}
                  alt=""
                  className="size-11 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {m.other.firstName}
                  </p>
                  <p className="truncate text-xs text-secondary">
                    {previews[m.id] ?? "Say hi through your Wing"}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-subtle">
                  {m.status === "deal_room" ? "Live" : "New"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/bachelor/matches"
          className="mt-3 block text-center text-xs font-bold text-romance"
        >
          All matches →
        </Link>
      </section>

      <section className="rounded-3xl bg-surface/90 p-5 shadow-soft backdrop-blur-sm">
        <div className="flex items-center gap-2 text-wing-deep">
          <Feather className="size-4" />
          <h2 className="font-display text-base font-extrabold text-foreground">
            Your Wing
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mockMyWing.avatar}
            alt=""
            className="size-14 rounded-full object-cover ring-2 ring-romance/25"
          />
          <div className="min-w-0">
            <p className="font-display text-lg font-extrabold">{wingName}</p>
            <p className="text-xs font-semibold text-romance">
              {TIER_LABEL[mockMyWing.tier]} · {MODE_LABEL[mockMyWing.mode]}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          When you Like someone, {wingName.split(" ")[0]} can vouch and open a
          Deal Room — you just show up.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/bachelor/my-wing"
            className="flex h-11 items-center justify-center rounded-2xl bg-romance text-sm font-bold text-white shadow-soft"
          >
            Message Wing
          </Link>
          <Link
            href="/bachelor/find-wing"
            className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-border bg-elevated/50 text-sm font-bold"
          >
            <Sparkles className="size-3.5 text-spark" />
            Hire a Pro Wing
          </Link>
        </div>
      </section>

      <section className="rounded-3xl panel-wash px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Desktop tip
        </p>
        <p className="mt-1 text-sm text-secondary">
          Drag the card or use Pass / Like. Want the phone feel?{" "}
          <Link href="/ios" className="font-bold text-romance">
            Open the iPhone simulator
          </Link>
          .
        </p>
      </section>
    </aside>
  );
}
