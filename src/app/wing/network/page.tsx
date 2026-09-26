"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import {
  collabRooms,
  matchBriefs,
  networkFeed,
  proProfiles,
  type MatchBrief,
  type NetworkPost,
} from "@/lib/pro-network";
import { TIER_LABEL } from "@/lib/wing-network";
import {
  DATE_PASS_ILS,
  WING_SHARE_ILS,
  fairPlayBand,
  fairPlayLabel,
} from "@/lib/fraud/rules";
import { useFraud } from "@/lib/fraud/store";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tab = "feed" | "pros" | "requests";

export default function WingsNetworkPage() {
  const [tab, setTab] = useState<Tab>("pros");
  const [city, setCity] = useState("All");
  const [onlyLive, setOnlyLive] = useState(true);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [composer, setComposer] = useState("");
  const [briefDraft, setBriefDraft] = useState("");
  const [posts, setPosts] = useState<NetworkPost[]>(networkFeed);
  const [briefs, setBriefs] = useState<MatchBrief[]>(matchBriefs);
  const [applied, setApplied] = useState<string[]>([]);
  const following = useFraud((s) => s.following);
  const toggleFollow = useFraud((s) => s.toggleFollow);
  const hirePro = useFraud((s) => s.hirePro);
  const fairPlay = useFraud((s) => s.fairPlay);
  const showToast = useApp((s) => s.showToast);
  const profile = useApp((s) => s.profile);

  const cities = useMemo(
    () => ["All", ...new Set(proProfiles.map((p) => p.city))],
    []
  );

  const radar = useMemo(() => {
    return proProfiles
      .filter((p) => p.openToHire)
      .filter((p) => (city === "All" ? true : p.city === city))
      .filter((p) => (onlyLive ? p.availableNow : true))
      .sort((a, b) => Number(b.availableNow) - Number(a.availableNow));
  }, [city, onlyLive]);

  function publish() {
    const body = composer.trim();
    if (!body) return;
    setPosts((p) => [
      {
        id: `local_${Date.now()}`,
        wingId: "me",
        wingName: profile?.displayName || "You",
        avatar: profile?.photos[0] || proProfiles[0].avatar,
        kind: "tip",
        body,
        when: "just now",
        likes: 0,
        city: profile?.city || "Tel Aviv",
      },
      ...p,
    ]);
    setComposer("");
    showToast("Posted to Wings network");
  }

  function postBrief() {
    const body = briefDraft.trim();
    if (!body) return;
    setBriefs((b) => [
      {
        id: `br_local_${Date.now()}`,
        from: profile?.role === "wing" ? "wing" : "bachelor",
        authorName: profile?.displayName || "You",
        avatar: profile?.photos[0] || proProfiles[0].avatar,
        city: profile?.city || "Tel Aviv",
        when: "Now",
        title: profile?.role === "wing" ? "I can wing" : "Match-ready brief",
        body,
        tags: ["Open", "Date Pass"],
        applicants: 0,
        open: true,
      },
      ...b,
    ]);
    setBriefDraft("");
    showToast("Brief live on Requests");
    setTab("requests");
  }

  function oneTapHire(wingId: string, name: string) {
    if (!profile) {
      showToast("Sign in to hire");
      return;
    }
    const result = hirePro({
      bachelorId: profile.accountId,
      wingId,
      otherBachelorId: "seed_match_partner",
    });
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    showToast(
      result.entry.wingShareIls > 0
        ? `Hired ${name} · ₪${DATE_PASS_ILS} held (Wing ₪${WING_SHARE_ILS})`
        : result.entry.note || `Hire with ${name}`
    );
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
          Radar for who can wing tonight — hire with escrow, not a directory.
        </p>
      </header>

      <div className="mt-4 flex justify-center gap-1.5">
        {(
          [
            ["pros", "Pros"],
            ["feed", "Feed"],
            ["requests", "Requests"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-bold",
              tab === id
                ? "border-wing/40 panel-wash-wing text-wing-deep"
                : "border-border bg-surface text-secondary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pros" && (
        <div className="mt-4 space-y-3">
          <section className="rounded-3xl panel-soft p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                  Wing radar
                </p>
                <p className="font-display text-lg font-extrabold">
                  Available now
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOnlyLive((v) => !v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-bold",
                  onlyLive
                    ? "border-romance/40 panel-wash text-romance-deep"
                    : "border-border text-secondary"
                )}
              >
                {onlyLive ? "Live only" : "All Pros"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                    city === c
                      ? "border-romance/40 panel-wash"
                      : "border-border bg-surface"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          {radar.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-secondary">
              No Pros live in this filter — try All Pros or another city.
            </p>
          ) : (
            radar.map((w) => {
              const score = fairPlay(w.id) || w.stats.fairPlay;
              const band = fairPlayBand(score);
              const on = following.includes(w.id);
              return (
                <article
                  key={w.id}
                  className="rounded-3xl bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={w.avatar}
                        alt=""
                        className="size-14 rounded-2xl object-cover"
                      />
                      {w.availableNow && (
                        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success ring-2 ring-surface" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-display text-lg font-bold">{w.name}</p>
                        <span className="text-[10px] font-bold uppercase text-wing-deep">
                          {TIER_LABEL[w.tier]}
                        </span>
                      </div>
                      <p className="text-xs text-secondary">
                        {w.liveStatus || w.city} · {w.priceBand}
                      </p>
                      {/* Trust strip */}
                      <p className="mt-1.5 text-[11px] font-semibold text-subtle">
                        Fair-Play {fairPlayLabel(band)} ·{" "}
                        {w.stats.showUpRate}% show-up · ~{w.stats.responseMins}m
                        reply · {w.stats.datesLocked} verified
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-secondary">
                        {w.bio}
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
                          ? "border border-border"
                          : "border border-border panel-wash-wing"
                      )}
                    >
                      {on ? "Following" : "Follow"}
                    </button>
                    <Link
                      href={`/wing/pro/${w.id}`}
                      className="flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-xs font-bold"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => oneTapHire(w.id, w.name)}
                      className="h-10 flex-[1.2] rounded-xl bg-romance text-xs font-bold text-white"
                    >
                      Hire ₪{DATE_PASS_ILS}
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-subtle">
                    Escrow: Pass held → Proof-of-Stay → Wing ₪{WING_SHARE_ILS}
                  </p>
                </article>
              );
            })
          )}

          <section className="pt-2">
            <h2 className="mb-2 text-center font-display text-lg font-extrabold">
              Collab rooms
            </h2>
            <p className="mb-3 text-center text-xs text-secondary">
              Two Wings co-pitch a double setup — light social, dating-first.
            </p>
            <ul className="space-y-2">
              {collabRooms.map((room) => (
                <li
                  key={room.id}
                  className="rounded-2xl panel-soft px-3 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {room.wings.map((w) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={w.id}
                          src={w.avatar}
                          alt=""
                          className="size-8 rounded-full object-cover ring-2 ring-surface"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{room.title}</p>
                      <p className="text-[11px] text-subtle">
                        {room.city} · {room.when}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-secondary">{room.pitch}</p>
                  <button
                    type="button"
                    onClick={() => showToast("Joined collab room (demo)")}
                    className="mt-2 text-xs font-bold text-wing-deep"
                  >
                    Join pitch
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "feed" && (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl panel-soft p-3">
            <textarea
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              rows={2}
              placeholder="Tip, win, or open assist…"
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

      {tab === "requests" && (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl panel-soft p-3 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
              Match-ready brief
            </p>
            <p className="mt-0.5 text-sm text-secondary">
              Bachelors post what they need. Pros post “I can wing tonight.”
            </p>
            <textarea
              value={briefDraft}
              onChange={(e) => setBriefDraft(e.target.value)}
              rows={2}
              placeholder="Tonight · rooftop · vouch soft, lock fast…"
              className="mt-2 w-full resize-none bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={postBrief}
              className="mt-2 h-9 rounded-xl bg-romance px-3 text-xs font-bold text-white"
            >
              Post brief
            </button>
          </div>

          {briefs.map((b) => {
            const appliedAlready = applied.includes(b.id);
            return (
              <article
                key={b.id}
                className="rounded-3xl bg-surface p-4 text-left shadow-soft"
              >
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.avatar}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {b.authorName}{" "}
                      <span className="font-semibold text-subtle">
                        · {b.from === "wing" ? "Wing open" : "Bachelor brief"}
                      </span>
                    </p>
                    <p className="text-[11px] text-subtle">
                      {b.city} · {b.when} · {b.applicants} applying
                    </p>
                  </div>
                </div>
                <p className="mt-2 font-display text-base font-extrabold">
                  {b.title}
                </p>
                <p className="mt-1 text-sm text-secondary">{b.body}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {b.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={appliedAlready}
                  onClick={() => {
                    setApplied((a) => [...a, b.id]);
                    showToast(
                      b.from === "wing"
                        ? "Requested this Wing’s slot"
                        : "Applied to brief"
                    );
                  }}
                  className="mt-3 h-10 w-full rounded-xl border border-border text-xs font-bold disabled:opacity-50"
                >
                  {appliedAlready
                    ? "Sent"
                    : b.from === "wing"
                      ? "Request slot"
                      : "Apply as Wing"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </PageEnter>
  );
}
