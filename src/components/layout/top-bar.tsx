"use client";

import Link from "next/link";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between px-4">
        <Link href="/" className="font-display text-base font-semibold tracking-tight">
          POVI
        </Link>
        <span className="text-xs text-subtle">Demo</span>
      </div>
    </header>
  );
}
