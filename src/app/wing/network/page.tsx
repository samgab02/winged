"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import {
  MODE_LABEL,
  TIER_LABEL,
  mockNetworkWings,
  type WingMode,
} from "@/lib/wing-network";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Filter = "all" | "pro" | "friend";

export default function WingsNetworkPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const showToast = useApp((s) => s.showToast);

  const list = useMemo(() => {
    return mockNetworkWings.filter((w) => {
      if (filter === "pro") return w.openToHire || w.mode !== "friend";
      if (filter === "friend") return w.mode === "friend" || w.mode === "both";
      return true;
    });
  }, [filter]);

  function toggleFollow(id: string, name: string) {
    setFollowing((prev) => {
      const next = !prev[id];
      showToast(next ? `Following ${name}` : `Unfollowed ${name}`);
      return { ...prev, [id]: next };
    });
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <header className="text-center">
        <Link
          href="/wing/hub"
          className="text-sm font-semibold text-wing-deep"
        >
          ← Wings hub
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
          Wings network
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          Browse other Wings. Follow friends. Hire Pros for Date Pass work.
        </p>
      </header>

      <div className="mt-4 flex justify-center gap-1.5">
        {(
          [
            ["all", "All"],
            ["friend", "Friends"],
            ["pro", "Pro / hire"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-bold",
              filter === id
                ? "border-wing bg-wing-soft text-wing-deep"
                : "border-border bg-surface text-secondary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {list.map((w) => {
          const on = !!following[w.id];
          return (
            <li
              key={w.id}
              className="rounded-3xl bg-surface p-4 shadow-soft"
            >
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.avatar}
                  alt=""
                  className="size-14 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-lg font-bold">{w.name}</p>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-wing-deep">
                      {TIER_LABEL[w.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">
                    {w.city} · {MODE_LABEL[w.mode as WingMode]}
                    {w.openToHire ? " · Open to hire" : ""}
                  </p>
                  <p className="mt-1.5 text-sm text-secondary">{w.bio}</p>
                  <p className="mt-1 text-xs font-medium text-subtle">
                    Style: {w.vouchStyle}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-elevated/70 px-2 py-1.5">
                  <p className="text-sm font-bold">{w.stats.datesLocked}</p>
                  <p className="text-[10px] font-semibold text-subtle">Locked</p>
                </div>
                <div className="rounded-xl bg-elevated/70 px-2 py-1.5">
                  <p className="text-sm font-bold">{w.stats.conversionPct}%</p>
                  <p className="text-[10px] font-semibold text-subtle">Conv.</p>
                </div>
                <div className="rounded-xl bg-elevated/70 px-2 py-1.5">
                  <p className="text-sm font-bold">{w.stats.notoriety}</p>
                  <p className="text-[10px] font-semibold text-subtle">Fame</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleFollow(w.id, w.name)}
                  className={cn(
                    "h-10 flex-1 rounded-xl text-xs font-bold",
                    on
                      ? "border border-border bg-elevated"
                      : "bg-wing text-white"
                  )}
                >
                  {on ? "Following" : "Follow"}
                </button>
                {w.openToHire && (
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Hire request sent to ${w.name}`)
                    }
                    className="h-10 flex-1 rounded-xl border border-romance/40 bg-romance-soft text-xs font-bold text-romance-deep"
                  >
                    Hire Pro
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </PageEnter>
  );
}
