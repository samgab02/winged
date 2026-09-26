"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarHeart,
  Compass,
  HeartHandshake,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/bachelor/discover", label: "Discover", icon: Compass },
  { href: "/bachelor/matches", label: "Matches", icon: HeartHandshake },
  { href: "/bachelor/dates", label: "Dates", icon: CalendarHeart },
  { href: "/bachelor/profile", label: "Profile", icon: UserRound },
];

export function BachelorNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md safe-bottom">
      <ul className="mx-auto flex max-w-md justify-around px-1 pt-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold",
                  active ? "text-romance" : "text-subtle"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
