"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppHeader } from "@/components/layout/app-header";
import { BachelorNav } from "@/components/layout/bachelor-nav";
import { RouteTransition } from "@/components/motion/route-transition";
import { ToastHost } from "@/components/ui/toast";

export default function BachelorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="bachelor">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col pb-[4.75rem]">
        <AppHeader badge="Bachelor" href="/bachelor/discover" />
        <RouteTransition>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </RouteTransition>
        <BachelorNav />
        <ToastHost />
      </div>
    </RoleGate>
  );
}
