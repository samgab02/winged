import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * OAuth PKCE callback — exchanges ?code= for a Supabase session cookie,
 * then sends the browser to /auth/complete to bridge into Winged profiles.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/auth/complete";
  const errDesc =
    url.searchParams.get("error_description") ||
    url.searchParams.get("error");

  if (errDesc) {
    return NextResponse.redirect(
      new URL(
        `/auth/signin?error=${encodeURIComponent(errDesc)}`,
        url.origin
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/signin?error=Missing%20OAuth%20code", url.origin)
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL(
        "/auth/signin?error=Supabase%20env%20vars%20are%20not%20configured",
        url.origin
      )
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    getSupabaseUrl()!,
    getSupabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/signin?error=${encodeURIComponent(error.message)}`,
        url.origin
      )
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
