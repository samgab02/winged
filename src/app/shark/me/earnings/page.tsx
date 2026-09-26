"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockEarnings } from "@/lib/mock-data";
import { formatILS, cn } from "@/lib/utils";

export default function SharkEarningsPage() {
  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <Link
        href="/shark/me"
        className="text-xs font-bold text-shark-deep"
      >
        ← Me
      </Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
        Earnings
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Released after you both check in at the date.
      </p>

      <div className="mt-5 rounded-3xl card-surface p-5">
        <p className="text-xs font-semibold text-subtle">Available</p>
        <p className="mt-1 font-display text-3xl font-extrabold">
          {formatILS(mockEarnings.available)}
        </p>
        <Button variant="outline" className="mt-4 w-full" disabled>
          Transfer out (demo)
        </Button>
      </div>

      <div className="mt-3 rounded-3xl card-surface px-5 py-4">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold text-subtle">Pending</p>
          <p className="text-lg font-bold">
            {formatILS(mockEarnings.pending)}
          </p>
        </div>
      </div>

      <h2 className="mt-6 mb-2 text-sm font-semibold text-secondary">Recent</h2>
      <ul className="divide-y divide-border rounded-3xl card-surface">
        {mockEarnings.txs.map((tx) => (
          <li
            key={tx.id}
            className="flex items-center justify-between gap-3 px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{tx.label}</p>
              <p className="text-xs text-subtle">
                {tx.date} ·{" "}
                <span
                  className={cn(
                    tx.status === "ready" && "text-success",
                    tx.status === "pending" && "text-romance",
                    tx.status === "sent" && "text-subtle"
                  )}
                >
                  {tx.status === "ready"
                    ? "Ready"
                    : tx.status === "pending"
                      ? "Pending"
                      : "Sent"}
                </span>
              </p>
            </div>
            <p className="text-sm font-bold tabular-nums">
              {tx.status === "sent" ? "−" : "+"}
              {formatILS(tx.amount)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
