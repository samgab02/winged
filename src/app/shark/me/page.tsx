"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sharkAvatars } from "@/lib/mock-data";
import { useSession } from "@/lib/store";

export default function SharkMePage() {
  const router = useRouter();
  const name = useSession((s) => s.sharkName);
  const mode = useSession((s) => s.sharkMode);
  const bachelor = useSession((s) => s.linkedBachelorName);
  const switchRole = useSession((s) => s.switchRole);
  const resetDemo = useSession((s) => s.resetDemo);

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sharkAvatars.noa}
          alt=""
          className="size-16 rounded-full object-cover ring-2 ring-shark/35"
        />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {name}
          </h1>
          <p className="text-sm text-secondary">
            {mode === "pro" ? "Pro Matchmaker" : "Friend Shark"} · {bachelor}
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

      <div className="mt-4 rounded-2xl bg-surface shadow-soft divide-y divide-border">
        <div className="px-4 py-3.5">
          <p className="text-sm font-semibold">Availability</p>
          <p className="text-xs text-secondary">Open for Deal Rooms tonight</p>
        </div>
        <div className="px-4 py-3.5">
          <p className="text-sm font-semibold">Notoriety</p>
          <p className="text-xs text-secondary">Built from real-world dates</p>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3.5 text-left"
          onClick={() => {
            switchRole();
            router.replace("/");
          }}
        >
          <span>
            <span className="block text-sm font-semibold">Also date</span>
            <span className="block text-xs text-secondary">
              Open Bachelor shell on this device
            </span>
          </span>
          <span className="text-romance">→</span>
        </button>
      </div>

      <Button
        variant="ghost"
        className="mt-4 w-full text-subtle"
        onClick={() => {
          resetDemo();
          router.replace("/");
        }}
      >
        Sign out
      </Button>
    </section>
  );
}
