import type { Gender } from "@/lib/seed-catalog";

export type AppearancePref = "auto" | "neutral" | "warm" | "cool";
export type AppearancePreset = "neutral" | "warm" | "cool";

export function resolveAppearance(
  pref: AppearancePref | undefined,
  gender?: Gender | null
): AppearancePreset {
  if (pref && pref !== "auto") return pref;
  if (gender === "woman") return "warm";
  if (gender === "man") return "cool";
  return "neutral";
}

export function applyAppearance(preset: AppearancePreset) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-appearance", preset);
}

export const APPEARANCE_OPTIONS: {
  id: AppearancePref;
  label: string;
  hint: string;
}[] = [
  { id: "auto", label: "Auto", hint: "Follows your profile gender" },
  { id: "neutral", label: "Neutral", hint: "Dating-first, balanced" },
  { id: "warm", label: "Warm", hint: "Softer blush atmosphere" },
  { id: "cool", label: "Cool", hint: "Slate & indigo atmosphere" },
];
