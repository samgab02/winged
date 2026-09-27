"use client";

import { AppHeader } from "@/components/layout/app-header";
import { BachelorNav } from "@/components/layout/bachelor-nav";
import { DesktopSideNav } from "@/components/layout/desktop-side-nav";
import { WingNav } from "@/components/layout/wing-nav";
import { RouteTransition } from "@/components/motion/route-transition";
import { ToastHost } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function AppShell({
  role,
  children,
}: {
  role: "bachelor" | "wing";
  children: React.ReactNode;
}) {
  const headerHref =
    role === "bachelor" ? "/bachelor/discover" : "/wing/hub";
  const badge = role === "bachelor" ? "Bachelor" : "Wing";

  return (
    <div className="min-h-dvh lg:flex lg:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,var(--glow-a),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_20%,var(--glow-b),transparent_50%),var(--canvas)]">
      <DesktopSideNav role={role} />

      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-[4.75rem]",
          /* Desktop: fill remaining width, no mobile dock padding */
          "lg:max-w-none lg:flex-1 lg:pb-0"
        )}
      >
        <div className="lg:hidden">
          <AppHeader badge={badge} href={headerHref} />
        </div>
        <header className="chrome-bar sticky top-0 z-40 hidden border-b lg:block">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 xl:px-8">
            <p className="font-display text-lg font-extrabold tracking-tight">
              {badge}
            </p>
            <p className="text-sm text-secondary">
              {role === "bachelor"
                ? "Discover · Matches · Dates · My Wing"
                : "Swipe · Deal Room · Wings hub"}
            </p>
          </div>
        </header>

        <RouteTransition>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </RouteTransition>

        <div className="lg:hidden">
          {role === "bachelor" ? <BachelorNav /> : <WingNav />}
        </div>
        <ToastHost />
      </div>
    </div>
  );
}
