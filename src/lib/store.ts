"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Gender, LookingFor, ProfilePrompt } from "@/lib/seed-catalog";
import { deleteAccount, signOut as authSignOut } from "@/lib/auth";
import { clearDevLoginSeedFlag, ensureDevLogins } from "@/lib/dev-logins";
import type { AppearancePref } from "@/lib/theme";
import type { WingMode, WingStats, WingTierId } from "@/lib/wing-network";
import { DEFAULT_WING_STATS } from "@/lib/wing-network";

export type AppRole = "bachelor" | "wing";

export type UserProfile = {
  accountId: string;
  role: AppRole;
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
  /** Appearance override; auto follows gender */
  appearance: AppearancePref;
};

type AppState = {
  accountId: string | null;
  profile: UserProfile | null;
  /** profiles keyed by accountId */
  profilesByAccount: Record<string, UserProfile>;
  lockedDateIds: string[];
  flashVerdicts: Record<string, "keep" | "skip">;
  toast: string | null;

  hydrateSession: (accountId: string | null) => void;
  setAccount: (accountId: string) => void;
  upsertProfile: (partial: Partial<UserProfile> & { accountId: string }) => void;
  completeOnboarding: () => void;
  lockDate: (id: string) => void;
  setFlashVerdict: (id: string, verdict: "keep" | "skip") => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  signOutLocal: () => void;
  wipeLocalAccount: () => void;
  resetLocalData: () => void;
  switchShell: () => void;
  /** Merge seeded default-login profiles (keeps any richer local edits). */
  bootstrapDevLogins: () => Promise<void>;
};

const emptyProfile = (accountId: string): UserProfile => ({
  accountId,
  role: "bachelor",
  gender: "woman",
  displayName: "",
  birthday: "",
  city: "",
  photos: [],
  prompts: [],
  interests: [],
  lookingFor: "everyone",
  wingMode: "friend",
  wingTier: "friend_wing",
  wingStats: { ...DEFAULT_WING_STATS },
  openToHire: false,
  linkedWingName: "Noa",
  linkedBachelorName: "Maya",
  vibeLine: "",
  bio: "",
  onboardingComplete: false,
  appearance: "auto",
});

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      accountId: null,
      profile: null,
      profilesByAccount: {},
      lockedDateIds: [],
      flashVerdicts: {},
      toast: null,

      hydrateSession: (accountId) => {
        if (!accountId) {
          set({ accountId: null, profile: null });
          return;
        }
        const existing = get().profilesByAccount[accountId];
        const profile = {
          ...emptyProfile(accountId),
          ...(existing ?? {}),
          accountId,
        };
        set({
          accountId,
          profile,
          profilesByAccount: {
            ...get().profilesByAccount,
            [accountId]: profile,
          },
        });
      },

      setAccount: (accountId) => {
        const existing = get().profilesByAccount[accountId];
        const profile = {
          ...emptyProfile(accountId),
          ...(existing ?? {}),
          accountId,
        };
        set({
          accountId,
          profile,
          profilesByAccount: {
            ...get().profilesByAccount,
            [accountId]: profile,
          },
        });
      },

      upsertProfile: (partial) => {
        const id = partial.accountId;
        const current = {
          ...emptyProfile(id),
          ...(get().profilesByAccount[id] ?? get().profile ?? {}),
          accountId: id,
        };
        const next = { ...current, ...partial, accountId: id };
        set({
          profile: get().accountId === id ? next : get().profile,
          profilesByAccount: {
            ...get().profilesByAccount,
            [id]: next,
          },
        });
      },

      completeOnboarding: () => {
        const profile = get().profile;
        if (!profile) return;
        const next = { ...profile, onboardingComplete: true };
        set({
          profile: next,
          profilesByAccount: {
            ...get().profilesByAccount,
            [profile.accountId]: next,
          },
        });
      },

      lockDate: (id) =>
        set({
          lockedDateIds: Array.from(new Set([...get().lockedDateIds, id])),
        }),

      setFlashVerdict: (id, verdict) =>
        set({
          flashVerdicts: { ...get().flashVerdicts, [id]: verdict },
        }),

      showToast: (message) => {
        set({ toast: message });
        setTimeout(() => {
          if (get().toast === message) set({ toast: null });
        }, 2600);
      },

      clearToast: () => set({ toast: null }),

      signOutLocal: () => {
        authSignOut();
        set({ accountId: null, profile: null });
      },

      wipeLocalAccount: () => {
        const id = get().accountId;
        if (!id) return;
        deleteAccount(id);
        const map = { ...get().profilesByAccount };
        delete map[id];
        set({ accountId: null, profile: null, profilesByAccount: map });
      },

      resetLocalData: () => {
        authSignOut();
        if (typeof window !== "undefined") {
          localStorage.removeItem("winged-accounts-v1");
          localStorage.removeItem("povi-accounts-v1");
        }
        clearDevLoginSeedFlag();
        set({
          accountId: null,
          profile: null,
          profilesByAccount: {},
          lockedDateIds: [],
          flashVerdicts: {},
          toast: null,
        });
      },

      bootstrapDevLogins: async () => {
        const seeded = await ensureDevLogins();
        const map = { ...get().profilesByAccount };
        for (const [id, profile] of Object.entries(seeded)) {
          const existing = map[id];
          if (!existing?.onboardingComplete) {
            map[id] = {
              ...emptyProfile(id),
              ...(profile as UserProfile),
              accountId: id,
            };
          } else {
            map[id] = {
              ...emptyProfile(id),
              ...existing,
              wingTier: existing.wingTier ?? (profile as UserProfile).wingTier,
              wingStats: existing.wingStats ?? (profile as UserProfile).wingStats,
              openToHire:
                existing.openToHire ?? (profile as UserProfile).openToHire,
              appearance: existing.appearance ?? profile.appearance ?? "auto",
              accountId: id,
            };
          }
        }
        const accountId = get().accountId;
        set({
          profilesByAccount: map,
          profile: accountId ? map[accountId] ?? get().profile : get().profile,
        });
      },

      switchShell: () => {
        const profile = get().profile;
        if (!profile) return;
        const nextRole: AppRole =
          profile.role === "bachelor" ? "wing" : "bachelor";
        const next = { ...profile, role: nextRole };
        set({
          profile: next,
          profilesByAccount: {
            ...get().profilesByAccount,
            [profile.accountId]: next,
          },
        });
      },
    }),
    { name: "winged-app-v1" }
  )
);

/** @deprecated alias during migration */
export const useSession = useApp;
