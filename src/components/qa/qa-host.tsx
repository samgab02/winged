"use client";

import { QaStudio } from "@/components/qa/qa-studio";

export function QaHost({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <QaStudio />
    </>
  );
}
