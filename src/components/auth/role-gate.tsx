"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/store";
import { LoadingState } from "@/components/ui/states";

export function RoleGate({
  expect,
  children,
}: {
  expect: "bachelor" | "shark";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useSession((s) => s.role);
  const onboarding = useSession((s) => s.onboarding);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!role || onboarding === "welcome") {
      router.replace("/");
      return;
    }
    if (onboarding !== "ready") {
      router.replace(
        role === "bachelor" ? "/onboarding/bachelor" : "/onboarding/shark"
      );
      return;
    }
    if (role !== expect) {
      router.replace(role === "bachelor" ? "/bachelor/discover" : "/shark/swipe");
    }
  }, [hydrated, role, onboarding, expect, router, pathname]);

  if (!hydrated || role !== expect || onboarding !== "ready") {
    return <LoadingState label="Opening POVI…" />;
  }

  return <>{children}</>;
}
