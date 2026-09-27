"use client";

import { SupabaseSessionBridge } from "@/components/auth/supabase-session-bridge";
import { QaStudio } from "@/components/qa/qa-studio";
import { WelcomeAuthTransitionHost } from "@/components/motion/welcome-auth-transition";

export function QaHost({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SupabaseSessionBridge />
      <WelcomeAuthTransitionHost />
      <QaStudio />
    </>
  );
}
