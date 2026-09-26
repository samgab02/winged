"use client";

import type { EscrowTransaction, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn, formatILS } from "@/lib/utils";

function statusLabel(status: EscrowTransaction["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "available":
      return "Ready";
    case "withdrawn":
      return "Sent";
    case "frozen":
      return "On hold";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
}

function pairFromDescription(description: string) {
  const match = description.match(/^(.+?)\s*—/);
  return match?.[1]?.trim() ?? description;
}

export function EarningsView({
  shark,
  transactions,
}: {
  shark: Profile;
  transactions: EscrowTransaction[];
}) {
  const pending = transactions.filter((t) => t.status === "pending");
  const available = transactions.filter((t) => t.status === "available");
  const pendingTotal =
    shark.pending_balance ||
    pending.reduce((s, t) => s + t.shark_payout, 0);
  const availableTotal =
    shark.available_balance ||
    available.reduce((s, t) => s + t.shark_payout, 0);

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3 pb-4">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-shark">
          Shark only
        </p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Earnings
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Quiet payouts for dates you helped lock — Shark profile only.
        </p>
      </header>

      <div className="mb-3 rounded-3xl card-surface p-5">
        <p className="text-xs font-semibold text-subtle">Available</p>
        <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">
          {formatILS(availableTotal)}
        </p>
        <Button variant="outline" className="mt-4 w-full" disabled>
          Transfer out
        </Button>
      </div>

      <div className="mb-6 rounded-3xl card-surface px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-semibold text-subtle">Pending</p>
          <p className="text-lg font-bold tabular-nums">
            {formatILS(pendingTotal)}
          </p>
        </div>
        <p className="mt-1 text-sm text-secondary">
          Released after you both check in at the date
        </p>
      </div>

      <h2 className="mb-2 text-sm font-semibold text-secondary">Recent</h2>
      <ul className="divide-y divide-border rounded-3xl card-surface">
        {transactions.slice(0, 6).map((tx) => (
          <li
            key={tx.id}
            className="flex items-center justify-between gap-3 px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {pairFromDescription(tx.description)}
              </p>
              <p className="mt-0.5 text-xs text-subtle">
                {new Date(tx.created_at).toLocaleDateString("en-IL", {
                  day: "numeric",
                  month: "short",
                })}
                {" · "}
                <span
                  className={cn(
                    tx.status === "available" && "text-success",
                    tx.status === "pending" && "text-romance",
                    tx.status === "withdrawn" && "text-subtle"
                  )}
                >
                  {statusLabel(tx.status)}
                </span>
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold tabular-nums">
              {tx.status === "withdrawn" ? "−" : "+"}
              {formatILS(tx.shark_payout)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
