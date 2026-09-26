"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import {
  networkFeed,
  proProfiles,
  type NetworkPost,
} from "@/lib/pro-network";
import { TIER_LABEL } from "@/lib/wing-network";
import { fairPlayBand, fairPlayLabel } from "@/lib/fraud/rules";
import { useFraud } from "@/lib/fraud/store";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Filter = "feed" | "pros" | "leaders";
type TierFilter = "all" | "hire" | "baby_wing" | "pro_matchmaker" | "rizz_master";

export default function WingsNetworkPage() {
  const [tab, setTab] = useState<Filter>("feed");
  const [tier, setTier] = useState<TierFilter>("all");
  const [city, setCity] = useState("All");
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [composer, setComposer] = useState("");
  const [posts, setPosts] = useState<NetworkPost[]>(networkFeed);
  const following = useFraud((s) => s.following);
  const toggleFollow = useFraud((s) => s.toggleFollow);
  const fairPlay = useFraud((s) => s.fairPlay);
  const showToast = useApp((s) => s.showToast);
  const profile = useApp((s) => s.profile);

  const cities = useMemo(
    () => ["All", ...new Set(proProfiles.map((p) => p.city))],
    []
  );

  const pros = useMemo(() => {
    return proProfiles
      .filter((p) => (city === "All" ? true : p.city === city))
      .filter((p) => {
        if (tier === "all") return true;
        if (tier === "hire") return p.openToHire;
        return p.tier === tier;
      })
      .sort((a, b) => b.stats.weeklyLocks - a.stats.weeklyLocks);
  }, [city, tier]);

  const leaders = useMemo(
    () =>
      [...proProfiles].sort(
        (a, b) =>
          (fairPlay(b.id) || b.stats.fairPlay) -
          (fairPlay(a.id) || a.stats.fairPlay)
      ),
    [fairPlay]
  );

  function publish() {
    const body = composer.trim();
    if (!body) return;
    const post: NetworkPost = {
      id: `local_${Date.now()}`,
      wingId: "me",
      wingName: profile?.displayName || "You",
      avatar: profile?.photos[0] || proProfiles[0].avatar,
      kind: "tip",
      body,
      when: "just now",
      likes: 0,
      city: profile?.city || "Tel Aviv",
    };
    setPosts((p) => [post, ...p]);
    setComposer("");
    showToast("Posted to Wings network");
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <header className="text-center">
        <Link href="/wing/hub" className="text-sm font-semibold text-wing-deep">
          ← Wings hub
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
          Wings network
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          Tips, open assists, wins — and Pros you can hire with escrow.
        </p>
      </header>

      <div className="mt-4 flex justify-center gap-1.5">
        {(
          [
            ["feed", "Feed"],
            ["pros", "Pros"],
            ["leaders", "Fair-Play"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-bold",
              tab === id
                ? "border-wing bg-wing-soft text-wing-deep"
                : "border-border bg-surface text-secondary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-border bg-surface p-3 shadow-soft">
            <textarea
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              rows={2}
              placeholder="Share a tip, win, or open assist…"
              className="w-full resize-none bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={publish}
              className="mt-2 h-9 rounded-xl bg-wing px-3 text-xs font-bold text-white"
            >
              Post
            </button>
          </div>

          {posts.map((p) => (
            <article
              key={p.id}
              className="rounded-3xl bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.avatar}
                  alt=""
                  className="size-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-bold">
                    {p.wingName}{" "}
                    <span className="font-semibold text-subtle">
                      · {p.kind}
                    </span>
                  </p>
                  <p className="text-[11px] text-subtle">
                    {p.city} · {p.when}
                  </p>
                </div>
                {p.wingId !== "me" && (
                  <Link
                    href={`/wing/pro/${p.wingId}`}
                    className="text-[11px] font-bold text-wing-deep"
                  >
                    Profile
                  </Link>
                )}
              </div>
              <p className="mt-3 text-left text-sm leading-relaxed">{p.body}</p>
              <button
                type="button"
                onClick={() =>
                  setLikes((prev) => ({
                    ...prev,
                    [p.id]: (prev[p.id] ?? p.likes) + 1,
                  }))
                }
                className="mt-3 text-xs font-bold text-romance"
              >
                ♥ {likes[p.id] ?? p.likes}
              </button>
            </article>
          ))}
        </div>
      )}

      {tab === "pros" && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap justify-center gap-1.5">
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                  city === c
                    ? "border-romance bg-romance-soft"
                    : "border-border bg-surface"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {(
              [
                ["all", "All"],
                ["hire", "Open to hire"],
                ["rizz_master", "Rizz"],
                ["pro_matchmaker", "Pro"],
                ["baby_wing", "Baby"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTier(id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                  tier === id
                    ? "border-wing bg-wing-soft"
                    : "border-border bg-surface"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {pros.map((w) => {
            const on = following.includes(w.id);
            const band = fairPlayBand(fairPlay(w.id) || w.stats.fairPlay);
            return (
              <li
                key={w.id}
                className="list-none rounded-3xl bg-surface p-4 shadow-soft"
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
                      <span className="text-[10px] font-bold uppercase text-wing-deep">
                        {TIER_LABEL[w.tier]}
                      </span>
                    </div>
                    <p className="text-xs text-secondary">
                      {w.city} · {w.priceBand} · Fair-Play{" "}
                      {fairPlayLabel(band)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-secondary">
                      {w.bio}
                    </p>
                    <p className="mt-1 text-[11px] text-subtle">
                      {w.stats.datesLocked} locks · {w.stats.showUpRate}% show-up
                      · {w.stats.weeklyLocks}/wk
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFollow(w.id)}
                    className={cn(
                      "h-10 flex-1 rounded-xl text-xs font-bold",
                      on
                        ? "border border-border bg-elevated"
                        : "bg-wing text-white"
                    )}
                  >
                    {on ? "Following" : "Follow"}
                  </button>
                  <Link
                    href={`/wing/pro/${w.id}`}
                    className="flex h-10 flex-1 items-center justify-center rounded-xl border border-romance/40 bg-romance-soft text-xs font-bold text-romance-deep"
                  >
                    View / Hire
                  </Link>
                </div>
              </li>
            );
          })}
        </div>
      )}

      {tab === "leaders" && (
        <div className="mt-4 space-y-2">
          <p className="text-center text-xs text-secondary">
            Weekly leaderboard weights Fair-Play over raw volume — farming
            recycled pairs doesn&apos;t win.
          </p>
          {leaders.map((w, i) => {
            const score = fairPlay(w.id) || w.stats.fairPlay;
            return (
              <Link
                key={w.id}
                href={`/wing/pro/${w.id}`}
                className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3 shadow-soft"
              >
                <span className="w-6 font-display text-lg font-extrabold text-subtle">
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.avatar}
                  alt=""
                  className="size-11 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-bold">{w.name}</p>
                  <p className="text-[11px] text-subtle">
                    {w.stats.weeklyLocks} locks this week ·{" "}
                    {fairPlayLabel(fairPlayBand(score))}
                  </p>
                </div>
                <span className="font-display text-lg font-extrabold text-wing-deep">
                  {score}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </PageEnter>
  );
}
