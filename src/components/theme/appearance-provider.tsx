"use client";

import { useEffect } from "react";
import { applyAppearance, resolveAppearance } from "@/lib/theme";
import { useApp } from "@/lib/store";

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useApp((s) => s.profile);

  useEffect(() => {
    const preset = resolveAppearance(
      profile?.appearance ?? "auto",
      profile?.gender
    );
    applyAppearance(preset);
  }, [profile?.appearance, profile?.gender]);

  return <>{children}</>;
}
