"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/brand/splash";
import { getSessionAccountId } from "@/lib/auth";
import { useApp } from "@/lib/store";

export default function RootEntryPage() {
  const router = useRouter();
  const hydrateSession = useApp((s) => s.hydrateSession);
  const profile = useApp((s) => s.profile);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const id = getSessionAccountId();
    hydrateSession(id);
    const t = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(t);
  }, [hydrateSession]);

  useEffect(() => {
    if (showSplash) return;
    const id = getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    if (!profile?.role) {
      router.replace("/auth/role");
      return;
    }
    if (!profile.onboardingComplete) {
      router.replace(
        profile.role === "bachelor"
          ? "/onboarding/bachelor"
          : "/onboarding/shark"
      );
      return;
    }
    router.replace(
      profile.role === "bachelor" ? "/bachelor/discover" : "/shark/swipe"
    );
  }, [showSplash, profile, router]);

  if (showSplash) return <SplashScreen />;
  return <SplashScreen />;
}
