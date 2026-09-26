"use client";

import Link from "next/link";
import { EscrowPanel } from "@/components/fraud/escrow-panel";
import { mockEarnings } from "@/lib/mock-data";
import { formatILS, cn } from "@/lib/utils";

export default function WingEarningsPage() {
  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <Link href="/wing/hub" className="text-sm font-semibold text-wing-deep">
        ← Wings hub
      </Link>
      <h1 className="mt-2 text-center font-display text-2xl font-extrabold tracking-tight">
        Earn & escrow
      </h1>
      <p className="mx-auto mt-1 max-w-xs text-center text-sm text-secondary">
        Date Pass money stays held until Proof-of-Stay. Friend Wings earn
        Notoriety — never recycled cash.
      </p>

      <div className="mt-5 rounded-2xl bg-surface p-5 shadow-soft">
        <p className="text-xs font-semibold text-subtle">Available</p>
        <p className="mt-1 font-display text-3xl font-extrabold">
          {formatILS(mockEarnings.available)}
        </p>
        <p className="mt-1 text-xs text-secondary">
          Pending Proof / cooling: {formatILS(mockEarnings.pending)}
        </p>
      </div>

      <div className="mt-6">
        <EscrowPanel />
      </div>

      <h2 className="mt-6 mb-2 text-sm font-semibold text-secondary">
        Recent ledger
      </h2>
      <ul className="divide-y divide-border rounded-2xl bg-surface shadow-soft">
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
                      ? "Pending proof"
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
