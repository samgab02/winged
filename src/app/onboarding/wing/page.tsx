"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WingedMark } from "@/components/brand/winged-mark";
import {
  PHOTO_STARTER_PACK,
  WING_VIBE_QUESTIONS,
  isAdult,
  seedPeople,
  type Gender,
} from "@/lib/seed-catalog";
import { getSessionAccountId } from "@/lib/auth";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function WingOnboardingPage() {
  const router = useRouter();
  const accountId = useApp((s) => s.accountId);
  const hydrateSession = useApp((s) => s.hydrateSession);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const completeOnboarding = useApp((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>("woman");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("1995-03-20");
  const [city, setCity] = useState("Tel Aviv");
  const [photo, setPhoto] = useState(PHOTO_STARTER_PACK[4]);
  const [mode, setMode] = useState<"friend" | "pro">("friend");
  const [bachelorId, setBachelorId] = useState("maya");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [ageError, setAgeError] = useState("");

  useEffect(() => {
    const id = getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    hydrateSession(id);
  }, [hydrateSession, router]);

  const bachelor = seedPeople[bachelorId];

  function finish() {
    const id = accountId || getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    const vibe =
      answers[2]?.trim() ||
      `${bachelor.firstName} is chaos with perfect timing.`;
    upsertProfile({
      accountId: id,
      role: "wing",
      gender,
      displayName: name.trim(),
      birthday,
      city: city.trim(),
      photos: [photo],
      prompts: WING_VIBE_QUESTIONS.map((q, i) => ({
        question: q,
        answer: answers[i] || "",
      })),
      interests: [],
      lookingFor: "everyone",
      wingMode: mode,
      linkedBachelorName: bachelor.firstName,
      vibeLine: vibe,
      bio: `${mode === "pro" ? "Pro Matchmaker" : "Friend Wing"} · ${city}`,
      onboardingComplete: true,
      appearance: "auto",
    });
    completeOnboarding();
    router.replace("/wing/swipe");
  }

  function next() {
    if (step === 0 && (!name.trim() || !isAdult(birthday))) {
      if (!isAdult(birthday)) setAgeError("You must be 18 or older.");
      return;
    }
    setAgeError("");
    if (step < 3) setStep((s) => s + 1);
    else finish();
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-8 pt-8">
      <div className="flex items-center justify-between">
        <WingedMark className="h-9 w-9" />
        <span className="text-xs font-semibold text-subtle">
          Wing · {step + 1}/4
        </span>
      </div>

      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight">
        {step === 0 && "Your Wing profile"}
        {step === 1 && "Friend or Pro?"}
        {step === 2 && "Who are you winging for?"}
        {step === 3 && "Build their vibe line"}
      </h1>

      <div className="mt-6 flex-1 space-y-3">
        {step === 0 && (
          <>
            <div className="grid grid-cols-3 gap-2">
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
                    "h-11 rounded-xl border text-sm font-semibold",
                    gender === id
                      ? "border-wing bg-wing-soft"
                      : "border-border bg-surface"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4"
            />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4"
            />
            <p className="text-xs font-semibold text-subtle">Your photo</p>
            <div className="grid grid-cols-4 gap-2">
              {PHOTO_STARTER_PACK.slice(0, 8).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setPhoto(src)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-xl",
                    photo === src && "ring-2 ring-wing"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {ageError && (
              <p className="text-sm font-medium text-romance">{ageError}</p>
            )}
          </>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-2">
            {(
              [
                ["friend", "Friend Wing", "Linked to one bachelor"],
                ["pro", "Pro Wing", "Community matchmaking"],
              ] as const
            ).map(([id, title, sub]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={cn(
                  "rounded-2xl border p-4 text-left",
                  mode === id
                    ? "border-wing bg-wing-soft"
                    : "border-border bg-surface"
                )}
              >
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-xs text-secondary">{sub}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            {Object.values(seedPeople)
              .filter((p) => p.role === "bachelor")
              .slice(0, 4)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setBachelorId(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left",
                    bachelorId === p.id
                      ? "border-wing bg-wing-soft"
                      : "border-border bg-surface"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photos[0]}
                    alt=""
                    className="size-12 rounded-xl object-cover"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold">
                      {p.firstName}, {p.age}
                    </span>
                    <span className="block text-xs text-secondary">
                      {p.city}
                    </span>
                  </span>
                  {bachelorId === p.id && (
                    <Check className="size-4 text-wing-deep" />
                  )}
                </button>
              ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-secondary">
              Answering for <strong>{bachelor.firstName}</strong> — this becomes
              their vouch line.
            </p>
            {WING_VIBE_QUESTIONS.map((q, i) => (
              <div key={q}>
                <p className="mb-1.5 text-xs font-semibold text-subtle">{q}</p>
                <textarea
                  value={answers[i]}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="Your take"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
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
          variant="secondary"
          className="flex-1"
          disabled={step === 0 && !name.trim()}
          onClick={next}
        >
          {step === 3 ? "Enter Winged" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
