"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WingedMark } from "@/components/brand/winged-mark";
import {
  INTEREST_OPTIONS,
  PHOTO_STARTER_PACK,
  PROFILE_PROMPT_OPTIONS,
  isAdult,
  type Gender,
  type LookingFor,
} from "@/lib/seed-catalog";
import { getSessionAccountId } from "@/lib/auth";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS = 8;

export default function BachelorOnboardingPage() {
  const router = useRouter();
  const accountId = useApp((s) => s.accountId);
  const hydrateSession = useApp((s) => s.hydrateSession);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const completeOnboarding = useApp((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>("woman");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("1998-06-15");
  const [city, setCity] = useState("Tel Aviv");
  const [photos, setPhotos] = useState<string[]>([]);
  const [promptQ, setPromptQ] = useState(PROFILE_PROMPT_OPTIONS[0]);
  const [promptA, setPromptA] = useState("");
  const [promptQ2, setPromptQ2] = useState(PROFILE_PROMPT_OPTIONS[1]);
  const [promptA2, setPromptA2] = useState("");
  const [promptQ3, setPromptQ3] = useState(PROFILE_PROMPT_OPTIONS[2]);
  const [promptA3, setPromptA3] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<LookingFor>("men");
  const [wingName, setWingName] = useState("Noa");
  const [ageError, setAgeError] = useState("");

  useEffect(() => {
    const id = getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    hydrateSession(id);
  }, [hydrateSession, router]);

  function togglePhoto(src: string) {
    setPhotos((prev) => {
      if (prev.includes(src)) return prev.filter((p) => p !== src);
      if (prev.length >= 6) return prev;
      return [...prev, src];
    });
  }

  function movePhoto(index: number, dir: -1 | 1) {
    setPhotos((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  function toggleInterest(tag: string) {
    setInterests((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length >= 5
          ? prev
          : [...prev, tag]
    );
  }

  function canContinue() {
    if (step === 0) return !!gender;
    if (step === 1) return name.trim().length > 1 && !!birthday;
    if (step === 2) return city.trim().length > 1;
    if (step === 3) return photos.length >= 3;
    if (step === 4)
      return promptA.trim() && promptA2.trim() && promptA3.trim();
    if (step === 5) return interests.length >= 3;
    if (step === 6) return !!lookingFor;
    if (step === 7) return wingName.trim().length > 0;
    return false;
  }

  function next() {
    if (step === 1 && !isAdult(birthday)) {
      setAgeError("You must be 18 or older to use Winged.");
      return;
    }
    setAgeError("");
    if (step < STEPS - 1) setStep((s) => s + 1);
    else finish();
  }

  function finish() {
    const id = accountId || getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    upsertProfile({
      accountId: id,
      role: "bachelor",
      gender,
      displayName: name.trim(),
      birthday,
      city: city.trim(),
      photos,
      prompts: [
        { question: promptQ, answer: promptA.trim() },
        { question: promptQ2, answer: promptA2.trim() },
        { question: promptQ3, answer: promptA3.trim() },
      ],
      interests,
      lookingFor,
      linkedWingName: wingName.trim(),
      vibeLine: promptA.trim(),
      bio: `${city.trim()} · looking for ${lookingFor}`,
      onboardingComplete: true,
      appearance: "auto",
    });
    completeOnboarding();
    router.replace("/bachelor/discover");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center px-5 pb-8 pt-8">
      <div className="flex w-full max-w-sm flex-col items-center">
        <WingedMark className="h-10 w-10" />
        <span className="mt-2 text-xs font-semibold text-subtle">
          {step + 1} / {STEPS}
        </span>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full bg-romance transition-all"
            style={{ width: `${((step + 1) / STEPS) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="mt-6 max-w-sm text-center font-display text-2xl font-extrabold tracking-tight">
        {step === 0 && "I am a…"}
        {step === 1 && "Name & birthday"}
        {step === 2 && "Where are you based?"}
        {step === 3 && "Add your photos"}
        {step === 4 && "Answer 3 prompts"}
        {step === 5 && "What are you into?"}
        {step === 6 && "Who are you open to?"}
        {step === 7 && "Invite your Wing"}
      </h1>
      <p className="mt-1 max-w-sm text-center text-sm text-secondary">
        {step === 3 && "At least 3 photos. First photo is your primary."}
        {step === 5 && "Pick 3–5. Keep it light."}
        {step === 7 && "Share a link, or continue with a starter Wing link."}
      </p>

      <div className="mt-6 w-full max-w-sm flex-1">
        {step === 0 && (
          <div className="space-y-2">
            {(
              [
                ["woman", "Woman"],
                ["man", "Man"],
                ["nonbinary", "Non-binary"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setGender(id)}
                className={cn(
                  "flex h-14 w-full items-center justify-between rounded-2xl border px-4 text-left font-semibold",
                  gender === id
                    ? "border-romance bg-romance-soft"
                    : "border-border bg-surface"
                )}
              >
                {label}
                {gender === id && <Check className="size-4 text-romance" />}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-romance/40"
            />
            <label className="block text-xs font-semibold text-subtle">
              Birthday
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none"
              />
            </label>
            {ageError && (
              <p className="text-sm font-medium text-romance">{ageError}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-romance/40"
          />
        )}

        {step === 3 && (
          <div className="space-y-4">
            {photos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-subtle">
                  Order · tap arrows to reorder
                </p>
                {photos.map((src, i) => (
                  <div
                    key={src}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2"
                  >
                    <GripVertical className="size-4 text-subtle" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="size-14 rounded-lg object-cover"
                    />
                    <span className="flex-1 text-xs font-semibold text-secondary">
                      {i === 0 ? "Primary" : `Photo ${i + 1}`}
                    </span>
                    <button
                      type="button"
                      className="text-xs font-bold text-subtle"
                      onClick={() => movePhoto(i, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-xs font-bold text-subtle"
                      onClick={() => movePhoto(i, 1)}
                    >
                      ↓
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {PHOTO_STARTER_PACK.map((src) => {
                const on = photos.includes(src);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => togglePhoto(src)}
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden rounded-2xl",
                      on && "ring-2 ring-romance"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    {on && (
                      <span className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-romance text-white">
                        <Check className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-subtle">
              {photos.length}/3 minimum selected · starter pack for quick setup
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            {[
              [promptQ, setPromptQ, promptA, setPromptA],
              [promptQ2, setPromptQ2, promptA2, setPromptA2],
              [promptQ3, setPromptQ3, promptA3, setPromptA3],
            ].map(([q, setQ, a, setA], i) => (
              <div key={i} className="space-y-2">
                <select
                  value={q as string}
                  onChange={(e) =>
                    (setQ as (v: string) => void)(e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
                >
                  {PROFILE_PROMPT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <textarea
                  value={a as string}
                  onChange={(e) =>
                    (setA as (v: string) => void)(e.target.value)
                  }
                  rows={2}
                  placeholder="Your answer"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((tag) => {
              const on = interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium",
                    on
                      ? "bg-romance text-white"
                      : "bg-elevated text-secondary"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-2">
            {(
              [
                ["men", "Men"],
                ["women", "Women"],
                ["everyone", "Everyone"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLookingFor(id)}
                className={cn(
                  "flex h-14 w-full items-center rounded-2xl border px-4 font-semibold",
                  lookingFor === id
                    ? "border-romance bg-romance-soft"
                    : "border-border bg-surface"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-3">
            <input
              value={wingName}
              onChange={(e) => setWingName(e.target.value)}
              placeholder="Wing’s name"
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none"
            />
            <Button
              variant="secondary"
              className="w-full"
              type="button"
              onClick={async () => {
                const { inviteUrl, shareOrCopy } = await import("@/lib/share");
                const url = inviteUrl(wingName || "wing");
                try {
                  await shareOrCopy({
                    title: "Wing invite — Winged",
                    text: "Be my Wing on Winged.",
                    url,
                  });
                } catch {
                  /* cancelled */
                }
              }}
            >
              Share Wing invite link
            </Button>
            <p className="text-xs text-subtle">
              Continue even if they haven’t joined yet — you’ll still see people
              in Discover.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex w-full max-w-sm gap-2">
        {step > 0 && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
        )}
        <Button
          className="flex-1"
          disabled={!canContinue()}
          onClick={next}
        >
          {step === STEPS - 1 ? "Enter Winged" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
