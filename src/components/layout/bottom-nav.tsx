"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers3, MessageSquareLock, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Feed", icon: Layers3 },
  { href: "/deal-room", label: "Deal Room", icon: MessageSquareLock },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-obsidian/90 backdrop-blur-xl safe-bottom">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-bold uppercase tracking-wider transition",
                  active
                    ? "text-aqua shadow-[0_0_20px_rgba(0,242,254,0.15)]"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn("size-5", active && "drop-shadow-[0_0_6px_rgba(0,242,254,0.8)]")}
                  strokeWidth={active ? 2.5 : 2}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
