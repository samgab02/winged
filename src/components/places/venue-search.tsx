"use client";

import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlaceResult = {
  id: string;
  name: string;
  label: string;
  lat: number;
  lng: number;
};

export function VenueSearch({
  city = "Tel Aviv",
  value,
  onSelect,
  className,
}: {
  city?: string;
  value?: PlaceResult | null;
  onSelect: (place: PlaceResult) => void;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      void (async () => {
        setBusy(true);
        setError("");
        try {
          const res = await fetch(
            `/api/places/search?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`
          );
          const data = (await res.json()) as {
            results?: PlaceResult[];
            error?: string;
          };
          if (!res.ok) {
            setError(data.error || "Search failed");
            setResults([]);
          } else {
            setResults(data.results || []);
          }
        } catch {
          setError("Could not reach places search.");
          setResults([]);
        } finally {
          setBusy(false);
        }
      })();
    }, 350);
    return () => clearTimeout(t);
  }, [q, city]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search real venues…"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-wing/40"
        />
      </div>
      {value && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-wing-deep">
          <MapPin className="size-3.5" />
          {value.name}
        </p>
      )}
      {busy && <p className="text-[11px] text-subtle">Searching…</p>}
      {error && <p className="text-[11px] text-romance">{error}</p>}
      {results.length > 0 && (
        <ul className="max-h-40 overflow-y-auto rounded-xl border border-border bg-surface">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(r);
                  setQ("");
                  setResults([]);
                }}
                className="flex w-full flex-col px-3 py-2 text-left text-xs hover:bg-elevated"
              >
                <span className="font-semibold">{r.name}</span>
                <span className="text-subtle line-clamp-1">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[10px] text-subtle">
        Powered by OpenStreetMap Nominatim
        {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? " · Mapbox when token set" : ""}.
      </p>
    </div>
  );
}
