"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { BACHELOR_NAV, navItemActive } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function BachelorNav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <nav className="chrome-bar fixed bottom-0 left-0 right-0 z-50 border-t safe-bottom">
      <LayoutGroup id="bachelor-tabs">
        <ul className="mx-auto flex max-w-md justify-around px-0.5 pt-1.5">
          {BACHELOR_NAV.map(({ href, label, icon: Icon, match }) => {
            const active = navItemActive(pathname, { href, label, icon: Icon, match });
            return (
              <li key={href} className="relative flex-1">
                <Link
                  href={href}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold",
                    active ? "text-romance" : "text-subtle"
                  )}
                >
                  {active && !reduced && (
                    <motion.span
                      layoutId="bachelor-tab-pill"
                      className="absolute inset-x-1.5 -top-0.5 bottom-1 rounded-2xl bg-romance-soft"
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
