"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();
  const onEarnings = pathname.startsWith("/earnings");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-foreground"
        >
          POVI
        </Link>
        <Link
          href="/earnings"
          className={`text-xs font-medium transition-colors ${
            onEarnings
              ? "text-shark"
              : "text-subtle hover:text-secondary"
          }`}
        >
          Shark · Earnings
        </Link>
      </div>
    </header>
  );
}
