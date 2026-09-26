/**
 * Winged fraud rules engine — client gates for demo + server-ready contracts.
 * Covers collusion, GPS spoofing, recycling, payment velocity, and graph abuse.
 */

export type FairPlayBand = "excellent" | "ok" | "risk" | "banned";

export type EscrowStatus =
  | "created"
  | "held"
  | "proof_pending"
  | "released"
  | "refunded"
  | "frozen"
  | "clawback";

export type FraudFlagCode =
  | "pair_already_paid"
  | "self_pair"
  | "shared_device"
  | "shared_payment"
  | "gps_teleport"
  | "gps_outside_geofence"
  | "gps_no_dwell"
  | "qr_expired"
  | "qr_reuse"
  | "velocity_payout"
  | "cooling_period"
  | "chargeback_reserve"
  | "review_disagreement"
  | "panic_freeze"
  | "hire_spam"
  | "no_show_bachelor"
  | "fair_play_demote";

export type FraudDecision = {
  allow: boolean;
  flags: FraudFlagCode[];
  message: string;
  fairPlayDelta?: number;
};

export type PairKey = string; // sorted bachelorId::otherBachelorId

export function pairKey(a: string, b: string): PairKey {
  return [a, b].sort().join("::");
}

export type EscrowLedgerEntry = {
  id: string;
  bachelorId: string;
  wingId: string;
  otherBachelorId: string;
  amountIls: number;
  wingShareIls: number;
  platformFeeIls: number;
  status: EscrowStatus;
  createdAt: string;
  updatedAt: string;
  proofAt?: string;
  releasedAt?: string;
  flags: FraudFlagCode[];
  note?: string;
};

/** Tunable economics */
export const DATE_PASS_ILS = 70;
export const WING_SHARE_ILS = 50;
export const PLATFORM_FEE_ILS = 20;
export const GEOFENCE_RADIUS_M = 45;
export const GEOFENCE_DWELL_SEC = 90;
export const QR_TTL_SEC = 30;
export const FIRST_PAYOUT_COOLING_HOURS = 48;
export const MAX_HIRES_PER_HOUR = 5;
export const MIN_WITHDRAW_AGE_HOURS = 24;
export const RESERVE_PCT_NEW_WINGS = 0.2;

export function fairPlayBand(score: number): FairPlayBand {
  if (score < 20) return "banned";
  if (score < 50) return "risk";
  if (score < 75) return "ok";
  return "excellent";
}

export function fairPlayLabel(band: FairPlayBand): string {
  switch (band) {
    case "excellent":
      return "Excellent";
    case "ok":
      return "OK";
    case "risk":
      return "Risk";
    case "banned":
      return "Banned";
  }
}

/** Cash once per unique bachelor pair in Wing history; repeats = notoriety only */
export function canPayCashForPair(
  paidPairs: PairKey[],
  bachelorA: string,
  bachelorB: string
): FraudDecision {
  const key = pairKey(bachelorA, bachelorB);
  if (paidPairs.includes(key)) {
    return {
      allow: false,
      flags: ["pair_already_paid"],
      message:
        "Cash already released for this pair. Repeat dates earn Notoriety only.",
    };
  }
  return { allow: true, flags: [], message: "Eligible for Date Pass cash." };
}

export function detectSelfPair(
  wingAccountId: string,
  bachelorAccountId: string,
  linkedIds: string[]
): FraudDecision {
  if (
    wingAccountId === bachelorAccountId ||
    linkedIds.includes(wingAccountId)
  ) {
    return {
      allow: false,
      flags: ["self_pair"],
      message: "Self-pairing is blocked. Wing cannot cash out on sockpuppets.",
    };
  }
  return { allow: true, flags: [], message: "Graph OK." };
}

export function checkGeofence(opts: {
  distanceM: number;
  prevDistanceM?: number;
  prevAtMs?: number;
  dwellSec: number;
  accuracyM: number;
}): FraudDecision {
  const flags: FraudFlagCode[] = [];
  const radius = GEOFENCE_RADIUS_M + (opts.accuracyM || 0);

  if (opts.distanceM > radius) {
    flags.push("gps_outside_geofence");
  }

  if (
    opts.prevDistanceM != null &&
    opts.prevAtMs != null &&
    Date.now() - opts.prevAtMs < 8000 &&
    Math.abs(opts.prevDistanceM - opts.distanceM) > 800
  ) {
    flags.push("gps_teleport");
  }

  if (opts.dwellSec < GEOFENCE_DWELL_SEC && !flags.includes("gps_outside_geofence")) {
    flags.push("gps_no_dwell");
  }

  if (flags.length) {
    return {
      allow: false,
      flags,
      message: flags.includes("gps_teleport")
        ? "Teleport/spoof pattern detected — payout frozen for review."
        : flags.includes("gps_no_dwell")
          ? `Stay on-site ~${GEOFENCE_DWELL_SEC}s inside the geofence.`
          : `Outside geofence (~${Math.round(opts.distanceM)}m).`,
      fairPlayDelta: flags.includes("gps_teleport") ? -15 : -2,
    };
  }

  return { allow: true, flags: [], message: "Geofence + dwell OK." };
}

export function checkQr(opts: {
  issuedAtMs: number;
  used: boolean;
  mutualScans: number;
}): FraudDecision {
  const age = (Date.now() - opts.issuedAtMs) / 1000;
  if (age > QR_TTL_SEC) {
    return {
      allow: false,
      flags: ["qr_expired"],
      message: "QR expired — regenerate a live code (≤30s).",
    };
  }
  if (opts.used) {
    return {
      allow: false,
      flags: ["qr_reuse"],
      message: "This QR was already used. Screenshots don't work.",
    };
  }
  if (opts.mutualScans < 2) {
    return {
      allow: false,
      flags: ["qr_reuse"],
      message: "Mutual live scan required — both devices must present/scan.",
    };
  }
  return { allow: true, flags: [], message: "QR handshake OK." };
}

export function checkPayoutVelocity(opts: {
  wingCreatedAtMs: number;
  payoutsLast24h: number;
  availableIls: number;
  withdrawIls: number;
  kycComplete: boolean;
  chargebacks: number;
}): FraudDecision {
  const flags: FraudFlagCode[] = [];
  const ageH = (Date.now() - opts.wingCreatedAtMs) / 3_600_000;

  if (ageH < FIRST_PAYOUT_COOLING_HOURS) {
    flags.push("cooling_period");
  }
  if (opts.payoutsLast24h >= 3) {
    flags.push("velocity_payout");
  }
  if (!opts.kycComplete && opts.withdrawIls > 0) {
    flags.push("cooling_period");
  }
  if (opts.chargebacks > 0 && opts.withdrawIls > opts.availableIls * (1 - RESERVE_PCT_NEW_WINGS)) {
    flags.push("chargeback_reserve");
  }

  if (flags.length) {
    return {
      allow: false,
      flags,
      message: flags.includes("cooling_period")
        ? `First payouts locked for ${FIRST_PAYOUT_COOLING_HOURS}h + KYC (Stripe Connect).`
        : flags.includes("chargeback_reserve")
          ? "Reserve held after chargeback risk — reduce withdraw amount."
          : "Payout velocity limit — try again tomorrow.",
      fairPlayDelta: -5,
    };
  }

  return { allow: true, flags: [], message: "Withdraw allowed." };
}

export function checkHireRate(hiresLastHour: number): FraudDecision {
  if (hiresLastHour >= MAX_HIRES_PER_HOUR) {
    return {
      allow: false,
      flags: ["hire_spam"],
      message: "Hire rate limit — Pros can decline; try later.",
    };
  }
  return { allow: true, flags: [], message: "Hire OK." };
}

export function nextEscrowStatus(
  current: EscrowStatus,
  event:
    | "hold"
    | "proof_start"
    | "proof_ok"
    | "proof_fail"
    | "freeze"
    | "clawback"
    | "refund"
): EscrowStatus {
  switch (event) {
    case "hold":
      return current === "created" ? "held" : current;
    case "proof_start":
      return current === "held" ? "proof_pending" : current;
    case "proof_ok":
      return current === "proof_pending" || current === "held"
        ? "released"
        : current;
    case "proof_fail":
      return "refunded";
    case "freeze":
      return "frozen";
    case "clawback":
      return "clawback";
    case "refund":
      return "refunded";
    default:
      return current;
  }
}

export function createEscrow(opts: {
  bachelorId: string;
  wingId: string;
  otherBachelorId: string;
}): EscrowLedgerEntry {
  const now = new Date().toISOString();
  return {
    id: `esc_${Date.now().toString(36)}`,
    bachelorId: opts.bachelorId,
    wingId: opts.wingId,
    otherBachelorId: opts.otherBachelorId,
    amountIls: DATE_PASS_ILS,
    wingShareIls: WING_SHARE_ILS,
    platformFeeIls: PLATFORM_FEE_ILS,
    status: "created",
    createdAt: now,
    updatedAt: now,
    flags: [],
  };
}

/** Human-readable catalog of controls (UI + docs). */
export const FRAUD_CONTROL_CATALOG: {
  attack: string;
  control: string;
  code: FraudFlagCode;
}[] = [
  {
    attack: "Same friends scan QR repeatedly",
    control: "Dynamic QR ≤30s; one cash payout per pair forever",
    code: "pair_already_paid",
  },
  {
    attack: "Fake GPS / spoofed location",
    control: "Geofence + dwell + teleport detection",
    code: "gps_teleport",
  },
  {
    attack: "Screenshot QR share",
    control: "Rotating QR + mutual live scan handshake",
    code: "qr_reuse",
  },
  {
    attack: "Wing dates own sockpuppet",
    control: "Graph ban on self-pair / shared instruments",
    code: "self_pair",
  },
  {
    attack: "Friendly fraud / chargebacks",
    control: "Cooling period, KYC, reserve % on new Wings",
    code: "chargeback_reserve",
  },
  {
    attack: "Rapid earn → withdraw",
    control: "Velocity limits + Stripe Connect KYC",
    code: "velocity_payout",
  },
  {
    attack: "Spam Hire",
    control: "Rate-limit hires; Pro can decline",
    code: "hire_spam",
  },
  {
    attack: "Venue farming without entering",
    control: "Mandatory dwell inside geofence",
    code: "gps_no_dwell",
  },
  {
    attack: "Coercion / unsafe date",
    control: "Panic flag freezes payout",
    code: "panic_freeze",
  },
  {
    attack: "Review disagreement",
    control: "Double-blind surveys → freeze + review",
    code: "review_disagreement",
  },
];
