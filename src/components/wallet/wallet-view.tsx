"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  Clock3,
  ShieldCheck,
  Wallet,
  Ban,
  CheckCircle2,
} from "lucide-react";
import type { EscrowTransaction, Profile } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatILS } from "@/lib/utils";

const statusMeta: Record<
  EscrowTransaction["status"],
  { label: string; className: string; icon: typeof Clock3 }
> = {
  pending: {
    label: "Pending",
    className: "bg-coral/15 text-coral border border-coral/30",
    icon: Clock3,
  },
  available: {
    label: "Available",
    className: "bg-aqua/15 text-aqua border border-aqua/30",
    icon: CheckCircle2,
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-gold/15 text-gold border border-gold/30",
    icon: ArrowDownToLine,
  },
  frozen: {
    label: "Frozen",
    className: "bg-pink/15 text-pink border border-pink/30",
    icon: Ban,
  },
  refunded: {
    label: "Refunded",
    className: "bg-white/10 text-muted border border-white/15",
    icon: Ban,
  },
};

export function WalletView({
  shark,
  transactions,
}: {
  shark: Profile;
  transactions: EscrowTransaction[];
}) {
  const pending = transactions.filter((t) => t.status === "pending");
  const available = transactions.filter((t) => t.status === "available");
  const pendingTotal = pending.reduce((s, t) => s + t.shark_payout, 0);
  const availableTotal = available.reduce((s, t) => s + t.shark_payout, 0);
  const goal = 500;
  const progress = Math.min(100, (shark.available_balance / goal) * 100);

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-3 pb-4">
      <header className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          In-App Wallet
        </p>
        <h1 className="text-xl font-black tracking-tight">Escrow Status</h1>
        <p className="text-xs text-muted">
          ₪70 Date Pass · ₪20 platform · ₪50 Shark payout
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 overflow-hidden rounded-3xl neon-border-gold bg-gradient-to-br from-surface-elevated via-charcoal to-obsidian p-5"
      >
        <div className="mb-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shark.avatar_url}
            alt=""
            className="size-12 rounded-2xl object-cover ring-2 ring-gold/50"
          />
          <div>
            <p className="font-bold">{shark.display_name}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <ShieldCheck className="size-3.5 text-gold" />
              Stripe Connect stub · verified Shark
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-black/30 p-3 neon-border-aqua">
            <p className="text-[10px] font-bold uppercase tracking-wider text-aqua">
              Available
            </p>
            <p className="mt-1 text-2xl font-black neon-text-aqua">
              {formatILS(shark.available_balance || availableTotal)}
            </p>
            <p className="mt-1 text-[10px] text-muted">Ready to withdraw</p>
          </div>
          <div className="rounded-2xl bg-black/30 p-3 neon-border-pink">
            <p className="text-[10px] font-bold uppercase tracking-wider text-coral">
              Pending
            </p>
            <p className="mt-1 text-2xl font-black neon-text-pink">
              {formatILS(shark.pending_balance || pendingTotal)}
            </p>
            <p className="mt-1 text-[10px] text-muted">Proof of Stay / review</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
            <span>Withdraw goal</span>
            <span className="text-gold">{formatILS(goal)}</span>
          </div>
          <Progress value={progress} indicatorClassName="bg-gradient-to-r from-amber-400 to-gold" />
        </div>

        <Button variant="gold" className="mt-4 w-full" disabled>
          <Wallet className="size-4" />
          Withdraw via Stripe (stub)
        </Button>
      </motion.div>

      <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">
        Transaction timeline
      </h2>
      <ul className="space-y-2.5">
        {transactions.map((tx, i) => {
          const meta = statusMeta[tx.status];
          const Icon = meta.icon;
          return (
            <motion.li
              key={tx.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl border border-white/8 bg-surface/90 p-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug">
                    {tx.description}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {new Date(tx.created_at).toLocaleString("en-IL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {tx.released_at && (
                      <>
                        {" · released "}
                        {new Date(tx.released_at).toLocaleDateString("en-IL")}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-black",
                      tx.status === "available" && "text-aqua",
                      tx.status === "pending" && "text-coral",
                      tx.status === "withdrawn" && "text-gold",
                      tx.status === "frozen" && "text-pink"
                    )}
                  >
                    {tx.status === "withdrawn" ? "−" : "+"}
                    {formatILS(tx.shark_payout)}
                  </p>
                  <Badge className={cn("mt-1", meta.className)}>
                    <Icon className="size-3" />
                    {meta.label}
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-muted">
                Gross {formatILS(tx.amount_ils)} · fee {formatILS(tx.platform_fee)}
              </p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
