"use client";

import Link from "next/link";
import { mockMatches } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/states";

export default function BachelorMatchesPage() {
  if (mockMatches.length === 0) {
    return (
      <EmptyState
        title="No matches yet"
        body="Keep discovering — when it’s mutual, your Shark opens a Deal Room."
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-4">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Matches
      </h1>
      <p className="mt-0.5 text-sm text-secondary">
        Mutual vibes. Peek in while Sharks plan.
      </p>

      <ul className="mt-5 space-y-3">
        {mockMatches.map((m) => (
          <li key={m.id}>
            <Link
              href={
                m.status === "deal_room" || m.status === "locked"
                  ? `/bachelor/deal-room/${m.id}`
                  : `/bachelor/profile/${m.other.id}`
              }
              className="flex items-center gap-3 rounded-3xl card-surface p-3 transition hover:border-romance/30"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.other.photos[0]}
                  alt=""
                  className="size-16 rounded-2xl object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.person.photos[0]}
                  alt=""
                  className="absolute -bottom-1 -right-1 size-7 rounded-full object-cover ring-2 ring-surface"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold">
                  {m.other.firstName}
                </p>
                <p className="text-sm text-secondary">
                  {m.status === "deal_room"
                    ? "Deal Room live — whisper in"
                    : m.status === "locked"
                      ? "Date locked"
                      : "New match"}
                </p>
              </div>
              <span className="text-xs font-bold text-romance">Open</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
