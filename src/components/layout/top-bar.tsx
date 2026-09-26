"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-obsidian/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-aqua text-obsidian shadow-[0_0_16px_rgba(0,242,254,0.45)]">
            <Zap className="size-4 fill-obsidian" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black tracking-tight">
            POVI
            <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.15em] text-aqua">
              Proof of Vibe
            </span>
          </span>
        </Link>
        <span className="rounded-full bg-pink/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pink neon-border-pink">
          Demo · Mock
        </span>
      </div>
    </header>
  );
}
