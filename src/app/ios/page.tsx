"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WingedMark } from "@/components/brand/winged-mark";
import { cn } from "@/lib/utils";

type DeviceId = "se" | "15" | "15pm";

const DEVICES: Record<
  DeviceId,
  { label: string; width: number; height: number; island: boolean }
> = {
  se: { label: "iPhone SE", width: 375, height: 667, island: false },
  "15": { label: "iPhone 15", width: 390, height: 844, island: true },
  "15pm": { label: "15 Pro Max", width: 430, height: 932, island: true },
};

function StatusBar({ island }: { island: boolean }) {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-end justify-between px-6 text-[12px] font-semibold text-black",
        island ? "h-[54px] pb-1.5" : "h-[44px] pb-1"
      )}
    >
      <span className="min-w-[3.5rem]">{time}</span>
      {island ? (
        <span
          className="absolute left-1/2 top-2.5 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black"
          aria-hidden
        />
      ) : (
        <span
          className="absolute left-1/2 top-0 h-[28px] w-[160px] -translate-x-1/2 rounded-b-2xl bg-black"
          aria-hidden
        />
      )}
      <span className="flex min-w-[3.5rem] items-center justify-end gap-1 text-[11px]">
        <span aria-hidden>●●●●</span>
        <span aria-hidden>⌂</span>
        <span className="inline-block h-2.5 w-5 rounded-sm border border-black/80">
          <span className="m-[1px] block h-full w-3/4 rounded-[1px] bg-black/80" />
        </span>
      </span>
    </div>
  );
}

export default function IosSimulatorPage() {
  const [device, setDevice] = useState<DeviceId>("15");
  const [path, setPath] = useState("/welcome");
  const [frameKey, setFrameKey] = useState(0);
  const spec = DEVICES[device];

  const iframeSrc = useMemo(() => {
    const base = path.startsWith("/") ? path : `/${path}`;
    const joiner = base.includes("?") ? "&" : "?";
    return `${base}${joiner}sim=1`;
  }, [path]);

  useEffect(() => {
    // Avoid nesting simulators inside the iframe
    if (typeof window !== "undefined" && window.self !== window.top) {
      window.top!.location.href = "/welcome";
    }
  }, []);

  function reload() {
    setFrameKey((k) => k + 1);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,var(--glow-a),transparent_55%),radial-gradient(ellipse_60%_45%_at_80%_80%,var(--glow-b),transparent_50%),#1c1917]">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-10">
        <div className="mb-6 text-center text-stone-100 lg:mb-0 lg:w-[18rem] lg:shrink-0 lg:text-left xl:w-[20rem]">
          <Link href="/welcome" className="inline-flex items-center gap-2">
            <WingedMark className="h-10 w-10" />
            <span className="font-display text-2xl font-extrabold tracking-tight">
              Winged
            </span>
          </Link>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
            iPhone simulator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">
            Full app at mobile size — navigate inside the frame. On a big screen
            use the desktop layout; share this URL for the phone feel.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {(Object.keys(DEVICES) as DeviceId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition",
                  device === id
                    ? "bg-white text-stone-900"
                    : "bg-white/10 text-stone-200 hover:bg-white/15"
                )}
              >
                {DEVICES[id].label}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Start path
            <div className="mt-1.5 flex gap-2">
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") reload();
                }}
                className="h-10 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-medium text-white outline-none placeholder:text-stone-500 focus:border-white/40"
                placeholder="/welcome"
              />
              <button
                type="button"
                onClick={reload}
                className="h-10 rounded-xl bg-romance px-4 text-sm font-bold text-white"
              >
                Go
              </button>
            </div>
          </label>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs lg:justify-start">
            {[
              ["/welcome", "Welcome"],
              ["/auth/signin", "Sign in"],
              ["/bachelor/discover", "Discover"],
              ["/wing/hub", "Wings hub"],
            ].map(([p, label]) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPath(p);
                  setFrameKey((k) => k + 1);
                }}
                className="rounded-full border border-white/15 px-2.5 py-1 font-semibold text-stone-300 hover:border-white/30 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="mt-8 inline-block text-sm font-semibold text-stone-400 underline-offset-2 hover:text-white hover:underline"
          >
            ← Back to desktop app
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center pb-6">
          <div
            className="relative shrink-0 rounded-[3rem] bg-gradient-to-b from-stone-600 to-stone-900 p-[12px] shadow-[0_40px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
            style={{
              width: spec.width + 24,
              height: spec.height + 24,
            }}
          >
            {/* Side buttons */}
            <span
              className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-stone-500"
              aria-hidden
            />
            <span
              className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-stone-500"
              aria-hidden
            />
            <span
              className="absolute -left-[3px] top-56 h-14 w-[3px] rounded-l bg-stone-500"
              aria-hidden
            />
            <span
              className="absolute -right-[3px] top-44 h-20 w-[3px] rounded-r bg-stone-500"
              aria-hidden
            />

            <div
              className="relative overflow-hidden rounded-[2.35rem] bg-canvas"
              style={{ width: spec.width, height: spec.height }}
            >
              <StatusBar island={spec.island} />
              <iframe
                key={frameKey}
                title="Winged iPhone simulator"
                src={iframeSrc}
                className="absolute inset-0 h-full w-full border-0 bg-canvas"
                // Allow full interaction
                allow="clipboard-read; clipboard-write"
              />
              {/* Home indicator */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center"
                aria-hidden
              >
                <span className="h-[5px] w-[134px] rounded-full bg-black/35" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
