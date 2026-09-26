"use client";

import Link from "next/link";
import { CalendarHeart, MapPin } from "lucide-react";
import { mockDates } from "@/lib/mock-data";
import { useSession } from "@/lib/store";
import { EmptyState } from "@/components/ui/states";

export default function BachelorDatesPage() {
  const locked = useSession((s) => s.lockedDateIds);
  const dates = mockDates.filter(
    (d) => locked.includes(d.matchId) || d.id === "date_maya_eli" || true
  );

  if (dates.length === 0) {
    return (
      <EmptyState
        title="No dates locked yet"
        body="When your Shark locks a plan, it’ll land here."
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-4">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Upcoming dates
      </h1>
      <p className="mt-0.5 text-sm text-secondary">
        Show up, stay curious, have fun.
      </p>
      <ul className="mt-5 space-y-3">
        {dates.map((date) => (
          <li key={date.id}>
            <Link
              href={`/bachelor/dates/${date.id}`}
              className="block rounded-3xl card-surface p-4 transition hover:border-romance/30"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex -space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={date.personA.photos[0]}
                    alt=""
                    className="size-11 rounded-full object-cover ring-2 ring-surface"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={date.personB.photos[0]}
                    alt=""
                    className="size-11 rounded-full object-cover ring-2 ring-surface"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">{date.pair}</p>
                  <p className="text-xs font-semibold text-romance">
                    {date.when}
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin className="size-4 text-shark" /> {date.venue}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-secondary">
                <CalendarHeart className="size-4 text-romance" /> {date.note}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
