"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  Feather,
  Layers3,
  MessageCircleHeart,
  CircleUserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/wing/swipe", label: "Swipe", icon: Layers3 },
  { href: "/wing/deal-room", label: "Deal Room", icon: MessageCircleHeart },
  { href: "/wing/hub", label: "Wings", icon: Feather },
  { href: "/wing/me", label: "Me", icon: CircleUserRound },
];

export function WingNav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md safe-bottom">
      <LayoutGroup id="wing-tabs">
        <ul className="mx-auto flex max-w-md justify-around px-1 pt-1.5">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/wing/me"
                ? pathname.startsWith("/wing/me")
                : href === "/wing/hub"
                  ? pathname.startsWith("/wing/hub") ||
                    pathname.startsWith("/wing/network") ||
                    pathname.startsWith("/wing/singles")
                  : pathname.startsWith(href);
            return (
              <li key={href} className="relative flex-1">
                <Link
                  href={href}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold",
                    active ? "text-wing-deep" : "text-subtle"
                  )}
                >
                  {active && !reduced && (
                    <motion.span
                      layoutId="wing-tab-pill"
                      className="absolute inset-x-3 -top-0.5 bottom-1 rounded-2xl bg-wing-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <motion.span
                    className="relative z-10"
                    animate={
                      active && !reduced
                        ? { y: [0, -2, 0], scale: [1, 1.08, 1] }
                        : { y: 0, scale: 1 }
                    }
                    transition={{ duration: 0.35 }}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                  </motion.span>
                  <span className="relative z-10">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
