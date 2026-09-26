import { CalendarHeart, MapPin } from "lucide-react";
import { mockUpcomingDates } from "@/lib/mock-data";

export default function DatesPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3 pb-4">
      <header className="mb-5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Upcoming dates
        </h1>
        <p className="mt-0.5 text-sm text-secondary">
          Locked plans — show up, stay curious, have fun.
        </p>
      </header>

      <ul className="space-y-3">
        {mockUpcomingDates.map((date) => (
          <li key={date.id} className="rounded-3xl card-surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex -space-x-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={date.photo_a}
                  alt=""
                  className="size-11 rounded-full object-cover ring-2 ring-surface"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={date.photo_b}
                  alt=""
                  className="size-11 rounded-full object-cover ring-2 ring-surface"
                />
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-tight">
                  {date.pair}
                </p>
                <p className="text-xs font-semibold text-romance">{date.when}</p>
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MapPin className="size-4 text-shark" strokeWidth={1.75} />
              {date.venue}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-secondary">
              <CalendarHeart className="size-4 text-romance" strokeWidth={1.75} />
              {date.note}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
