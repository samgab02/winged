"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppRole = "bachelor" | "shark" | null;

export type OnboardingStep =
  | "welcome"
  | "bachelor-onboarding"
  | "shark-onboarding"
  | "ready";

export type ListStatus = "idle" | "loading" | "ready" | "empty" | "error";

interface SessionState {
  role: AppRole;
  onboarding: OnboardingStep;
  bachelorName: string;
  sharkName: string;
  interests: string[];
  photoIds: string[];
  linkedSharkName: string;
  linkedBachelorName: string;
  sharkMode: "friend" | "pro";
  mutedMatches: string[];
  lockedDateIds: string[];
  flashVerdicts: Record<string, "keep" | "skip">;
  listStatus: ListStatus;
  setRole: (role: Exclude<AppRole, null>) => void;
  completeBachelorOnboarding: (payload: {
    name: string;
    interests: string[];
    photoIds: string[];
    sharkName: string;
  }) => void;
  completeSharkOnboarding: (payload: {
    name: string;
    mode: "friend" | "pro";
    bachelorName: string;
  }) => void;
  resetDemo: () => void;
  lockDate: (id: string) => void;
  setFlashVerdict: (id: string, verdict: "keep" | "skip") => void;
  setListStatus: (status: ListStatus) => void;
  switchRole: () => void;
}

const initial = {
  role: null as AppRole,
  onboarding: "welcome" as OnboardingStep,
  bachelorName: "Maya",
  sharkName: "Noa",
  interests: ["Rooftop jazz", "Late walks", "Aux wars"],
  photoIds: ["maya1", "maya2", "maya3", "maya4"],
  linkedSharkName: "Noa",
  linkedBachelorName: "Maya",
  sharkMode: "friend" as const,
  mutedMatches: [] as string[],
  lockedDateIds: [] as string[],
  flashVerdicts: {} as Record<string, "keep" | "skip">,
  listStatus: "ready" as ListStatus,
};

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      ...initial,
      setRole: (role) =>
        set({
          role,
          onboarding:
            role === "bachelor" ? "bachelor-onboarding" : "shark-onboarding",
        }),
      completeBachelorOnboarding: ({ name, interests, photoIds, sharkName }) =>
        set({
          bachelorName: name,
          interests,
          photoIds,
          linkedSharkName: sharkName,
          onboarding: "ready",
        }),
      completeSharkOnboarding: ({ name, mode, bachelorName }) =>
        set({
          sharkName: name,
          sharkMode: mode,
          linkedBachelorName: bachelorName,
          onboarding: "ready",
        }),
      resetDemo: () => set({ ...initial }),
      lockDate: (id) =>
        set({
          lockedDateIds: Array.from(new Set([...get().lockedDateIds, id])),
        }),
      setFlashVerdict: (id, verdict) =>
        set({
          flashVerdicts: { ...get().flashVerdicts, [id]: verdict },
        }),
      setListStatus: (listStatus) => set({ listStatus }),
      switchRole: () => {
        const next = get().role === "bachelor" ? "shark" : "bachelor";
        set({
          role: next,
          onboarding: "ready",
        });
      },
    }),
    { name: "povi-session-v1" }
  )
);
