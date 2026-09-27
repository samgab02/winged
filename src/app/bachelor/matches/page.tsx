"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { mockMatches } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/states";
import { PageEnter } from "@/components/motion/page-enter";
import { listItem } from "@/lib/motion";

const previews: Record<string, string> = {
  match_maya_eli: "Noa: Patio + oat milk confirmed…",
  match_maya_tom: "You matched · waiting on Wings",
};

export default function BachelorMatchesPage() {
  if (mockMatches.length === 0) {
    return (
      <EmptyState
        title="No matches yet"
        body="Keep discovering. When it’s mutual, your Wing opens a Deal Room."
      />
    );
  }

  return (
    <PageEnter className="mx-auto w-full max-w-md px-4 pt-3 pb-4 lg:max-w-4xl lg:px-6 lg:pt-6">
      <header className="text-center lg:text-left">
        <h1 className="font-display text-2xl font-extrabold tracking-tight lg:text-3xl">
          Matches
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary lg:mx-0">
          Mutual vibes and live planning threads.
        </p>
      </header>

      <motion.ul
        initial="initial"
        animate="animate"
        className="mt-5 divide-y divide-border rounded-2xl bg-surface shadow-soft lg:mt-6 lg:grid lg:grid-cols-2 lg:gap-3 lg:divide-y-0 lg:bg-transparent lg:shadow-none"
      >
        {mockMatches.map((m) => (
          <motion.li
            key={m.id}
            variants={listItem}
            className="lg:rounded-2xl lg:bg-surface lg:shadow-soft"
          >
            <Link
              href={
                m.status === "deal_room"
                  ? `/bachelor/deal-room/${m.id}`
                  : `/bachelor/profile/${m.other.id}`
              }
              className="flex items-center gap-3 px-3 py-3.5 transition hover:bg-elevated/60 lg:rounded-2xl"
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
                  {previews[m.id] ?? "Say hi through your Wing"}
                </p>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </PageEnter>
  );
}
