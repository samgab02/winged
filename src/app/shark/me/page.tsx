"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export default function SharkMePage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const switchShell = useApp((s) => s.switchShell);
  const signOutLocal = useApp((s) => s.signOutLocal);
  const wipeLocalAccount = useApp((s) => s.wipeLocalAccount);
  const resetLocalData = useApp((s) => s.resetLocalData);

  if (!profile) return null;

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photos[0]}
          alt=""
          className="size-16 rounded-full object-cover ring-2 ring-shark/35"
        />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {profile.displayName}
          </h1>
          <p className="text-sm text-secondary">
            {profile.sharkMode === "pro" ? "Pro Matchmaker" : "Friend Shark"} ·{" "}
            {profile.linkedBachelorName}
          </p>
        </div>
      </div>

      <Link
        href="/shark/me/earnings"
        className="mt-6 flex items-center justify-between rounded-2xl bg-surface px-4 py-4 shadow-soft transition hover:bg-elevated"
      >
        <span>
          <span className="block font-semibold">Earnings</span>
          <span className="block text-sm text-secondary">
            Released after date check-in
          </span>
        </span>
        <ChevronRight className="size-5 text-subtle" />
      </Link>

      <div className="mt-4 divide-y divide-border rounded-2xl bg-surface shadow-soft">
        <div className="px-4 py-3.5">
          <p className="text-sm font-semibold">Availability</p>
          <p className="text-xs text-secondary">Open for Deal Rooms tonight</p>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3.5 text-left"
          onClick={() => {
            switchShell();
            router.replace("/");
          }}
        >
          <span>
            <span className="block text-sm font-semibold">Also date</span>
            <span className="block text-xs text-secondary">
              Open Bachelor shell
            </span>
          </span>
          <span className="text-romance">→</span>
        </button>
      </div>

      <Button
        variant="ghost"
        className="mt-4 w-full text-subtle"
        onClick={() => {
          signOutLocal();
          router.replace("/welcome");
        }}
      >
        Sign out
      </Button>
      <Button
        variant="ghost"
        className="w-full text-xs text-subtle"
        onClick={() => {
          wipeLocalAccount();
          router.replace("/welcome");
        }}
      >
        Delete account
      </Button>
      <Button
        variant="ghost"
        className="w-full text-[11px] text-subtle"
        onClick={() => {
          resetLocalData();
          router.replace("/welcome");
        }}
      >
        Reset local data
      </Button>
    </section>
  );
}
