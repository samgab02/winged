"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  canPayCashForPair,
  checkHireRate,
  checkPayoutVelocity,
  createEscrow,
  detectSelfPair,
  nextEscrowStatus,
  pairKey,
  type EscrowLedgerEntry,
  type FraudFlagCode,
  type PairKey,
  DATE_PASS_ILS,
  WING_SHARE_ILS,
} from "@/lib/fraud/rules";

type FraudState = {
  paidPairs: PairKey[];
  escrow: EscrowLedgerEntry[];
  hiresLastHour: { at: number }[];
  fairPlayByWing: Record<string, number>;
  following: string[];
  panicFlags: string[];

  hirePro: (opts: {
    bachelorId: string;
    wingId: string;
    otherBachelorId: string;
    wingLinkedIds?: string[];
  }) => { ok: true; entry: EscrowLedgerEntry } | { ok: false; error: string; flags: FraudFlagCode[] };

  startProof: (escrowId: string) => void;
  releaseOrFreeze: (
    escrowId: string,
    result: "ok" | "fail" | "freeze"
  ) => EscrowLedgerEntry | null;

  tryWithdraw: (opts: {
    wingId: string;
    wingCreatedAtMs: number;
    availableIls: number;
    amountIls: number;
    kycComplete: boolean;
    chargebacks: number;
  }) => { ok: boolean; message: string };

  toggleFollow: (wingId: string) => void;
  raisePanic: (escrowId: string) => void;
  fairPlay: (wingId: string) => number;
};

const defaultFair = 82;

export const useFraud = create<FraudState>()(
  persist(
    (set, get) => ({
      paidPairs: [],
      escrow: [],
      hiresLastHour: [],
      fairPlayByWing: {},
      following: [],
      panicFlags: [],

      hirePro: ({ bachelorId, wingId, otherBachelorId, wingLinkedIds = [] }) => {
        const hireCheck = checkHireRate(
          get().hiresLastHour.filter((h) => Date.now() - h.at < 3_600_000).length
        );
        if (!hireCheck.allow) {
          return { ok: false, error: hireCheck.message, flags: hireCheck.flags };
        }

        const self = detectSelfPair(wingId, bachelorId, wingLinkedIds);
        if (!self.allow) {
          return { ok: false, error: self.message, flags: self.flags };
        }

        const cash = canPayCashForPair(
          get().paidPairs,
          bachelorId,
          otherBachelorId
        );

        const entry = createEscrow({ bachelorId, wingId, otherBachelorId });
        entry.status = "held";
        entry.updatedAt = new Date().toISOString();
        if (!cash.allow) {
          entry.amountIls = 0;
          entry.wingShareIls = 0;
          entry.platformFeeIls = 0;
          entry.flags = cash.flags;
          entry.note = cash.message;
        } else {
          entry.note = `Date Pass ₪${DATE_PASS_ILS} held · Wing share ₪${WING_SHARE_ILS}`;
        }

        set({
          escrow: [entry, ...get().escrow],
          hiresLastHour: [...get().hiresLastHour, { at: Date.now() }],
        });
        return { ok: true, entry };
      },

      startProof: (escrowId) => {
        set({
          escrow: get().escrow.map((e) =>
            e.id === escrowId
              ? {
                  ...e,
                  status: nextEscrowStatus(e.status, "proof_start"),
                  updatedAt: new Date().toISOString(),
                }
              : e
          ),
        });
      },

      releaseOrFreeze: (escrowId, result) => {
        let updated: EscrowLedgerEntry | null = null;
        const paid = [...get().paidPairs];
        const fair = { ...get().fairPlayByWing };

        const escrow = get().escrow.map((e) => {
          if (e.id !== escrowId) return e;
          const event =
            result === "ok"
              ? "proof_ok"
              : result === "freeze"
                ? "freeze"
                : "proof_fail";
          const status = nextEscrowStatus(e.status, event);
          updated = {
            ...e,
            status,
            updatedAt: new Date().toISOString(),
            proofAt: new Date().toISOString(),
            releasedAt: status === "released" ? new Date().toISOString() : e.releasedAt,
            flags:
              result === "freeze"
                ? [...e.flags, "panic_freeze" as FraudFlagCode]
                : e.flags,
          };
          if (status === "released" && e.wingShareIls > 0) {
            const key = pairKey(e.bachelorId, e.otherBachelorId);
            if (!paid.includes(key)) paid.push(key);
            fair[e.wingId] = (fair[e.wingId] ?? defaultFair) + 1;
          }
          if (status === "frozen" || status === "refunded") {
            fair[e.wingId] = Math.max(
              0,
              (fair[e.wingId] ?? defaultFair) - (status === "frozen" ? 12 : 3)
            );
          }
          return updated;
        });

        set({ escrow, paidPairs: paid, fairPlayByWing: fair });
        return updated;
      },

      tryWithdraw: (opts) => {
        const payoutsLast24h = get().escrow.filter(
          (e) =>
            e.wingId === opts.wingId &&
            e.status === "released" &&
            e.releasedAt &&
            Date.now() - new Date(e.releasedAt).getTime() < 86_400_000
        ).length;

        const decision = checkPayoutVelocity({
          wingCreatedAtMs: opts.wingCreatedAtMs,
          payoutsLast24h,
          availableIls: opts.availableIls,
          withdrawIls: opts.amountIls,
          kycComplete: opts.kycComplete,
          chargebacks: opts.chargebacks,
        });

        return { ok: decision.allow, message: decision.message };
      },

      toggleFollow: (wingId) => {
        const setFollow = new Set(get().following);
        if (setFollow.has(wingId)) setFollow.delete(wingId);
        else setFollow.add(wingId);
        set({ following: [...setFollow] });
      },

      raisePanic: (escrowId) => {
        get().releaseOrFreeze(escrowId, "freeze");
        set({ panicFlags: [...get().panicFlags, escrowId] });
      },

      fairPlay: (wingId) => get().fairPlayByWing[wingId] ?? defaultFair,
    }),
    { name: "winged-fraud-v1" }
  )
);
