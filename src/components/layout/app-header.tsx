"use client";

import Link from "next/link";

export function AppHeader({
  badge,
  href = "/",
}: {
  badge?: string;
  href?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link
          href={href}
          className="font-display text-xl font-extrabold tracking-tight"
        >
          POVI
        </Link>
        {badge ? (
          <span className="rounded-full bg-elevated px-2.5 py-1 text-[11px] font-semibold text-secondary">
            {badge}
          </span>
        ) : (
          <span />
        )}
      </div>
    </header>
  );
}
