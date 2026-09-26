"use client";

import Link from "next/link";
import { mockMatches } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/states";

const previews: Record<string, string> = {
  match_maya_eli: "Noa: Patio + oat milk confirmed…",
  match_maya_tom: "You matched · waiting on Sharks",
};

export default function BachelorMatchesPage() {
  if (mockMatches.length === 0) {
    return (
      <EmptyState
        title="No matches yet"
        body="Keep discovering. When it’s mutual, your Shark opens a Deal Room."
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-4">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Matches
      </h1>
      <p className="mt-0.5 text-sm text-secondary">
        Mutual vibes and live planning threads.
      </p>

      <ul className="mt-5 divide-y divide-border rounded-2xl bg-surface shadow-soft">
        {mockMatches.map((m) => (
          <li key={m.id}>
            <Link
              href={
                m.status === "deal_room"
                  ? `/bachelor/deal-room/${m.id}`
                  : `/bachelor/profile/${m.other.id}`
              }
              className="flex items-center gap-3 px-3 py-3.5 transition hover:bg-elevated/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.other.photos[0]}
                alt=""
                className="size-14 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-base font-bold">
                    {m.other.firstName}
                  </p>
                  <span className="text-[11px] font-semibold text-subtle">
                    {m.status === "deal_room" ? "Live" : "New"}
                  </span>
                </div>
                <p className="truncate text-sm text-secondary">
                  {previews[m.id] ?? "Say hi through your Shark"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
