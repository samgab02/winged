"use client";

import type { EscrowTransaction, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn, formatILS } from "@/lib/utils";

function statusLabel(status: EscrowTransaction["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "available":
      return "Available";
    case "withdrawn":
      return "Withdrawn";
    case "frozen":
      return "Frozen";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
}

function pairFromDescription(description: string) {
  const match = description.match(/·\s*(.+?)(?:\s*—|$)/);
  return match?.[1]?.trim() ?? description;
}

export function WalletView({
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

  const list = transactions.slice(0, 6);

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-4 pb-4">
      <header className="mb-5">
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Wallet
        </h1>
        <p className="mt-0.5 text-sm text-secondary">
          {shark.display_name.split("·")[0].trim()} · Shark earnings
        </p>
      </header>

      <div className="mb-3 rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs text-subtle">Available</p>
        <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
          {formatILS(availableTotal)}
        </p>
        <Button variant="secondary" className="mt-4 w-full" disabled>
          Withdraw
        </Button>
        <p className="mt-2 text-center text-[11px] text-subtle">
          Stripe Connect stub — no live payouts in demo
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs text-subtle">Pending escrow</p>
          <p className="text-lg font-semibold tabular-nums">
            {formatILS(pendingTotal)}
          </p>
        </div>
        <p className="mt-1 text-sm text-secondary">
          Releases after verified date
        </p>
      </div>

      <h2 className="mb-2 text-sm font-medium text-secondary">Recent</h2>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {list.map((tx) => (
          <li
            key={tx.id}
            className="flex items-center justify-between gap-3 px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
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
                    tx.status === "pending" && "text-warning",
                    tx.status === "frozen" && "text-danger",
                    tx.status === "withdrawn" && "text-subtle"
                  )}
                >
                  {statusLabel(tx.status)}
                </span>
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">
              {tx.status === "withdrawn" ? "−" : "+"}
              {formatILS(tx.shark_payout)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
