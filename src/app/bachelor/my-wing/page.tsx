"use client";

import { useState } from "react";
import Link from "next/link";
import { PageEnter } from "@/components/motion/page-enter";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { MODE_LABEL, TIER_LABEL, mockMyWing } from "@/lib/wing-network";
import { inviteUrl, shareOrCopy } from "@/lib/share";
import { cn } from "@/lib/utils";

export default function BachelorMyWingPage() {
  const profile = useApp((s) => s.profile);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const showToast = useApp((s) => s.showToast);
  const [inviteName, setInviteName] = useState("");

  if (!profile) return null;

  const wingName = profile.linkedWingName || mockMyWing.name;

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
      /* user cancelled share */
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
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <header className="text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          My Wing
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          Who’s vouching for you — and how you can invite or replace them.
        </p>
      </header>

      <div className="mt-5 rounded-3xl bg-surface p-5 text-center shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mockMyWing.avatar}
          alt=""
          className="mx-auto size-20 rounded-full object-cover ring-2 ring-romance/35"
        />
        <p className="mt-3 font-display text-2xl font-extrabold">{wingName}</p>
        <p className="mt-1 text-sm font-semibold text-romance">
          {TIER_LABEL[mockMyWing.tier]} · {MODE_LABEL[mockMyWing.mode]}
        </p>
        <p className="mt-2 text-sm text-secondary">{mockMyWing.bio}</p>
        <p className="mt-1 text-xs text-subtle">
          Linked since {mockMyWing.since} · Style: {mockMyWing.vouchStyle}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Locked", mockMyWing.stats.datesLocked],
            ["Conv.", `${mockMyWing.stats.conversionPct}%`],
            ["Fame", mockMyWing.stats.notoriety],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl bg-elevated/80 px-2 py-2"
            >
              <p className="font-display text-lg font-extrabold">{value}</p>
              <p className="text-[10px] font-semibold text-subtle">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-6 space-y-2">
        <h2 className="text-center text-[11px] font-semibold uppercase tracking-wider text-subtle">
          Friend or Pro?
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-romance/30 bg-romance-soft/50 p-3 text-left">
            <p className="text-sm font-bold">Friend Wing</p>
            <p className="mt-1 text-xs text-secondary">
              Someone you know. Free vouch. Linked only to you.
            </p>
          </div>
          <div className="rounded-2xl border border-wing/30 bg-wing-soft/50 p-3 text-left">
            <p className="text-sm font-bold">Pro Wing</p>
            <p className="mt-1 text-xs text-secondary">
              Hire from the network. Date Pass pays them after check-in.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <Button className="w-full" onClick={copyInvite}>
          Copy friend Wing invite
        </Button>
        <Link
          href="/bachelor/find-wing"
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface text-sm font-bold"
          )}
        >
          Find a Pro Wing
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-3">
          <p className="text-xs font-semibold text-subtle">Replace Wing</p>
          <div className="mt-2 flex gap-2">
            <input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="New Wing’s name"
              className="h-11 flex-1 rounded-xl border border-border bg-elevated/40 px-3 text-sm outline-none focus:border-romance/40"
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
