"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export function createBrowserSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createBrowserClient(getSupabaseUrl()!, getSupabaseAnonKey()!);
}

export function tryCreateBrowserSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(getSupabaseUrl()!, getSupabaseAnonKey()!);
}
