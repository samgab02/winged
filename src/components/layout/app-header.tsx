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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link href={href} className="inline-flex items-center gap-2">
          <WingedMark className="size-8" />
          <span className="font-display text-lg font-extrabold tracking-tight">
            Winged
          </span>
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
