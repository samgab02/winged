"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { mockDates } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/states";

export default function BachelorDatesPage() {
  const dates = mockDates;

  if (dates.length === 0) {
    return (
      <EmptyState
        title="No dates yet"
        body="When a Wing locks a plan, it shows up here with a check-in."
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-4">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Dates
      </h1>
      <p className="mt-0.5 text-sm text-secondary">
        Show up. Check in. Make it real.
      </p>
      <ul className="mt-5 space-y-3">
        {dates.map((date) => (
          <li key={date.id}>
            <Link
              href={`/bachelor/dates/${date.id}`}
              className="block overflow-hidden rounded-2xl bg-surface shadow-card"
            >
              <div className="relative h-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={date.personB.photos[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-display text-xl font-extrabold">
                    {date.pair}
                  </p>
                  <p className="text-sm text-white/85">{date.when}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="size-4 text-wing" />
                  {date.venue}
                </p>
                <span className="text-xs font-bold text-romance">
                  Check in →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
