"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppHeader } from "@/components/layout/app-header";
import { SharkNav } from "@/components/layout/shark-nav";

export default function SharkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="shark">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col pb-24">
        <AppHeader badge="Shark" href="/shark/swipe" />
        <main className="flex flex-1 flex-col">{children}</main>
        <SharkNav />
      </div>
    </RoleGate>
  );
}
