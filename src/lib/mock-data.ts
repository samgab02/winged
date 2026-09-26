/**
 * Compatibility layer over seed catalog + static match/date fixtures.
 * Seed profiles are data — not product “demo mode”.
 */

import {
  catalogAsDuoCards,
  seedPeople,
  type CatalogPerson,
} from "@/lib/seed-catalog";

export type { Gender, LookingFor } from "@/lib/seed-catalog";

export type Person = {
  id: string;
  firstName: string;
  age: number;
  city: string;
  bio: string;
  vibe: string;
  interests: string[];
  photos: string[];
  avatar: string;
};

export type DuoCard = {
  id: string;
  person: Person;
  sharkName: string;
  sharkAvatar: string;
  vouch: string;
  perfectFor: string;
};

function toPerson(p: CatalogPerson): Person {
  return {
    id: p.id,
    firstName: p.firstName,
    age: p.age,
    city: p.city,
    bio: p.bio,
    vibe: p.vibe,
    interests: p.interests,
    photos: p.photos,
    avatar: p.photos[0],
  };
}

export const people: Record<string, Person> = Object.fromEntries(
  Object.values(seedPeople).map((p) => [p.id, toPerson(p)])
);

export const sharkAvatars = {
  noa: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  dani: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  omi: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  tamar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
};

export const discoverCards: DuoCard[] = catalogAsDuoCards();
export const sharkSwipeCards: DuoCard[] = catalogAsDuoCards();

export const mockMatches = [
  {
    id: "match_maya_eli",
    duoId: "card_eli",
    person: people.maya,
    other: people.eli,
    sharkA: "Noa",
    sharkB: "Dani",
    status: "deal_room" as const,
    venue: "Cafe Xo, Florentin",
    when: "Thu · 20:00",
  },
  {
    id: "match_maya_tom",
    duoId: "card_tom",
    person: people.maya,
    other: people.tom,
    sharkA: "Noa",
    sharkB: "Noa",
    status: "new" as const,
  },
];

export const mockDates = [
  {
    id: "date_maya_eli",
    matchId: "match_maya_eli",
    pair: "Maya × Eli",
    personA: people.maya,
    personB: people.eli,
    venue: "Cafe Xo, Florentin",
    when: "Thu · 20:00",
    note: "Patio table · first coffee energy",
  },
  {
    id: "date_lina_yon",
    matchId: "match_lina_yon",
    pair: "Lina × Yonatan",
    personA: people.lina,
    personB: people.yonatan,
    venue: "Gordon Beach café",
    when: "Sat · 09:30",
    note: "Sunrise walk, then iced coffee",
  },
];

export const mockDealMessages = [
  {
    id: "m1",
    role: "system" as const,
    name: "POVI",
    body: "You’re live — pick a place and time before the clock runs out.",
  },
  {
    id: "m2",
    role: "shark" as const,
    name: "Noa",
    body: "Maya’s free Thu 20:00 — Cafe Xo, Florentin. Soft lighting.",
    self: true,
  },
  {
    id: "m3",
    role: "shark" as const,
    name: "Dani",
    body: "Eli’s in. Outdoor seating if you’ve got it.",
    self: false,
  },
  {
    id: "m4",
    role: "earpiece" as const,
    name: "Maya",
    body: "Ask if they do oat milk. Non-negotiable.",
  },
  {
    id: "m5",
    role: "shark" as const,
    name: "Noa",
    body: "Patio + oat milk confirmed. Ready to lock?",
    self: true,
  },
];

export const mockEarnings = {
  available: 350,
  pending: 100,
  txs: [
    {
      id: "e1",
      label: "Maya × Jordan — checked in",
      amount: 50,
      status: "ready" as const,
      date: "20 Sep",
    },
    {
      id: "e2",
      label: "Maya × Amir — both said it went well",
      amount: 50,
      status: "ready" as const,
      date: "12 Sep",
    },
    {
      id: "e3",
      label: "Maya × Eli — waiting for check-in",
      amount: 50,
      status: "pending" as const,
      date: "26 Sep",
    },
    {
      id: "e4",
      label: "Transferred out",
      amount: 250,
      status: "sent" as const,
      date: "6 Sep",
    },
  ],
};

export const mockSingles = [
  {
    id: "maya",
    person: people.maya,
    completeness: 92,
    status: "Live in Deal Room" as const,
  },
];

export {
  PHOTO_STARTER_PACK,
  PROFILE_PROMPT_OPTIONS,
  INTEREST_OPTIONS,
  SHARK_VIBE_QUESTIONS,
  catalogAsDuoCards,
} from "@/lib/seed-catalog";
