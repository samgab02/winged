"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Radar, Share2 } from "lucide-react";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { MODE_LABEL, TIER_LABEL, mockMyWing } from "@/lib/wing-network";
import { DATE_PASS_ILS } from "@/lib/fraud/rules";
import { inviteUrl, shareOrCopy } from "@/lib/share";
import { cn } from "@/lib/utils";

export default function BachelorMyWingPage() {
  const profile = useApp((s) => s.profile);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const showToast = useApp((s) => s.showToast);
  const [inviteName, setInviteName] = useState("");

  if (!profile) return null;

  const wingName = profile.linkedWingName || mockMyWing.name;
  const linked = Boolean(profile.linkedWingName || mockMyWing.name);

  async function copyInvite() {
    const code = profile!.displayName || "you";
    const url = inviteUrl(code);
    try {
      const how = await shareOrCopy({
        title: "Be my Wing on Winged",
        text: `${code} invited you to Wing on Winged — friends plan it, you show up.`,
        url,
      });
      showToast(how === "shared" ? "Invite shared" : "Invite link copied");
    } catch {
      /* cancelled */
    }
  }

  function replaceWing() {
    const name = inviteName.trim() || "New Wing";
    upsertProfile({
      accountId: profile!.accountId,
      linkedWingName: name,
    });
    setInviteName("");
    showToast(`Wing set to ${name} (pending link)`);
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-6 lg:max-w-3xl lg:px-6 lg:pt-6">
      <header className="text-center lg:text-left">
        <h1 className="font-display text-2xl font-extrabold tracking-tight lg:text-3xl">
          My Wing
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          One person vouching for you — friend for free, or Pro with escrow.
        </p>
      </header>

      <div className="mt-5 rounded-3xl bg-surface p-5 text-center shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mockMyWing.avatar}
          alt=""
          className="mx-auto size-20 rounded-full object-cover ring-2 ring-romance/30"
        />
        <p className="mt-3 font-display text-2xl font-extrabold">{wingName}</p>
        <p className="mt-1 text-sm font-semibold text-romance">
          {TIER_LABEL[mockMyWing.tier]} · {MODE_LABEL[mockMyWing.mode]}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full panel-wash px-2.5 py-0.5 text-[11px] font-bold text-romance-deep">
          <span className="size-1.5 rounded-full bg-success" />
          {linked ? "Linked · active" : "No Wing yet"}
        </p>
        <p className="mt-2 text-sm text-secondary">{mockMyWing.bio}</p>
        <p className="mt-1 text-xs text-subtle">
          Since {mockMyWing.since} · {mockMyWing.vouchStyle}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Locked", mockMyWing.stats.datesLocked],
            ["Conv.", `${mockMyWing.stats.conversionPct}%`],
            ["Fame", mockMyWing.stats.notoriety],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl panel-soft px-2 py-2">
              <p className="font-display text-lg font-extrabold">{value}</p>
              <p className="text-[10px] font-semibold text-subtle">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => showToast("Opening Wing chat…")}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border text-xs font-bold"
          >
            <MessageCircle className="size-3.5" />
            Chat
          </button>
          <button
            type="button"
            onClick={copyInvite}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border text-xs font-bold"
          >
            <Share2 className="size-3.5" />
            Invite friend
          </button>
        </div>
      </div>

      <section className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl panel-wash p-3 text-left">
          <p className="text-sm font-bold">Friend Wing</p>
          <p className="mt-1 text-xs text-secondary">
            Someone you know. Free vouch. Notoriety only.
          </p>
        </div>
        <div className="rounded-2xl panel-wash-wing p-3 text-left">
          <p className="text-sm font-bold">Pro Wing</p>
          <p className="mt-1 text-xs text-secondary">
            Hire from radar. ₪{DATE_PASS_ILS} Date Pass in escrow.
          </p>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        <Link
          href="/bachelor/find-wing"
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-romance text-sm font-bold text-white"
          )}
        >
          <Radar className="size-4" />
          Find a Pro on radar
        </Link>

        <div className="rounded-2xl panel-soft p-3">
          <p className="text-xs font-semibold text-subtle">Replace Wing</p>
          <div className="mt-2 flex gap-2">
            <input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="New Wing’s name"
              className="h-11 flex-1 rounded-xl border border-border bg-transparent px-3 text-sm outline-none focus:border-romance/40"
            />
            <Button variant="outline" onClick={replaceWing}>
              Set
            </Button>
          </div>
        </div>
      </section>
    </PageEnter>
  );
}
