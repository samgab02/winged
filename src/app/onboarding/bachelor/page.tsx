"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interestOptions, mockPhotoLibrary } from "@/lib/mock-data";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function BachelorOnboardingPage() {
  const router = useRouter();
  const complete = useSession((s) => s.completeBachelorOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Maya");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(
    mockPhotoLibrary.slice(0, 4)
  );
  const [interests, setInterests] = useState(["Rooftop jazz", "Late walks", "Aux wars"]);
  const [sharkName, setSharkName] = useState("Noa");
  const [inviteSent, setInviteSent] = useState(false);

  function togglePhoto(src: string) {
    setSelectedPhotos((prev) => {
      if (prev.includes(src)) return prev.filter((p) => p !== src);
      if (prev.length >= 6) return prev;
      return [...prev, src];
    });
  }

  function toggleInterest(tag: string) {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 5)
    );
  }

  function finish() {
    complete({
      name,
      interests,
      photoIds: selectedPhotos,
      sharkName,
    });
    router.replace("/bachelor/discover");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-8 pt-8">
      <p className="text-xs font-bold uppercase tracking-wider text-romance">
        Bachelor · step {step + 1} of 4
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
        {step === 0 && "What’s your name?"}
        {step === 1 && "Add your photos"}
        {step === 2 && "What are you into?"}
        {step === 3 && "Invite your Shark"}
      </h1>
      <p className="mt-2 text-sm text-secondary">
        {step === 0 && "First name is enough — keep it warm."}
        {step === 1 && "Pick at least 3. Tap to select from the demo library."}
        {step === 2 && "Choose up to 5 vibes that feel like you."}
        {step === 3 && "A friend Shark curates you. Magic link is mocked."}
      </p>

      <div className="mt-8 flex-1">
        {step === 0 && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border bg-surface px-4 text-lg outline-none focus:border-romance/40"
            placeholder="Your first name"
          />
        )}

        {step === 1 && (
          <div className="grid grid-cols-3 gap-2">
            {mockPhotoLibrary.map((src) => {
              const on = selectedPhotos.includes(src);
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
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((tag) => {
              const on = interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-semibold",
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

        {step === 3 && (
          <div className="space-y-4">
            <input
              value={sharkName}
              onChange={(e) => setSharkName(e.target.value)}
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-shark/40"
              placeholder="Shark’s name"
            />
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setInviteSent(true)}
            >
              <Link2 className="size-4" />
              {inviteSent ? "Invite link ready" : "Send WhatsApp invite"}
            </Button>
            <p className="text-xs text-subtle">
              {sharkName || "Your Shark"} gets a magic link to vouch for you and
              join Deal Rooms.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        {step > 0 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button
            className="flex-1"
            disabled={
              (step === 0 && !name.trim()) ||
              (step === 1 && selectedPhotos.length < 3) ||
              (step === 2 && interests.length < 1)
            }
            onClick={() => setStep((s) => s + 1)}
          >
            Continue
          </Button>
        ) : (
          <Button className="flex-1" disabled={!sharkName.trim()} onClick={finish}>
            Enter Discover
          </Button>
        )}
      </div>
    </div>
  );
}
