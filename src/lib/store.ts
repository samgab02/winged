"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Gender, LookingFor, ProfilePrompt } from "@/lib/seed-catalog";
import { deleteAccount, signOut as authSignOut } from "@/lib/auth";

export type AppRole = "bachelor" | "shark";

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
  sharkMode: "friend" | "pro";
  linkedSharkName: string;
  linkedBachelorName: string;
  vibeLine: string;
  bio: string;
  onboardingComplete: boolean;
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
  upsertProfile: ( partial: Partial<UserProfile> & { accountId: string }) => void;
  completeOnboarding: () => void;
  lockDate: (id: string) => void;
  setFlashVerdict: (id: string, verdict: "keep" | "skip") => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  signOutLocal: () => void;
  wipeLocalAccount: () => void;
  resetLocalData: () => void;
  switchShell: () => void;
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
  sharkMode: "friend",
  linkedSharkName: "Noa",
  linkedBachelorName: "Maya",
  vibeLine: "",
  bio: "",
  onboardingComplete: false,
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
        set({
          accountId,
          profile: existing ?? emptyProfile(accountId),
        });
      },

      setAccount: (accountId) => {
        const existing = get().profilesByAccount[accountId];
        const profile = existing ?? emptyProfile(accountId);
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
        const current =
          get().profilesByAccount[id] ??
          get().profile ??
          emptyProfile(id);
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
        const id = get().accountId;
        authSignOut();
        if (id) deleteAccount(id);
        set({
          accountId: null,
          profile: null,
          profilesByAccount: {},
          lockedDateIds: [],
          flashVerdicts: {},
          toast: null,
        });
      },

      switchShell: () => {
        const profile = get().profile;
        if (!profile) return;
        const nextRole: AppRole =
          profile.role === "bachelor" ? "shark" : "bachelor";
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
    { name: "povi-app-v2" }
  )
);

/** @deprecated alias during migration */
export const useSession = useApp;
