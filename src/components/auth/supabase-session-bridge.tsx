"use client";

import { useEffect } from "react";
import { bridgeSupabaseUser } from "@/lib/auth/bridge";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { pullProfileFromSupabase } from "@/lib/supabase/profile-sync";
import { useApp } from "@/lib/store";

/**
 * Keeps Winged local session aligned with Supabase Auth when env is set.
 * Email/password + OAuth both land here via onAuthStateChange.
 */
export function SupabaseSessionBridge() {
  const hydrateSession = useApp((s) => s.hydrateSession);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const setAccount = useApp((s) => s.setAccount);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let unsub: (() => void) | undefined;

    void (async () => {
      const { tryCreateBrowserSupabase } = await import(
        "@/lib/supabase/client"
      );
      const sb = tryCreateBrowserSupabase();
      if (!sb) return;

      async function applyUser(user: {
        id: string;
        email?: string | null;
        user_metadata?: Record<string, unknown>;
        app_metadata?: { provider?: string };
      } | null) {
        if (!user) return;
        const account = bridgeSupabaseUser({
          id: user.id,
          email: user.email ?? null,
          fullName:
            typeof user.user_metadata?.full_name === "string"
              ? user.user_metadata.full_name
              : null,
          provider: user.app_metadata?.provider || "email",
        });
        setAccount(account.id);
        hydrateSession(account.id);
        const pulled = await pullProfileFromSupabase();
        if (pulled.ok && pulled.partial) {
          upsertProfile(pulled.partial);
        }
      }

      const { data: existing } = await sb.auth.getSession();
      if (existing.session?.user) {
        await applyUser(existing.session.user);
      }

      const { data } = sb.auth.onAuthStateChange((_event, session) => {
        void applyUser(session?.user ?? null);
      });
      unsub = () => data.subscription.unsubscribe();
    })();

    return () => unsub?.();
  }, [hydrateSession, setAccount, upsertProfile]);

  return null;
}
