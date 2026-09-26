"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { currentShark } from "@/lib/mock-data";

export function TopBar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-foreground"
        >
          POVI
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Shark profile menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full ring-2 ring-shark/30 transition hover:ring-shark/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentShark.avatar_url}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 min-w-44 rounded-2xl border border-border bg-surface p-1.5 shadow-card">
              <p className="px-2.5 py-1.5 text-xs font-semibold text-subtle">
                {currentShark.display_name.split("·")[0].trim()} · Shark
              </p>
              <Link
                href="/earnings"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-2.5 py-2 text-sm font-medium text-foreground hover:bg-elevated"
              >
                Earnings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
