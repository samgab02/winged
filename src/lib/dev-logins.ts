/**
 * Default local logins for easy development.
 * Seeded into localStorage on first visit — not product “demo mode” chrome.
 */

import {
  digestPassword,
  type AccountRecord,
} from "@/lib/auth";
import {
  seedPeople,
  type Gender,
  type LookingFor,
  type ProfilePrompt,
} from "@/lib/seed-catalog";
import { IDENTITY_PHOTO, samePersonPhotos } from "@/lib/photo-sets";
import type { AppearancePref } from "@/lib/theme";
import type { WingMode, WingStats, WingTierId } from "@/lib/wing-network";

const ACCOUNTS_KEY = "winged-accounts-v1";
const SEEDED_FLAG = "winged-dev-logins-seeded-v1";

export const DEV_PASSWORD = "winged123";

export type DevProfileSeed = {
  role: "bachelor" | "wing";
  gender: Gender;
  displayName: string;
  birthday: string;
  city: string;
  photos: string[];
  prompts: ProfilePrompt[];
  interests: string[];
  lookingFor: LookingFor;
  wingMode: WingMode;
  wingTier: WingTierId;
  wingStats: WingStats;
  openToHire: boolean;
  linkedWingName: string;
  linkedBachelorName: string;
  vibeLine: string;
  bio: string;
  onboardingComplete: boolean;
  appearance: AppearancePref;
};

export type DevLogin = {
  id: string;
  email: string;
  password: string;
  label: string;
  profile: DevProfileSeed;
};

export type SeededProfile = DevProfileSeed & { accountId: string };

const maya = seedPeople.maya;
const eli = seedPeople.eli;
const noaPhotos = samePersonPhotos(IDENTITY_PHOTO.noa, 4);

export const DEV_LOGINS: DevLogin[] = [
  {
    id: "acc_dev_bachelor",
    email: "bachelor@winged.app",
    password: DEV_PASSWORD,
    label: "Bachelor · woman",
    profile: {
      role: "bachelor",
      gender: "woman",
      displayName: maya.firstName,
      birthday: "1998-04-12",
      city: maya.city,
      photos: maya.photos,
      prompts: maya.prompts,
      interests: maya.interests,
      lookingFor: maya.lookingFor,
      wingMode: "friend",
      wingTier: "friend_wing",
      wingStats: {
        datesLocked: 4,
        conversionPct: 55,
        activeSingles: 0,
        notoriety: 80,
      },
      openToHire: false,
      linkedWingName: "Noa",
      linkedBachelorName: maya.firstName,
      vibeLine: maya.vibe,
      bio: maya.bio,
      onboardingComplete: true,
      appearance: "auto",
    },
  },
  {
    id: "acc_dev_bachelor_man",
    email: "man@winged.app",
    password: DEV_PASSWORD,
    label: "Bachelor · man",
    profile: {
      role: "bachelor",
      gender: "man",
      displayName: eli.firstName,
      birthday: "1994-08-03",
      city: eli.city,
      photos: eli.photos,
      prompts: eli.prompts,
      interests: eli.interests,
      lookingFor: eli.lookingFor,
      wingMode: "friend",
      wingTier: "friend_wing",
      wingStats: {
        datesLocked: 2,
        conversionPct: 40,
        activeSingles: 0,
        notoriety: 40,
      },
      openToHire: false,
      linkedWingName: "Dani",
      linkedBachelorName: eli.firstName,
      vibeLine: eli.vibe,
      bio: eli.bio,
      onboardingComplete: true,
      appearance: "auto",
    },
  },
  {
    id: "acc_dev_wing",
    email: "wing@winged.app",
    password: DEV_PASSWORD,
    label: "Wing",
    profile: {
      role: "wing",
      gender: "woman",
      displayName: "Noa",
      birthday: "1995-03-20",
      city: "Tel Aviv",
      photos: noaPhotos,
      prompts: [
        {
          question: "What’s their most magnetic trait in a room?",
          answer: "She walks in like she owns the Wi-Fi password.",
        },
        {
          question: "What should someone never do on a first date with them?",
          answer: "Talk about their crypto bag.",
        },
        {
          question: "One sentence roast that still feels affectionate?",
          answer: "Maya is chaos with perfect eyeliner.",
        },
      ],
      interests: ["Matchmaking", "Rooftop jazz"],
      lookingFor: "everyone",
      wingMode: "both",
      wingTier: "rizz_master",
      wingStats: {
        datesLocked: 28,
        conversionPct: 64,
        activeSingles: 2,
        notoriety: 920,
      },
      openToHire: true,
      linkedWingName: "Noa",
      linkedBachelorName: "Maya",
      vibeLine: "Maya is chaos with perfect eyeliner.",
      bio: "Friend + Pro Wing · Tel Aviv",
      onboardingComplete: true,
      appearance: "auto",
    },
  },
];

function readAccounts(): AccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AccountRecord[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/** Ensure default accounts exist (idempotent). Returns profiles to merge into the store. */
export async function ensureDevLogins(): Promise<
  Record<string, SeededProfile>
> {
  if (typeof window === "undefined") return {};

  const existing = readAccounts();
  const byEmail = new Map(existing.map((a) => [a.email, a]));
  const profiles: Record<string, SeededProfile> = {};
  let changed = false;

  for (const login of DEV_LOGINS) {
    let account = byEmail.get(login.email);
    if (!account) {
      const passwordDigest = await digestPassword(login.password, login.id);
      account = {
        id: login.id,
        email: login.email,
        passwordDigest,
        createdAt: new Date().toISOString(),
      };
      existing.push(account);
      byEmail.set(login.email, account);
      changed = true;
    }
    profiles[account.id] = {
      accountId: account.id,
      ...login.profile,
    };
  }

  if (changed || !localStorage.getItem(SEEDED_FLAG)) {
    writeAccounts(existing);
    localStorage.setItem(SEEDED_FLAG, "1");
  }

  return profiles;
}

export function clearDevLoginSeedFlag() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SEEDED_FLAG);
}
