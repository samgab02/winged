"use client";

import Link from "next/link";
import { PoviMark } from "@/components/brand/povi-mark";

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
          <PoviMark className="size-8" />
          <span className="font-display text-lg font-extrabold tracking-tight">
            POVI
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
