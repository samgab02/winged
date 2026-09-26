"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarHeart, Layers3, MessageCircleHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Feed", icon: Layers3 },
  { href: "/deal-room", label: "Deal Room", icon: MessageCircleHeart },
  { href: "/dates", label: "Dates", icon: CalendarHeart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md safe-bottom">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-xs font-semibold transition-colors",
                  active
                    ? "text-romance"
                    : "text-subtle hover:text-secondary"
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
