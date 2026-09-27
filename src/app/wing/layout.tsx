"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppShell } from "@/components/layout/app-shell";

export default function WingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="wing">
      <AppShell role="wing">{children}</AppShell>
    </RoleGate>
  );
}
