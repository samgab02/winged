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

export type MatchItem = {
  id: string;
  duoId: string;
  person: Person;
  other: Person;
  sharkA: string;
  sharkB: string;
  status: "new" | "deal_room" | "locked" | "flash";
  venue?: string;
  when?: string;
};

export type DateItem = {
  id: string;
  matchId: string;
  pair: string;
  personA: Person;
  personB: Person;
  venue: string;
  when: string;
  note: string;
};

export type EarningsTx = {
  id: string;
  label: string;
  amount: number;
  status: "ready" | "pending" | "sent";
  date: string;
};

const unsplash = (id: string, w = 800, h = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop`;

export const people: Record<string, Person> = {
  maya: {
    id: "maya",
    firstName: "Maya",
    age: 27,
    city: "Tel Aviv",
    bio: "Rooftop jazz, zero dry openers, always stealing the aux.",
    vibe: "Walks into a bar like she owns the Wi-Fi password.",
    interests: ["Rooftop jazz", "Late walks", "Aux wars"],
    photos: [
      unsplash("photo-1524504388940-b1c1722653e1"),
      unsplash("photo-1494790108377-be9c29b29330"),
      unsplash("photo-1529626455594-4ff0802cfb7e"),
      unsplash("photo-1517841905240-472988babdf9"),
    ],
    avatar: unsplash("photo-1524504388940-b1c1722653e1", 200, 200),
  },
  eli: {
    id: "eli",
    firstName: "Eli",
    age: 31,
    city: "Herzliya",
    bio: "Product designer. Bad at small talk, lethal at late-night falafel.",
    vibe: "Soft eyes, sharp takes. Will redesign your life pitch mid-date.",
    interests: ["Design", "Falafel runs", "Quiet bars"],
    photos: [
      unsplash("photo-1506794778202-cad84cf45f1d"),
      unsplash("photo-1500648767791-00dcc994a43e"),
      unsplash("photo-1492562080023-ab3db95bfbce"),
      unsplash("photo-1507003211169-0a1dd7228f2d"),
    ],
    avatar: unsplash("photo-1506794778202-cad84cf45f1d", 200, 200),
  },
  lina: {
    id: "lina",
    firstName: "Lina",
    age: 26,
    city: "Haifa",
    bio: "Surfer. Reads menus like contracts. Keen on sunrise dates.",
    vibe: "Salt-water energy only. Will judge your board choice first.",
    interests: ["Sunrise surf", "Salt air", "Slow mornings"],
    photos: [
      unsplash("photo-1531746020798-e6953c6e8e04"),
      unsplash("photo-1488426862026-3ee34a7d66df"),
      unsplash("photo-1524504388940-b1c1722653e1"),
      unsplash("photo-1544005313-94ddf0286df2"),
    ],
    avatar: unsplash("photo-1531746020798-e6953c6e8e04", 200, 200),
  },
  yonatan: {
    id: "yonatan",
    firstName: "Yonatan",
    age: 34,
    city: "Jerusalem",
    bio: "Chef. Will cook for you and still order dessert.",
    vibe: "Knife skills intimidating. Soft laugh redeeming.",
    interests: ["Home cooking", "Spice talk", "Dessert first"],
    photos: [
      unsplash("photo-1492562080023-ab3db95bfbce"),
      unsplash("photo-1463453091185-61582044d556"),
      unsplash("photo-1539571696357-5a69c17a67c6"),
      unsplash("photo-1506794778202-cad84cf45f1d"),
    ],
    avatar: unsplash("photo-1492562080023-ab3db95bfbce", 200, 200),
  },
  tom: {
    id: "tom",
    firstName: "Tom",
    age: 29,
    city: "Tel Aviv",
    bio: "DJ weekends, civil engineer weekdays. Brings good playlists.",
    vibe: "Will ask your favorite song before your job title.",
    interests: ["Vinyl", "Beach sunsets", "Negronis"],
    photos: [
      unsplash("photo-1539571696357-5a69c17a67c6"),
      unsplash("photo-1488161628813-04466f872be2"),
      unsplash("photo-1519085360753-af0119f7cbe7"),
    ],
    avatar: unsplash("photo-1539571696357-5a69c17a67c6", 200, 200),
  },
};

export const sharkAvatars = {
  noa: unsplash("photo-1534528741775-53994a69daeb", 200, 200),
  dani: unsplash("photo-1507003211169-0a1dd7228f2d", 200, 200),
  omi: unsplash("photo-1438761681033-6461ffad8d80", 200, 200),
  tamar: unsplash("photo-1544005313-94ddf0286df2", 200, 200),
};

export const mockPhotoLibrary = [
  unsplash("photo-1524504388940-b1c1722653e1"),
  unsplash("photo-1494790108377-be9c29b29330"),
  unsplash("photo-1529626455594-4ff0802cfb7e"),
  unsplash("photo-1517841905240-472988babdf9"),
  unsplash("photo-1531746020798-e6953c6e8e04"),
  unsplash("photo-1488426862026-3ee34a7d66df"),
];

export const discoverCards: DuoCard[] = [
  {
    id: "card_eli",
    person: people.eli,
    sharkName: "Dani",
    sharkAvatar: sharkAvatars.dani,
    vouch:
      "Eli will redesign your life pitch mid-date. Bring curiosity.",
    perfectFor: "A curious talker who likes soft eyes, sharp takes",
  },
  {
    id: "card_lina",
    person: people.lina,
    sharkName: "Omi",
    sharkAvatar: sharkAvatars.omi,
    vouch: "Lina is a sunrise person who somehow thrives at 1am.",
    perfectFor: "Someone who can match sunrise energy at 1am",
  },
  {
    id: "card_yon",
    person: people.yonatan,
    sharkName: "Tamar",
    sharkAvatar: sharkAvatars.tamar,
    vouch: "Yonatan plates romance like a tasting menu. Don’t flake.",
    perfectFor: "A date who treats dinner like a love language",
  },
  {
    id: "card_tom",
    person: people.tom,
    sharkName: "Noa",
    sharkAvatar: sharkAvatars.noa,
    vouch: "Tom’s playlists are a personality test. Pass it and you’re golden.",
    perfectFor: "Someone who dances before overthinking",
  },
];

/** Shark swipe deck — candidates for Maya */
export const sharkSwipeCards: DuoCard[] = discoverCards;

export const mockMatches: MatchItem[] = [
  {
    id: "match_maya_eli",
    duoId: "card_eli",
    person: people.maya,
    other: people.eli,
    sharkA: "Noa",
    sharkB: "Dani",
    status: "deal_room",
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
    status: "new",
  },
];

export const mockDates: DateItem[] = [
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
  ] satisfies EarningsTx[],
};

export const mockSingles = [
  {
    id: "maya",
    person: people.maya,
    completeness: 92,
    status: "Live in Deal Room" as const,
  },
];

export const interestOptions = [
  "Rooftop jazz",
  "Late walks",
  "Aux wars",
  "Sunrise surf",
  "Falafel runs",
  "Quiet bars",
  "Home cooking",
  "Beach sunsets",
  "Vinyl",
  "Negronis",
];
