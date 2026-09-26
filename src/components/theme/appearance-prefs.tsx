"use client";

import { APPEARANCE_OPTIONS, type AppearancePref } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppearancePrefs() {
  const profile = useApp((s) => s.profile);
  const upsertProfile = useApp((s) => s.upsertProfile);
  if (!profile) return null;

  const current = profile.appearance ?? "auto";

  function setPref(appearance: AppearancePref) {
    upsertProfile({ accountId: profile!.accountId, appearance });
  }

  return (
    <div className="mt-4 rounded-2xl bg-surface p-4 shadow-soft">
      <p className="text-sm font-semibold">Appearance</p>
      <p className="mt-0.5 text-xs text-secondary">
        Auto follows your gender. Override anytime.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {APPEARANCE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setPref(opt.id)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-left transition",
              current === opt.id
                ? "border-romance bg-romance-soft"
                : "border-border bg-elevated/50"
            )}
          >
            <span className="block text-sm font-semibold">{opt.label}</span>
            <span className="mt-0.5 block text-[11px] text-secondary">
              {opt.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
