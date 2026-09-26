"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSessionAccountId } from "@/lib/auth";
import { useApp } from "@/lib/store";
import { LoadingState } from "@/components/ui/states";
import { WingedMark } from "@/components/brand/winged-mark";

export function RoleGate({
  expect,
  children,
}: {
  expect: "bachelor" | "wing";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrateSession = useApp((s) => s.hydrateSession);
  const profile = useApp((s) => s.profile);
  const accountId = useApp((s) => s.accountId);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = getSessionAccountId();
    hydrateSession(id);
    setReady(true);
  }, [hydrateSession]);

  useEffect(() => {
    if (!ready) return;
    if (!accountId) {
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
          : "/onboarding/wing"
      );
      return;
    }
    if (profile.role !== expect) {
      router.replace(
        profile.role === "bachelor" ? "/bachelor/discover" : "/wing/swipe"
      );
    }
  }, [ready, accountId, profile, expect, router, pathname]);

  if (
    !ready ||
    !accountId ||
    !profile?.onboardingComplete ||
    profile.role !== expect
  ) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-3">
        <WingedMark className="h-12 w-12 animate-pulse" />
        <LoadingState label="Opening Winged…" />
      </div>
    );
  }

  return <>{children}</>;
}
