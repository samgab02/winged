"use client";

import Link from "next/link";
import { WingedMark } from "@/components/brand/winged-mark";

export function AppHeader({
  badge,
  href = "/",
}: {
  badge?: string;
  href?: string;
}) {
  return (
    <header className="chrome-bar sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-11 max-w-md items-center justify-between px-4">
        <Link
          href={href}
          className="inline-flex items-center"
          aria-label="Winged home"
        >
          <WingedMark className="h-7 w-7" />
        </Link>
        {badge ? (
          <span className="text-xs font-semibold text-subtle">{badge}</span>
        ) : (
          <span />
        )}
      </div>
    </header>
  );
}
