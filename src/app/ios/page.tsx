"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WingedMark } from "@/components/brand/winged-mark";
import { cn } from "@/lib/utils";

type DeviceId = "se" | "15" | "15pm" | "s24" | "s24u";

type DeviceChrome = "island" | "notch" | "punch" | "flat";

type DeviceSpec = {
  label: string;
  group: "Apple" | "Samsung";
  width: number;
  height: number;
  chrome: DeviceChrome;
  /** Outer bezel corner radius (px) */
  outerRadius: number;
  /** Inner screen corner radius (px) */
  screenRadius: number;
};

const DEVICES: Record<DeviceId, DeviceSpec> = {
  se: {
    label: "iPhone SE",
    group: "Apple",
    width: 375,
    height: 667,
    chrome: "notch",
    outerRadius: 44,
    screenRadius: 36,
  },
  "15": {
    label: "iPhone 15",
    group: "Apple",
    width: 390,
    height: 844,
    chrome: "island",
    outerRadius: 48,
    screenRadius: 40,
  },
  "15pm": {
    label: "15 Pro Max",
    group: "Apple",
    width: 430,
    height: 932,
    chrome: "island",
    outerRadius: 52,
    screenRadius: 44,
  },
  s24: {
    label: "Galaxy S24",
    group: "Samsung",
    width: 360,
    height: 780,
    chrome: "punch",
    outerRadius: 28,
    screenRadius: 22,
  },
  s24u: {
    label: "S24 Ultra",
    group: "Samsung",
    width: 412,
    height: 915,
    chrome: "punch",
    outerRadius: 22,
    screenRadius: 16,
  },
};

const DEVICE_ORDER: DeviceId[] = ["15", "se", "15pm", "s24", "s24u"];

function StatusBar({ chrome }: { chrome: DeviceChrome }) {
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

  const tall = chrome === "island" || chrome === "notch";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-end justify-between px-5 text-[12px] font-semibold text-[#2a2421]",
        tall ? "h-[52px] pb-1.5" : "h-[28px] pb-0.5"
      )}
    >
      <span className="min-w-[3.25rem] tabular-nums">{time}</span>

      {chrome === "island" && (
        <span
          className="absolute left-1/2 top-2.5 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black"
          aria-hidden
        />
      )}
      {chrome === "notch" && (
        <span
          className="absolute left-1/2 top-0 h-[28px] w-[160px] -translate-x-1/2 rounded-b-2xl bg-black"
          aria-hidden
        />
      )}
      {chrome === "punch" && (
        <span
          className="absolute left-1/2 top-2 size-[11px] -translate-x-1/2 rounded-full bg-black ring-1 ring-black/40"
          aria-hidden
        />
      )}

      <span className="flex min-w-[3.25rem] items-center justify-end gap-1 text-[11px] text-[#2a2421]/70">
        {chrome === "punch" || chrome === "flat" ? (
          <>
            <span aria-hidden className="tracking-tighter">
              ▮▮▮
            </span>
            <span
              className="inline-block h-2.5 w-[18px] rounded-[2px] border border-[#2a2421]/70"
              aria-hidden
            >
              <span className="m-px block h-[calc(100%-2px)] w-3/4 rounded-[1px] bg-[#2a2421]/70" />
            </span>
          </>
        ) : (
          <>
            <span aria-hidden>●●●●</span>
            <span
              className="inline-block h-2.5 w-5 rounded-sm border border-[#2a2421]/80"
              aria-hidden
            >
              <span className="m-[1px] block h-full w-3/4 rounded-[1px] bg-[#2a2421]/80" />
            </span>
          </>
        )}
      </span>
    </div>
  );
}

export default function PhoneSimulatorPage() {
  const [device, setDevice] = useState<DeviceId>("15");
  const [path, setPath] = useState("/welcome");
  const [frameKey, setFrameKey] = useState(0);
  const spec = DEVICES[device];
  const isAndroid = spec.group === "Samsung";

  const iframeSrc = useMemo(() => {
    const base = path.startsWith("/") ? path : `/${path}`;
    const joiner = base.includes("?") ? "&" : "?";
    return `${base}${joiner}sim=1`;
  }, [path]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.self !== window.top) {
      window.top!.location.href = "/welcome";
    }
  }, []);

  function reload() {
    setFrameKey((k) => k + 1);
  }

  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(212,81,108,0.08), transparent 55%), radial-gradient(ellipse 60% 45% at 85% 85%, rgba(107,143,156,0.1), transparent 50%), #f3eee8",
      }}
    >
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-10">
        <div className="mb-6 text-center text-[#2a2421] lg:mb-0 lg:w-[19rem] lg:shrink-0 lg:text-left xl:w-[21rem]">
          <Link
            href="/welcome"
            className="inline-flex items-center gap-2 text-[#2a2421]"
          >
            <WingedMark className="h-10 w-10" />
            <span className="font-display text-2xl font-extrabold tracking-tight">
              Winged
            </span>
          </Link>

          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#2a2421]">
            Phone simulator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5c534e]">
            Full app at mobile size — navigate inside the frame. On a big screen
            use the desktop layout; share this URL for the phone feel.
          </p>

          <p className="mt-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#6b615c]">
            Apple
          </p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {DEVICE_ORDER.filter((id) => DEVICES[id].group === "Apple").map(
              (id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    device === id
                      ? "border-[#2a2421] bg-[#2a2421] text-white"
                      : "border-[#cfc4bb] bg-white text-[#2a2421] hover:border-[#2a2421]/40"
                  )}
                >
                  {DEVICES[id].label}
                </button>
              )
            )}
          </div>

          <p className="mt-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6b615c]">
            Samsung
          </p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {DEVICE_ORDER.filter((id) => DEVICES[id].group === "Samsung").map(
              (id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    device === id
                      ? "border-[#2a2421] bg-[#2a2421] text-white"
                      : "border-[#cfc4bb] bg-white text-[#2a2421] hover:border-[#2a2421]/40"
                  )}
                >
                  {DEVICES[id].label}
                </button>
              )
            )}
          </div>

          <label className="mt-5 block text-left text-[11px] font-bold uppercase tracking-wider text-[#6b615c]">
            Start path
            <div className="mt-1.5 flex gap-2">
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") reload();
                }}
                className="h-10 flex-1 rounded-xl border border-[#cfc4bb] bg-white px-3 text-sm font-medium text-[#2a2421] outline-none placeholder:text-[#9a8f89] focus:border-[#2a2421]"
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
                className="rounded-full border border-[#cfc4bb] bg-white px-2.5 py-1 font-semibold text-[#2a2421] hover:border-[#2a2421]/50"
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="mt-8 inline-block text-sm font-semibold text-[#5c534e] underline-offset-2 hover:text-[#2a2421] hover:underline"
          >
            ← Back to desktop app
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center pb-6">
          <div
            className="relative shrink-0 bg-gradient-to-b from-[#4a4541] to-[#1c1917] p-[11px] shadow-[0_28px_60px_rgba(42,36,33,0.28)] ring-1 ring-black/20"
            style={{
              width: spec.width + 22,
              height: spec.height + 22,
              borderRadius: spec.outerRadius,
            }}
          >
            {/* Side buttons — Apple left, Android right volume */}
            {!isAndroid && (
              <>
                <span
                  className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-[#6b6560]"
                  aria-hidden
                />
                <span
                  className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-[#6b6560]"
                  aria-hidden
                />
                <span
                  className="absolute -left-[3px] top-56 h-14 w-[3px] rounded-l bg-[#6b6560]"
                  aria-hidden
                />
                <span
                  className="absolute -right-[3px] top-44 h-20 w-[3px] rounded-r bg-[#6b6560]"
                  aria-hidden
                />
              </>
            )}
            {isAndroid && (
              <>
                <span
                  className="absolute -left-[2px] top-36 h-10 w-[2px] rounded-l bg-[#6b6560]"
                  aria-hidden
                />
                <span
                  className="absolute -right-[2px] top-32 h-12 w-[2px] rounded-r bg-[#6b6560]"
                  aria-hidden
                />
                <span
                  className="absolute -right-[2px] top-48 h-16 w-[2px] rounded-r bg-[#6b6560]"
                  aria-hidden
                />
              </>
            )}

            <div
              className="relative overflow-hidden bg-canvas"
              style={{
                width: spec.width,
                height: spec.height,
                borderRadius: spec.screenRadius,
              }}
            >
              <StatusBar chrome={spec.chrome} />
              <iframe
                key={frameKey}
                title="Winged phone simulator"
                src={iframeSrc}
                className="absolute inset-0 h-full w-full border-0 bg-canvas"
                allow="clipboard-read; clipboard-write"
              />
              {/* Home indicator — thin bar on iOS; Android gesture bar */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center"
                aria-hidden
              >
                <span
                  className={cn(
                    "rounded-full bg-black/35",
                    isAndroid ? "h-[4px] w-[108px]" : "h-[5px] w-[134px]"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
