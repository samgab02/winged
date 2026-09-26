"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers3,
  MessageCircleHeart,
  UsersRound,
  CircleUserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/shark/swipe", label: "Swipe", icon: Layers3 },
  { href: "/shark/deal-room", label: "Deal Room", icon: MessageCircleHeart },
  { href: "/shark/singles", label: "My singles", icon: UsersRound },
  { href: "/shark/me", label: "Me", icon: CircleUserRound },
];

export function SharkNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md safe-bottom">
      <ul className="mx-auto flex max-w-md justify-around px-1 pt-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/shark/me"
              ? pathname.startsWith("/shark/me")
              : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold",
                  active ? "text-shark-deep" : "text-subtle"
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
