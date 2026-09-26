"use client";

import { tryCreateBrowserSupabase } from "@/lib/supabase/client";
import {
  isSupabaseConfigured,
  missingAuthEnv,
  oauthRedirectTo,
  type ProviderId,
} from "@/lib/supabase/config";

export type OAuthResult =
  | { ok: true }
  | { ok: false; error: string; missingEnv?: string[] };

export async function startOAuth(
  provider: "google" | "apple"
): Promise<OAuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Google/Apple sign-in needs Supabase Auth. Add the env vars below, enable the provider in the Supabase dashboard, then redeploy.",
      missingEnv: missingAuthEnv(),
    };
  }

  const supabase = tryCreateBrowserSupabase();
  if (!supabase) {
    return { ok: false, error: "Could not create Supabase client.", missingEnv: missingAuthEnv() };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: oauthRedirectTo(),
      queryParams:
        provider === "google"
          ? { access_type: "offline", prompt: "consent" }
          : undefined,
    },
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message ||
        `${provider} sign-in failed. Confirm the provider is enabled in Supabase → Authentication → Providers.`,
    };
  }

  if (data.url) {
    window.location.assign(data.url);
    return { ok: true };
  }

  return { ok: false, error: "No OAuth redirect URL returned." };
}

export async function startPhoneOtp(phone: string): Promise<OAuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Phone OTP needs Supabase Auth with a phone provider (Twilio or Supabase SMS). Set the env vars below.",
      missingEnv: missingAuthEnv(),
    };
  }

  const normalized = phone.trim();
  if (!/^\+?[0-9\s()-]{8,}$/.test(normalized)) {
    return { ok: false, error: "Enter a valid phone number with country code (e.g. +972…)." };
  }

  const supabase = tryCreateBrowserSupabase();
  if (!supabase) {
    return { ok: false, error: "Could not create Supabase client.", missingEnv: missingAuthEnv() };
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: normalized,
    options: { channel: "sms" },
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message ||
        "Phone OTP failed. Enable Phone auth in Supabase and configure Twilio (or Supabase SMS).",
    };
  }

  return { ok: true };
}

export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<OAuthResult & { userId?: string; email?: string | null }> {
  const supabase = tryCreateBrowserSupabase();
  if (!supabase) {
    return { ok: false, error: "Supabase not configured.", missingEnv: missingAuthEnv() };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone.trim(),
    token: token.trim(),
    type: "sms",
  });

  if (error || !data.user) {
    return { ok: false, error: error?.message || "Invalid code." };
  }

  return {
    ok: true,
    userId: data.user.id,
    email: data.user.email,
  };
}

export function providerLabel(id: ProviderId): string {
  if (id === "google") return "Google";
  if (id === "apple") return "Apple";
  return "Phone";
}
