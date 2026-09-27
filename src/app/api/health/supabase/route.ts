import { NextResponse } from "next/server";
import {
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export async function GET() {
  const configured = isSupabaseConfigured();
  const url = getSupabaseUrl();
  let reachable: boolean | null = null;
  let authHint: string | null = null;

  if (configured && url) {
    try {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" },
        cache: "no-store",
      });
      reachable = res.ok;
    } catch {
      reachable = false;
    }
  } else {
    authHint =
      "Create a free project at https://supabase.com/dashboard/new then add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY. Access token for CLI: https://supabase.com/dashboard/account/tokens";
  }

  return NextResponse.json({
    configured,
    reachable,
    urlHost: url ? new URL(url).host : null,
    authHint,
    schema: "supabase/migrations/20260927050000_winged_core.sql",
  });
}
