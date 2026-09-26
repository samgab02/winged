/**
 * Seed catalog — development data only.
 * Powers Discover/Swipe when the store would otherwise be empty.
 * Never surface as “demo mode” in product UI.
 */

export type Gender = "man" | "woman" | "nonbinary";
export type LookingFor = "men" | "women" | "everyone";

export type ProfilePrompt = {
  question: string;
  answer: string;
};

export type CatalogPerson = {
  id: string;
  role: "bachelor" | "wing";
  gender: Gender;
  firstName: string;
  age: number;
  city: string;
  photos: string[];
  vibe: string;
  bio: string;
  interests: string[];
  prompts: ProfilePrompt[];
  lookingFor: LookingFor;
  wingName?: string;
  wingAvatar?: string;
  vouch?: string;
  perfectFor?: string;
};

const u = (id: string, w = 800, h = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop`;

export const PHOTO_STARTER_PACK = [
  u("photo-1524504388940-b1c1722653e1"),
  u("photo-1494790108377-be9c29b29330"),
  u("photo-1529626455594-4ff0802cfb7e"),
  u("photo-1517841905240-472988babdf9"),
  u("photo-1531746020798-e6953c6e8e04"),
  u("photo-1488426862026-3ee34a7d66df"),
  u("photo-1506794778202-cad84cf45f1d"),
  u("photo-1500648767791-00dcc994a43e"),
  u("photo-1492562080023-ab3db95bfbce"),
  u("photo-1539571696357-5a69c17a67c6"),
  u("photo-1519085360753-af0119f7cbe7"),
  u("photo-1488161628813-04466f872be2"),
];

export const PROFILE_PROMPT_OPTIONS = [
  "A perfect first date looks like…",
  "I’m weirdly good at…",
  "The way to my heart is…",
  "My friends would describe me as…",
  "Don’t text me if…",
  "Green flag I look for…",
];

export const INTEREST_OPTIONS = [
  "Rooftop jazz",
  "Late walks",
  "Sunrise surf",
  "Falafel runs",
  "Quiet bars",
  "Home cooking",
  "Beach sunsets",
  "Vinyl",
  "Gallery hopping",
  "Negronis",
  "Farmers markets",
  "Road trips",
];

export const WING_VIBE_QUESTIONS = [
  "What’s their most magnetic trait in a room?",
  "What should someone never do on a first date with them?",
  "One sentence roast that still feels affectionate?",
];

export const seedPeople: Record<string, CatalogPerson> = {
  eli: {
    id: "eli",
    role: "bachelor",
    gender: "man",
    firstName: "Eli",
    age: 31,
    city: "Herzliya",
    photos: [
      u("photo-1506794778202-cad84cf45f1d"),
      u("photo-1500648767791-00dcc994a43e"),
      u("photo-1492562080023-ab3db95bfbce"),
      u("photo-1507003211169-0a1dd7228f2d"),
    ],
    vibe: "Soft eyes, sharp takes. Will redesign your life pitch mid-date.",
    bio: "Product designer. Bad at small talk, lethal at late-night falafel.",
    interests: ["Design", "Falafel runs", "Quiet bars"],
    prompts: [
      {
        question: "A perfect first date looks like…",
        answer: "Walk + one good question + dessert we both pretend we didn’t need.",
      },
    ],
    lookingFor: "women",
    wingName: "Dani",
    wingAvatar: u("photo-1507003211169-0a1dd7228f2d", 200, 200),
    vouch: "Eli will redesign your life pitch mid-date. Bring curiosity.",
    perfectFor: "A curious talker who likes soft eyes, sharp takes",
  },
  lina: {
    id: "lina",
    role: "bachelor",
    gender: "woman",
    firstName: "Lina",
    age: 26,
    city: "Haifa",
    photos: [
      u("photo-1531746020798-e6953c6e8e04"),
      u("photo-1488426862026-3ee34a7d66df"),
      u("photo-1529626455594-4ff0802cfb7e"),
      u("photo-1544005313-94ddf0286df2"),
    ],
    vibe: "Salt-water energy only. Will judge your board choice first.",
    bio: "Surfer. Reads menus like contracts. Keen on sunrise dates.",
    interests: ["Sunrise surf", "Salt air", "Slow mornings"],
    prompts: [
      {
        question: "The way to my heart is…",
        answer: "Show up on time with cold brew and zero ego.",
      },
    ],
    lookingFor: "men",
    wingName: "Omi",
    wingAvatar: u("photo-1438761681033-6461ffad8d80", 200, 200),
    vouch: "Lina is a sunrise person who somehow thrives at 1am.",
    perfectFor: "Someone who can match sunrise energy at 1am",
  },
  yonatan: {
    id: "yonatan",
    role: "bachelor",
    gender: "man",
    firstName: "Yonatan",
    age: 34,
    city: "Jerusalem",
    photos: [
      u("photo-1492562080023-ab3db95bfbce"),
      u("photo-1463453091185-61582044d556"),
      u("photo-1539571696357-5a69c17a67c6"),
      u("photo-1506794778202-cad84cf45f1d"),
    ],
    vibe: "Knife skills intimidating. Soft laugh redeeming.",
    bio: "Chef. Will cook for you and still order dessert.",
    interests: ["Home cooking", "Spice talk", "Dessert first"],
    prompts: [
      {
        question: "I’m weirdly good at…",
        answer: "Turning leftovers into a love language.",
      },
    ],
    lookingFor: "women",
    wingName: "Tamar",
    wingAvatar: u("photo-1544005313-94ddf0286df2", 200, 200),
    vouch: "Yonatan plates romance like a tasting menu. Don’t flake.",
    perfectFor: "A date who treats dinner like a love language",
  },
  tom: {
    id: "tom",
    role: "bachelor",
    gender: "man",
    firstName: "Tom",
    age: 29,
    city: "Tel Aviv",
    photos: [
      u("photo-1539571696357-5a69c17a67c6"),
      u("photo-1488161628813-04466f872be2"),
      u("photo-1519085360753-af0119f7cbe7"),
    ],
    vibe: "Will ask your favorite song before your job title.",
    bio: "DJ weekends, civil engineer weekdays. Brings good playlists.",
    interests: ["Vinyl", "Beach sunsets", "Negronis"],
    prompts: [
      {
        question: "Green flag I look for…",
        answer: "Someone who dances before overthinking.",
      },
    ],
    lookingFor: "everyone",
    wingName: "Noa",
    wingAvatar: u("photo-1534528741775-53994a69daeb", 200, 200),
    vouch: "Tom’s playlists are a personality test. Pass it and you’re golden.",
    perfectFor: "Someone who dances before overthinking",
  },
  maya: {
    id: "maya",
    role: "bachelor",
    gender: "woman",
    firstName: "Maya",
    age: 27,
    city: "Tel Aviv",
    photos: [
      u("photo-1524504388940-b1c1722653e1"),
      u("photo-1494790108377-be9c29b29330"),
      u("photo-1529626455594-4ff0802cfb7e"),
      u("photo-1517841905240-472988babdf9"),
    ],
    vibe: "Walks into a bar like she owns the Wi-Fi password.",
    bio: "Rooftop jazz, zero dry openers, always stealing the aux.",
    interests: ["Rooftop jazz", "Late walks", "Aux wars"],
    prompts: [
      {
        question: "A perfect first date looks like…",
        answer: "Somewhere loud enough to hide awkward pauses.",
      },
    ],
    lookingFor: "men",
    wingName: "Noa",
    wingAvatar: u("photo-1534528741775-53994a69daeb", 200, 200),
    vouch: "Maya is chaos with perfect eyeliner.",
    perfectFor: "Someone who laughs first and plans second",
  },
};

export function catalogAsDuoCards(lookingFor?: LookingFor) {
  return Object.values(seedPeople)
    .filter((p) => p.role === "bachelor")
    .filter((p) => {
      if (!lookingFor || lookingFor === "everyone") return true;
      if (lookingFor === "men") return p.gender === "man";
      if (lookingFor === "women") return p.gender === "woman";
      return true;
    })
    .map((p) => ({
      id: `card_${p.id}`,
      person: {
        id: p.id,
        firstName: p.firstName,
        age: p.age,
        city: p.city,
        bio: p.bio,
        vibe: p.vibe,
        interests: p.interests,
        photos: p.photos,
        avatar: p.photos[0],
      },
      wingName: p.wingName ?? "Wing",
      wingAvatar: p.wingAvatar ?? p.photos[0],
      vouch: p.vouch ?? p.vibe,
      perfectFor: p.perfectFor ?? p.bio,
    }));
}

export function ageFromBirthday(birthday: string): number {
  const born = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const m = now.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age -= 1;
  return age;
}

export function isAdult(birthday: string): boolean {
  return ageFromBirthday(birthday) >= 18;
}
