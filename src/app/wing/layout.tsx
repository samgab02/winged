"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppHeader } from "@/components/layout/app-header";
import { WingNav } from "@/components/layout/wing-nav";
import { ToastHost } from "@/components/ui/toast";

export default function WingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="wing">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col pb-24">
        <AppHeader badge="Wing" href="/wing/hub" />
        <main className="flex flex-1 flex-col">{children}</main>
        <WingNav />
        <ToastHost />
      </div>
    </RoleGate>
  );
}
