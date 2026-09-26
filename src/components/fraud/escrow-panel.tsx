"use client";

import Link from "next/link";
import {
  DATE_PASS_ILS,
  FRAUD_CONTROL_CATALOG,
  PLATFORM_FEE_ILS,
  WING_SHARE_ILS,
  fairPlayBand,
  fairPlayLabel,
  type EscrowStatus,
} from "@/lib/fraud/rules";
import { useFraud } from "@/lib/fraud/store";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<EscrowStatus, string> = {
  created: "Created",
  held: "Held in escrow",
  proof_pending: "Proof pending",
  released: "Released",
  refunded: "Refunded",
  frozen: "Frozen",
  clawback: "Clawback",
};

export function EscrowPanel() {
  const escrow = useFraud((s) => s.escrow);
  const startProof = useFraud((s) => s.startProof);
  const releaseOrFreeze = useFraud((s) => s.releaseOrFreeze);
  const raisePanic = useFraud((s) => s.raisePanic);
  const tryWithdraw = useFraud((s) => s.tryWithdraw);
  const fairPlay = useFraud((s) => s.fairPlay);
  const paidPairs = useFraud((s) => s.paidPairs);
  const showToast = useApp((s) => s.showToast);
  const profile = useApp((s) => s.profile);

  function withdraw() {
    const result = tryWithdraw({
      wingId: profile?.accountId || "nw_noa",
      wingCreatedAtMs: Date.now() - 2 * 60 * 60 * 1000, // demo: young account → cooling
      availableIls: 350,
      amountIls: 200,
      kycComplete: false,
      chargebacks: 0,
    });
    showToast(result.message);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-surface p-5 shadow-soft">
        <h2 className="font-display text-lg font-extrabold">Date Pass math</h2>
        <p className="mt-1 text-sm text-secondary">
          Bachelor prepay ₪{DATE_PASS_ILS} → held → after Proof-of-Stay: Wing ₪
          {WING_SHARE_ILS} + platform ₪{PLATFORM_FEE_ILS}. Friend Wings earn
          Notoriety only. Cash once per unique pair forever.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl panel-soft py-2">
            <p className="font-display text-lg font-extrabold">
              ₪{DATE_PASS_ILS}
            </p>
            <p className="text-[10px] font-semibold text-subtle">Pass</p>
          </div>
          <div className="rounded-xl panel-wash-wing py-2">
            <p className="font-display text-lg font-extrabold">
              ₪{WING_SHARE_ILS}
            </p>
            <p className="text-[10px] font-semibold text-subtle">Wing</p>
          </div>
          <div className="rounded-xl panel-wash py-2">
            <p className="font-display text-lg font-extrabold">
              ₪{PLATFORM_FEE_ILS}
            </p>
            <p className="text-[10px] font-semibold text-subtle">Fee</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-subtle">
          Paid pairs on device: {paidPairs.length} · Your Fair-Play:{" "}
          {fairPlayLabel(
            fairPlayBand(fairPlay(profile?.accountId || "nw_noa"))
          )}
        </p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold">Escrow ledger</h2>
          <Link
            href="/wing/network"
            className="text-xs font-bold text-wing-deep"
          >
            Hire a Pro
          </Link>
        </div>
        {escrow.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-secondary">
            No Date Passes held yet. Hire from the network to create escrow.
          </p>
        ) : (
          <ul className="space-y-2">
            {escrow.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border border-border bg-surface p-3 text-left"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold">
                    {STATUS_LABEL[e.status]}
                  </p>
                  <p className="text-sm font-bold tabular-nums">
                    ₪{e.amountIls}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-subtle">
                  {e.id} · Wing share ₪{e.wingShareIls}
                </p>
                {e.note && (
                  <p className="mt-1 text-xs text-secondary">{e.note}</p>
                )}
                {e.flags.length > 0 && (
                  <p className="mt-1 text-[11px] font-semibold text-romance">
                    Flags: {e.flags.join(", ")}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(e.status === "held" || e.status === "created") && (
                    <button
                      type="button"
                      onClick={() => startProof(e.id)}
                      className="rounded-lg bg-wing px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      Start proof
                    </button>
                  )}
                  {e.status === "proof_pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          releaseOrFreeze(e.id, "ok");
                          showToast("Escrow released to Wing");
                        }}
                        className="rounded-lg bg-success px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        Proof OK → release
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          releaseOrFreeze(e.id, "fail");
                          showToast("Pass refunded");
                        }}
                        className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-bold"
                      >
                        Proof fail
                      </button>
                    </>
                  )}
                  {e.status !== "frozen" && e.status !== "released" && (
                    <button
                      type="button"
                      onClick={() => {
                        raisePanic(e.id);
                        showToast("Panic freeze — safety review");
                      }}
                      className="rounded-lg bg-romance px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      Panic freeze
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-surface p-5 shadow-soft">
        <h2 className="font-display text-lg font-extrabold">Withdraw</h2>
        <p className="mt-1 text-sm text-secondary">
          Stripe Connect KYC + cooling period + velocity limits. This button
          runs the real fraud gate (will block young/non-KYC accounts).
        </p>
        <button
          type="button"
          onClick={withdraw}
          className="mt-3 h-11 w-full rounded-2xl border border-border text-sm font-bold"
        >
          Transfer out (fraud-gated)
        </button>
        {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        process.env.STRIPE_SECRET_KEY ? null : (
          <p className="mt-2 text-[11px] text-subtle">
            Add STRIPE_SECRET_KEY for live Checkout/Connect; gates still enforce
            locally.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-extrabold">
          Anti-fraud controls
        </h2>
        <ul className="space-y-2">
          {FRAUD_CONTROL_CATALOG.map((c) => (
            <li
              key={c.code}
              className={cn(
                "rounded-2xl border border-border bg-elevated/40 px-3 py-2.5 text-left"
              )}
            >
              <p className="text-xs font-bold">{c.attack}</p>
              <p className="mt-0.5 text-[11px] text-secondary">{c.control}</p>
              <p className="mt-0.5 font-mono text-[10px] text-subtle">
                {c.code}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
