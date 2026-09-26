"use client";

import Link from "next/link";
import { ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sharkAvatars } from "@/lib/mock-data";
import { useSession } from "@/lib/store";

export default function SharkMePage() {
  const name = useSession((s) => s.sharkName);
  const mode = useSession((s) => s.sharkMode);
  const bachelor = useSession((s) => s.linkedBachelorName);
  const switchRole = useSession((s) => s.switchRole);
  const resetDemo = useSession((s) => s.resetDemo);

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <div className="flex items-center gap-3 rounded-3xl card-surface p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sharkAvatars.noa}
          alt=""
          className="size-16 rounded-full object-cover ring-2 ring-shark/30"
        />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {name}
          </h1>
          <p className="text-sm text-secondary">
            {mode === "pro" ? "Pro Shark" : "Friend Shark"} · linked to{" "}
            {bachelor}
          </p>
          <p className="mt-1 text-xs font-semibold text-shark-deep">
            Notoriety · rising (demo)
          </p>
        </div>
      </div>

      <Link
        href="/shark/me/earnings"
        className="mt-4 flex items-center gap-3 rounded-3xl card-surface p-4 transition hover:border-shark/30"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-shark-soft text-shark-deep">
          <Wallet className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">Earnings</span>
          <span className="block text-sm text-secondary">
            Quiet payouts after check-in — Shark only
          </span>
        </span>
        <ChevronRight className="size-5 text-subtle" />
      </Link>

      <div className="mt-6 space-y-2 rounded-3xl card-surface p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-subtle">
          Demo settings
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            switchRole();
            window.location.href = "/";
          }}
        >
          Switch to Bachelor
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            resetDemo();
            window.location.href = "/";
          }}
        >
          Reset demo
        </Button>
      </div>
    </section>
  );
}
