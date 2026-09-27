"use client";

import { QaStudio } from "@/components/qa/qa-studio";
import { WelcomeAuthTransitionHost } from "@/components/motion/welcome-auth-transition";

export function QaHost({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WelcomeAuthTransitionHost />
      <QaStudio />
    </>
  );
}
