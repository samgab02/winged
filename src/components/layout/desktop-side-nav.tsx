"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { WingedMark } from "@/components/brand/winged-mark";
import {
  BACHELOR_NAV,
  WING_NAV,
  navItemActive,
  type AppNavItem,
} from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function DesktopSideNav({
  role,
}: {
  role: "bachelor" | "wing";
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const items: AppNavItem[] = role === "bachelor" ? BACHELOR_NAV : WING_NAV;
  const accent = role === "bachelor" ? "romance" : "wing";
  const home = role === "bachelor" ? "/bachelor/discover" : "/wing/hub";

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh w-[15.5rem] shrink-0 flex-col border-r border-border bg-surface/90 px-3 py-5 backdrop-blur-md lg:flex",
        "xl:w-[17rem]"
      )}
    >
      <Link
        href={home}
        className="mb-8 flex items-center gap-2.5 px-2"
        aria-label="Winged home"
      >
        <WingedMark className="h-9 w-9" />
        <span className="font-display text-xl font-extrabold tracking-tight">
          Winged
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {items.map((item) => {
          const active = navItemActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? accent === "romance"
                    ? "text-romance"
                    : "text-wing-deep"
                  : "text-secondary hover:bg-elevated/80 hover:text-foreground"
              )}
            >
              {active && !reduced && (
                <motion.span
                  layoutId={`desktop-nav-${role}`}
                  className={cn(
                    "absolute inset-0 rounded-2xl",
                    accent === "romance" ? "bg-romance-soft" : "bg-wing-soft"
                  )}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className="relative z-10 size-5"
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <p className="mt-auto px-2 text-[11px] leading-relaxed text-subtle">
        Friends plan it. You show up.
      </p>
      <Link
        href="/ios"
        className="mt-2 px-2 text-[11px] font-semibold text-subtle underline-offset-2 hover:text-foreground hover:underline"
      >
        Open iPhone simulator →
      </Link>
    </aside>
  );
}
