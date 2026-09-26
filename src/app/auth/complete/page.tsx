"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WingedMark } from "@/components/brand/winged-mark";
import { tryCreateBrowserSupabase } from "@/lib/supabase/client";
import { bridgeSupabaseUser } from "@/lib/auth/bridge";
import { useApp } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Post-OAuth landing: read Supabase session, bridge to local Winged account,
 * then route into role / onboarding / shell.
 */
export default function AuthCompletePage() {
  const router = useRouter();
  const setAccount = useApp((s) => s.setAccount);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const bootstrapDevLogins = useApp((s) => s.bootstrapDevLogins);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured.");
        return;
      }
      const supabase = tryCreateBrowserSupabase();
      if (!supabase) {
        setError("Could not create Supabase client.");
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionError || !data.session?.user) {
        setError(sessionError?.message || "No session after OAuth.");
        return;
      }

      const user = data.session.user;
      const account = bridgeSupabaseUser({
        id: user.id,
        email: user.email ?? null,
        fullName:
          (user.user_metadata?.full_name as string | undefined) ||
          (user.user_metadata?.name as string | undefined) ||
          null,
        avatarUrl: (user.user_metadata?.avatar_url as string | undefined) || null,
        provider: user.app_metadata?.provider as string | undefined,
      });

      setAccount(account.id);
      await bootstrapDevLogins();

      const existing = useApp.getState().profilesByAccount[account.id];
      if (!existing?.displayName && user.user_metadata) {
        const name =
          (user.user_metadata.full_name as string | undefined) ||
          (user.user_metadata.name as string | undefined) ||
          "";
        const avatar = user.user_metadata.avatar_url as string | undefined;
        upsertProfile({
          accountId: account.id,
          displayName: name.split(" ")[0] || existing?.displayName || "",
          photos: avatar
            ? [avatar, ...(existing?.photos ?? [])].slice(0, 6)
            : existing?.photos ?? [],
        });
      }

      const profile = useApp.getState().profilesByAccount[account.id];
      if (!profile?.role) {
        router.replace("/auth/role");
        return;
      }
      if (!profile.onboardingComplete) {
        router.replace(
          profile.role === "bachelor"
            ? "/onboarding/bachelor"
            : "/onboarding/wing"
        );
        return;
      }
      router.replace(
        profile.role === "bachelor" ? "/bachelor/discover" : "/wing/hub"
      );
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, setAccount, upsertProfile, bootstrapDevLogins]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-3 px-6 text-center">
      <WingedMark className="h-14 w-14" />
      <p className="font-display text-xl font-extrabold">Finishing sign-in…</p>
      {error ? (
        <p className="max-w-sm text-sm font-medium text-romance">{error}</p>
      ) : (
        <p className="text-sm text-secondary">Linking your Winged account.</p>
      )}
    </div>
  );
}
