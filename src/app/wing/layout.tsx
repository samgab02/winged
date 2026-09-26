"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppHeader } from "@/components/layout/app-header";
import { WingNav } from "@/components/layout/wing-nav";
import { RouteTransition } from "@/components/motion/route-transition";
import { ToastHost } from "@/components/ui/toast";

export default function WingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="wing">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col pb-[4.75rem]">
        <AppHeader badge="Wing" href="/wing/hub" />
        <RouteTransition>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </RouteTransition>
        <WingNav />
        <ToastHost />
      </div>
    </RoleGate>
  );
}
