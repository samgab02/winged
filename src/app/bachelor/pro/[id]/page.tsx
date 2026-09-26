"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
} from "lucide-react";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { getPro, proProfiles } from "@/lib/pro-network";
import { TIER_LABEL } from "@/lib/wing-network";
import { fairPlayBand, fairPlayLabel } from "@/lib/fraud/rules";
import { useFraud } from "@/lib/fraud/store";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ProWingProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pro = getPro(params.id) ?? proProfiles[0];
  const profile = useApp((s) => s.profile);
  const showToast = useApp((s) => s.showToast);
  const following = useFraud((s) => s.following);
  const toggleFollow = useFraud((s) => s.toggleFollow);
  const hirePro = useFraud((s) => s.hirePro);
  const fairPlayStore = useFraud((s) => s.fairPlay);
  const [hiring, setHiring] = useState(false);

  const fair = fairPlayStore(pro.id) || pro.stats.fairPlay;
  const band = fairPlayBand(fair);
  const isFollowing = following.includes(pro.id);

  const collabs = useMemo(
    () => proProfiles.filter((p) => pro.collabWith.includes(p.id)),
    [pro]
  );

  function onHire() {
    if (!profile) {
      showToast("Sign in to hire");
      return;
    }
    setHiring(true);
    const result = hirePro({
      bachelorId: profile.accountId,
      wingId: pro.id,
      otherBachelorId: "seed_match_partner",
      wingLinkedIds: [],
    });
    setHiring(false);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    showToast(
      result.entry.wingShareIls > 0
        ? `Date Pass held · ₪${result.entry.amountIls} in escrow`
        : result.entry.note || "Hire recorded (notoriety only)"
    );
    router.push("/bachelor/my-wing");
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md pb-8">
      <div className="relative h-36 w-full overflow-hidden bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pro.cover}
          alt=""
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent" />
        <Link
          href="/bachelor/find-wing"
          className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-bold backdrop-blur"
        >
          ← Find Pro
        </Link>
      </div>

      <div className="-mt-12 flex flex-col items-center px-4 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pro.avatar}
          alt=""
          className="size-24 rounded-full object-cover ring-4 ring-canvas"
        />
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
          {pro.name}
        </h1>
        <p className="mt-1 text-sm font-semibold text-wing-deep">
          {TIER_LABEL[pro.tier]} · {pro.city} · {pro.priceBand}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-secondary">
          <ShieldCheck className="size-3.5 text-success" />
          Fair-Play {fairPlayLabel(band)} · {fair}
        </p>
        <p className="mt-2 max-w-sm text-sm text-secondary">{pro.bio}</p>
        <p className="mt-1 text-xs text-subtle">
          {pro.languages.join(" · ")} · {pro.vouchStyle}
        </p>

        <div className="mt-4 flex w-full max-w-sm gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toggleFollow(pro.id)}
          >
            <UserPlus className="size-4" />
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button
            className="flex-1"
            disabled={hiring || !pro.openToHire}
            onClick={onHire}
          >
            <Sparkles className="size-4" />
            Hire
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            onClick={() => showToast(`Message request sent to ${pro.name}`)}
          >
            <MessageCircle className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 px-4">
        {[
          ["Locks", pro.stats.datesLocked],
          ["Show-up", `${pro.stats.showUpRate}%`],
          ["Conv.", `${pro.stats.conversionPct}%`],
          ["Vibe", pro.stats.avgVibe.toFixed(1)],
          ["Reply", `${pro.stats.responseMins}m`],
          ["Streak", pro.stats.streak],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl bg-surface px-2 py-3 text-center shadow-soft"
          >
            <p className="font-display text-lg font-extrabold">{value}</p>
            <p className="text-[10px] font-semibold text-subtle">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 px-4">
        <h2 className="text-center text-[11px] font-semibold uppercase tracking-wider text-subtle">
          Specialty
        </h2>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {pro.specialties.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 font-display text-lg font-extrabold">Vibe tape</h2>
        <ul className="space-y-2">
          {pro.vibeTape.map((v) => (
            <li
              key={v.q}
              className="rounded-2xl bg-surface px-4 py-3 text-left shadow-soft"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                {v.q}
              </p>
              <p className="mt-1 text-sm">{v.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 font-display text-lg font-extrabold">
          Recent wins
        </h2>
        {pro.wins.length === 0 ? (
          <p className="text-sm text-secondary">Building their tape…</p>
        ) : (
          <ul className="space-y-2">
            {pro.wins.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between rounded-2xl panel-wash-wing px-4 py-3 text-left"
              >
                <div>
                  <p className="text-sm font-semibold">{w.blurb}</p>
                  <p className="text-xs text-subtle">
                    {w.city} · {w.when}
                  </p>
                </div>
                <Star className="size-4 text-wing" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 font-display text-lg font-extrabold">
          Reviews
        </h2>
        <p className="mb-2 text-xs text-secondary">
          Double-blind, verified-dater only — after Proof-of-Stay.
        </p>
        {pro.reviews.length === 0 ? (
          <p className="text-sm text-secondary">No reviews yet.</p>
        ) : (
          <ul className="space-y-2">
            {pro.reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl bg-surface px-4 py-3 text-left shadow-soft"
              >
                <p className="text-xs font-semibold text-subtle">
                  {"★".repeat(r.rating)} · {r.from} · {r.when}
                </p>
                <p className="mt-1 text-sm">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 flex items-center gap-1.5 font-display text-lg font-extrabold">
          <Clock className="size-4 text-wing" /> Availability
        </h2>
        <ul className="space-y-1.5">
          {pro.availability.map((a) => (
            <li
              key={a}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            >
              {a}
            </li>
          ))}
        </ul>
      </section>

      {collabs.length > 0 && (
        <section className="mt-6 px-4">
          <h2 className="mb-2 font-display text-lg font-extrabold">
            Wings they collab with
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {collabs.map((c) => (
              <Link
                key={c.id}
                href={`/wing/pro/${c.id}`}
                className="flex w-24 shrink-0 flex-col items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.avatar}
                  alt=""
                  className="size-14 rounded-full object-cover"
                />
                <p className="mt-1 text-xs font-bold">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p
        className={cn(
          "mt-8 px-4 text-center text-[11px] text-subtle"
        )}
      >
        Hire holds a Date Pass in escrow. Cash releases only after Proof-of-Stay
        — never for recycled pairs.
      </p>
    </PageEnter>
  );
}
