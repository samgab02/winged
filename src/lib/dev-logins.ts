/**
 * Default local logins for easy development.
 * Seeded into localStorage on first visit — not product “demo mode” chrome.
 */

import {
  digestPassword,
  type AccountRecord,
} from "@/lib/auth";
import {
  PHOTO_STARTER_PACK,
  seedPeople,
  type Gender,
  type LookingFor,
  type ProfilePrompt,
} from "@/lib/seed-catalog";

const ACCOUNTS_KEY = "povi-accounts-v1";
const SEEDED_FLAG = "povi-dev-logins-seeded-v1";

export const DEV_PASSWORD = "povi123";

export type DevProfileSeed = {
  role: "bachelor" | "shark";
  gender: Gender;
  displayName: string;
  birthday: string;
  city: string;
  photos: string[];
  prompts: ProfilePrompt[];
  interests: string[];
  lookingFor: LookingFor;
  sharkMode: "friend" | "pro";
  linkedSharkName: string;
  linkedBachelorName: string;
  vibeLine: string;
  bio: string;
  onboardingComplete: boolean;
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
const noaPhoto = PHOTO_STARTER_PACK[4];

export const DEV_LOGINS: DevLogin[] = [
  {
    id: "acc_dev_bachelor",
    email: "bachelor@povi.app",
    password: DEV_PASSWORD,
    label: "Bachelor",
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
      sharkMode: "friend",
      linkedSharkName: "Noa",
      linkedBachelorName: maya.firstName,
      vibeLine: maya.vibe,
      bio: maya.bio,
      onboardingComplete: true,
    },
  },
  {
    id: "acc_dev_shark",
    email: "shark@povi.app",
    password: DEV_PASSWORD,
    label: "Shark",
    profile: {
      role: "shark",
      gender: "woman",
      displayName: "Noa",
      birthday: "1995-03-20",
      city: "Tel Aviv",
      photos: [noaPhoto],
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
      sharkMode: "friend",
      linkedSharkName: "Noa",
      linkedBachelorName: "Maya",
      vibeLine: "Maya is chaos with perfect eyeliner.",
      bio: "Friend Shark · Tel Aviv",
      onboardingComplete: true,
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
