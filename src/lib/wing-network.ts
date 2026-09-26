/** Wings network mock + tier helpers */

export type WingMode = "friend" | "pro" | "both";

export type WingTierId =
  | "friend_wing"
  | "baby_wing"
  | "pro_matchmaker"
  | "rizz_master";

export type WingStats = {
  datesLocked: number;
  conversionPct: number;
  activeSingles: number;
  notoriety: number;
};

export type NetworkWing = {
  id: string;
  name: string;
  city: string;
  avatar: string;
  bio: string;
  vouchStyle: string;
  tier: WingTierId;
  mode: WingMode;
  openToHire: boolean;
  stats: WingStats;
};

export const TIER_LABEL: Record<WingTierId, string> = {
  friend_wing: "Friend Wing",
  baby_wing: "Baby Wing",
  pro_matchmaker: "Pro Matchmaker",
  rizz_master: "Rizz Master",
};

export const MODE_LABEL: Record<WingMode, string> = {
  friend: "Friend",
  pro: "Pro",
  both: "Friend + Pro",
};

export const DEFAULT_WING_STATS: WingStats = {
  datesLocked: 0,
  conversionPct: 0,
  activeSingles: 0,
  notoriety: 0,
};

export const mockNetworkWings: NetworkWing[] = [
  {
    id: "nw_noa",
    name: "Noa",
    city: "Tel Aviv",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    bio: "Rooftop jazz, sharp vouch lines, zero fluff.",
    vouchStyle: "Warm roast → soft close",
    tier: "rizz_master",
    mode: "both",
    openToHire: true,
    stats: {
      datesLocked: 28,
      conversionPct: 64,
      activeSingles: 2,
      notoriety: 920,
    },
  },
  {
    id: "nw_dani",
    name: "Dani",
    city: "Herzliya",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "Product brain, date logistics nerd.",
    vouchStyle: "Straight talk + venue picks",
    tier: "pro_matchmaker",
    mode: "pro",
    openToHire: true,
    stats: {
      datesLocked: 19,
      conversionPct: 58,
      activeSingles: 3,
      notoriety: 710,
    },
  },
  {
    id: "nw_omi",
    name: "Omi",
    city: "Jaffa",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    bio: "Winging her best friend — and loving it.",
    vouchStyle: "Sisterly hype",
    tier: "friend_wing",
    mode: "friend",
    openToHire: false,
    stats: {
      datesLocked: 6,
      conversionPct: 72,
      activeSingles: 1,
      notoriety: 240,
    },
  },
  {
    id: "nw_tamar",
    name: "Tamar",
    city: "Tel Aviv",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    bio: "New to Pro — open evenings, Date Pass ready.",
    vouchStyle: "Curious + kind",
    tier: "baby_wing",
    mode: "pro",
    openToHire: true,
    stats: {
      datesLocked: 3,
      conversionPct: 50,
      activeSingles: 1,
      notoriety: 110,
    },
  },
  {
    id: "nw_leo",
    name: "Leo",
    city: "Ramot",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    bio: "Weekend Pro slots. Locks patio dates fast.",
    vouchStyle: "Logistics king",
    tier: "pro_matchmaker",
    mode: "both",
    openToHire: true,
    stats: {
      datesLocked: 14,
      conversionPct: 61,
      activeSingles: 2,
      notoriety: 480,
    },
  },
  {
    id: "nw_sira",
    name: "Sira",
    city: "Florentin",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    bio: "Friend Wing for two roommates. No paid gigs.",
    vouchStyle: "Playful vouch clips",
    tier: "friend_wing",
    mode: "friend",
    openToHire: false,
    stats: {
      datesLocked: 9,
      conversionPct: 67,
      activeSingles: 2,
      notoriety: 310,
    },
  },
];

/** Bachelor's linked Wing card (mock detail) */
export const mockMyWing = {
  id: "nw_noa",
  name: "Noa",
  city: "Tel Aviv",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  bio: "Your Friend Wing — also open for Pro Date Pass work.",
  vouchStyle: "Warm roast → soft close",
  tier: "rizz_master" as WingTierId,
  mode: "both" as WingMode,
  relation: "friend" as const,
  since: "Aug 2025",
  stats: {
    datesLocked: 28,
    conversionPct: 64,
    activeSingles: 2,
    notoriety: 920,
  },
  inviteLink: "https://winged.app/invite/noa",
};

export function modeSupportsPro(mode: WingMode | undefined): boolean {
  return mode === "pro" || mode === "both";
}

export function modeSupportsFriend(mode: WingMode | undefined): boolean {
  return mode === "friend" || mode === "both" || !mode;
}
