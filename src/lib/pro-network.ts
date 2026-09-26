/** Rich Pro Wings social network seed data */

import type { WingTierId } from "@/lib/wing-network";

export type ProStats = {
  datesLocked: number;
  showUpRate: number;
  conversionPct: number;
  avgVibe: number;
  responseMins: number;
  activeSingles: number;
  streak: number;
  fairPlay: number;
  weeklyLocks: number;
};

export type ProReview = {
  id: string;
  from: string;
  rating: number;
  text: string;
  when: string;
};

export type ProWin = {
  id: string;
  blurb: string;
  city: string;
  when: string;
};

export type NetworkPost = {
  id: string;
  wingId: string;
  wingName: string;
  avatar: string;
  kind: "tip" | "request" | "win" | "open";
  body: string;
  when: string;
  likes: number;
  city: string;
};

export type ProProfile = {
  id: string;
  name: string;
  city: string;
  languages: string[];
  avatar: string;
  cover: string;
  bio: string;
  tier: WingTierId;
  priceBand: "₪" | "₪₪" | "₪₪₪";
  specialties: string[];
  vouchStyle: string;
  vibeTape: { q: string; a: string }[];
  stats: ProStats;
  wins: ProWin[];
  reviews: ProReview[];
  availability: string[];
  collabWith: string[];
  openToHire: boolean;
};

export const proProfiles: ProProfile[] = [
  {
    id: "nw_noa",
    name: "Noa",
    city: "Tel Aviv",
    languages: ["Hebrew", "English"],
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=600&fit=crop",
    bio: "Rooftop jazz, sharp vouch lines, zero fluff. I lock dates that feel like a film still.",
    tier: "rizz_master",
    priceBand: "₪₪₪",
    specialties: ["First dates", "25–35", "Queer-friendly", "Hebrew/English"],
    vouchStyle: "Warm roast → soft close",
    vibeTape: [
      {
        q: "How I wing",
        a: "I listen for the spark, then negotiate like a kind lawyer.",
      },
      {
        q: "Roast sample",
        a: "She’s chaos with perfect eyeliner — bring curiosity, not a pitch deck.",
      },
      {
        q: "Never on a first date",
        a: "Crypto bags and ‘what’s your 5-year plan’ quizzes.",
      },
    ],
    stats: {
      datesLocked: 28,
      showUpRate: 96,
      conversionPct: 64,
      avgVibe: 4.7,
      responseMins: 8,
      activeSingles: 2,
      streak: 5,
      fairPlay: 91,
      weeklyLocks: 4,
    },
    wins: [
      {
        id: "w1",
        blurb: "Locked rooftop date · both Kept",
        city: "Tel Aviv",
        when: "2d ago",
      },
      {
        id: "w2",
        blurb: "Patio + oat milk in 2:40",
        city: "Florentin",
        when: "5d ago",
      },
    ],
    reviews: [
      {
        id: "r1",
        from: "Verified dater",
        rating: 5,
        text: "Felt safe, funny, and actually showed up. Rare.",
        when: "1w ago",
      },
      {
        id: "r2",
        from: "Verified dater",
        rating: 5,
        text: "Her vouch was so accurate I laughed mid-sip.",
        when: "2w ago",
      },
    ],
    availability: ["Tonight 20:00–22:00", "Thu evenings", "Sun brunch slots"],
    collabWith: ["nw_dani", "nw_leo"],
    openToHire: true,
  },
  {
    id: "nw_dani",
    name: "Dani",
    city: "Herzliya",
    languages: ["Hebrew", "English"],
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=600&fit=crop",
    bio: "Product brain, date logistics nerd. I treat Deal Room like a sprint.",
    tier: "pro_matchmaker",
    priceBand: "₪₪",
    specialties: ["First dates", "Tech crowd", "Weeknights"],
    vouchStyle: "Straight talk + venue picks",
    vibeTape: [
      {
        q: "How I wing",
        a: "Clear constraints, good lighting, exit plans if vibes die.",
      },
      {
        q: "Roast sample",
        a: "He’ll redesign your life pitch mid-date — bring curiosity.",
      },
    ],
    stats: {
      datesLocked: 19,
      showUpRate: 94,
      conversionPct: 58,
      avgVibe: 4.5,
      responseMins: 12,
      activeSingles: 3,
      streak: 3,
      fairPlay: 88,
      weeklyLocks: 3,
    },
    wins: [
      {
        id: "w1",
        blurb: "Port sunset walk locked",
        city: "Jaffa",
        when: "3d ago",
      },
    ],
    reviews: [
      {
        id: "r1",
        from: "Verified dater",
        rating: 4,
        text: "Super organized. Date felt easy.",
        when: "1w ago",
      },
    ],
    availability: ["Weeknights after 19:00", "Fri early"],
    collabWith: ["nw_noa"],
    openToHire: true,
  },
  {
    id: "nw_tamar",
    name: "Tamar",
    city: "Tel Aviv",
    languages: ["Hebrew", "English", "French"],
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop",
    bio: "New to Pro — open evenings, Date Pass ready. Soft landings only.",
    tier: "baby_wing",
    priceBand: "₪",
    specialties: ["Soft first dates", "22–28", "Artsy"],
    vouchStyle: "Curious + kind",
    vibeTape: [
      { q: "How I wing", a: "I ask better questions than a dating app form." },
    ],
    stats: {
      datesLocked: 3,
      showUpRate: 100,
      conversionPct: 50,
      avgVibe: 4.8,
      responseMins: 20,
      activeSingles: 1,
      streak: 2,
      fairPlay: 86,
      weeklyLocks: 1,
    },
    wins: [
      {
        id: "w1",
        blurb: "First lock — cafe, both Kept",
        city: "Tel Aviv",
        when: "4d ago",
      },
    ],
    reviews: [],
    availability: ["Open evenings"],
    collabWith: ["nw_sira"],
    openToHire: true,
  },
  {
    id: "nw_leo",
    name: "Leo",
    city: "Ramot",
    languages: ["Hebrew", "English"],
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
    bio: "Weekend Pro slots. Locks patio dates fast without the bro energy.",
    tier: "pro_matchmaker",
    priceBand: "₪₪",
    specialties: ["Weekends", "Outdoor", "28–40"],
    vouchStyle: "Logistics king",
    vibeTape: [
      { q: "How I wing", a: "I pre-clear the patio and the oat milk." },
    ],
    stats: {
      datesLocked: 14,
      showUpRate: 93,
      conversionPct: 61,
      avgVibe: 4.4,
      responseMins: 15,
      activeSingles: 2,
      streak: 1,
      fairPlay: 84,
      weeklyLocks: 2,
    },
    wins: [],
    reviews: [
      {
        id: "r1",
        from: "Verified dater",
        rating: 5,
        text: "Zero chaos. Date just… happened.",
        when: "3w ago",
      },
    ],
    availability: ["Sat–Sun afternoons"],
    collabWith: ["nw_noa", "nw_dani"],
    openToHire: true,
  },
];

export const networkFeed: NetworkPost[] = [
  {
    id: "p1",
    wingId: "nw_noa",
    wingName: "Noa",
    avatar: proProfiles[0].avatar,
    kind: "win",
    body: "Locked a Norman rooftop in 2:18. Both Kept. Fair-play > volume.",
    when: "2h ago",
    likes: 24,
    city: "Tel Aviv",
  },
  {
    id: "p2",
    wingId: "nw_dani",
    wingName: "Dani",
    avatar: proProfiles[1].avatar,
    kind: "tip",
    body: "Tip: ask for outdoor seating before you pitch the time. Light fixes chemistry.",
    when: "5h ago",
    likes: 41,
    city: "Herzliya",
  },
  {
    id: "p3",
    wingId: "nw_tamar",
    wingName: "Tamar",
    avatar: proProfiles[2].avatar,
    kind: "open",
    body: "Open tonight for a soft first-date assist — looking for a friend Wing to pair-vouch.",
    when: "6h ago",
    likes: 11,
    city: "Tel Aviv",
  },
  {
    id: "p4",
    wingId: "nw_leo",
    wingName: "Leo",
    avatar: proProfiles[3].avatar,
    kind: "request",
    body: "Bachelor needs weekend patio energy. Hebrew/English. Date Pass ready.",
    when: "1d ago",
    likes: 8,
    city: "Ramot",
  },
  {
    id: "p5",
    wingId: "nw_noa",
    wingName: "Noa",
    avatar: proProfiles[0].avatar,
    kind: "tip",
    body: "Never cash the same pair twice. Notoriety is the long game.",
    when: "1d ago",
    likes: 63,
    city: "Tel Aviv",
  },
];

export function getPro(id: string): ProProfile | undefined {
  return proProfiles.find((p) => p.id === id);
}
