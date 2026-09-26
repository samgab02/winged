"use client";

import Link from "next/link";
import { mockSingles } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";

export default function WingSinglesPage() {
  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-4">
      <header className="text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          My singles
        </h1>
        <p className="mx-auto mt-0.5 max-w-xs text-sm text-secondary">
          Linked bachelors you’re vouching for.
        </p>
      </header>

      <ul className="mt-5 space-y-3">
        {mockSingles.map((s) => (
          <li key={s.id} className="rounded-3xl card-surface p-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.person.photos[0]}
                alt=""
                className="size-16 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold">
                  {s.person.firstName}
                </p>
                <p className="text-sm text-secondary">{s.status}</p>
              </div>
              <Link
                href={`/wing/profile/${s.person.id}`}
                className="text-xs font-bold text-wing-deep"
              >
                Gallery
              </Link>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs font-semibold text-subtle">
                <span>Profile completeness</span>
                <span>{s.completeness}%</span>
              </div>
              <Progress value={s.completeness} />
            </div>
            <p className="mt-3 text-sm text-secondary line-clamp-2">
              {s.person.vibe}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
