"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppHeader } from "@/components/layout/app-header";
import { BachelorNav } from "@/components/layout/bachelor-nav";

export default function BachelorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="bachelor">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col pb-24">
        <AppHeader badge="Bachelor" href="/bachelor/discover" />
        <main className="flex flex-1 flex-col">{children}</main>
        <BachelorNav />
      </div>
    </RoleGate>
  );
}
