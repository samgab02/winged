/**
 * Sync Winged local profile ↔ public.profiles when Supabase is configured.
 */

import type { UserProfile } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function toRow(profile: UserProfile, userId: string) {
  return {
    id: userId,
    email: undefined as string | undefined,
    display_name: profile.displayName,
    role: profile.role,
    gender: profile.gender,
    birthday: profile.birthday || null,
    city: profile.city,
    photos: profile.photos,
    prompts: profile.prompts,
    interests: profile.interests,
    looking_for: profile.lookingFor,
    wing_mode: profile.wingMode,
    wing_tier: profile.wingTier,
    wing_stats: profile.wingStats,
    open_to_hire: profile.openToHire,
    linked_wing_name: profile.linkedWingName,
    linked_bachelor_name: profile.linkedBachelorName,
    vibe_line: profile.vibeLine,
    bio: profile.bio,
    appearance: profile.appearance,
    onboarding_complete: profile.onboardingComplete,
  };
}

export async function pushProfileToSupabase(
  profile: UserProfile
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "not configured" };
  const { tryCreateBrowserSupabase } = await import("@/lib/supabase/client");
  const sb = tryCreateBrowserSupabase();
  if (!sb) return { ok: false, error: "no client" };
  const { data: auth } = await sb.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { ok: false, error: "no session" };
  // Only sync when local account is bridged from this Supabase user
  if (
    profile.accountId !== `sb_${userId}` &&
    profile.accountId !== userId
  ) {
    return { ok: false, error: "account mismatch" };
  }
  const row = toRow(profile, userId);
  const { error } = await sb.from("profiles").upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function pullProfileFromSupabase(): Promise<{
  ok: boolean;
  partial?: Partial<UserProfile> & { accountId: string };
  error?: string;
}> {
  if (!isSupabaseConfigured()) return { ok: false, error: "not configured" };
  const { tryCreateBrowserSupabase } = await import("@/lib/supabase/client");
  const sb = tryCreateBrowserSupabase();
  if (!sb) return { ok: false, error: "no client" };
  const { data: auth } = await sb.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { ok: false, error: "no session" };
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "no profile row" };
  return {
    ok: true,
    partial: {
      accountId: `sb_${userId}`,
      displayName: data.display_name ?? "",
      role: data.role === "wing" ? "wing" : data.role === "bachelor" ? "bachelor" : undefined,
      gender: data.gender,
      birthday: data.birthday ?? "",
      city: data.city ?? "",
      photos: Array.isArray(data.photos) ? data.photos : [],
      prompts: Array.isArray(data.prompts) ? data.prompts : [],
      interests: Array.isArray(data.interests) ? data.interests : [],
      lookingFor: data.looking_for,
      wingMode: data.wing_mode,
      wingTier: data.wing_tier,
      wingStats: data.wing_stats,
      openToHire: Boolean(data.open_to_hire),
      linkedWingName: data.linked_wing_name ?? "",
      linkedBachelorName: data.linked_bachelor_name ?? "",
      vibeLine: data.vibe_line ?? "",
      bio: data.bio ?? "",
      appearance: data.appearance ?? "auto",
      onboardingComplete: Boolean(data.onboarding_complete),
    },
  };
}
