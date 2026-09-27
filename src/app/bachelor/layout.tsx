"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { AppShell } from "@/components/layout/app-shell";

export default function BachelorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate expect="bachelor">
      <AppShell role="bachelor">{children}</AppShell>
    </RoleGate>
  );
}
