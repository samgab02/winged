"use client";

import { useRouter } from "next/navigation";
import type { Person } from "@/lib/mock-data";
import { PhotoGallery } from "@/components/photos/photo-gallery";
import { AppearancePrefs } from "@/components/theme/appearance-prefs";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export function ProfileView({
  person,
  wingName,
  isSelf,
  prompts,
}: {
  person: Person;
  wingName?: string;
  isSelf?: boolean;
  prompts?: { question: string; answer: string }[];
}) {
  const router = useRouter();
  const switchShell = useApp((s) => s.switchShell);
  const signOutLocal = useApp((s) => s.signOutLocal);
  const wipeLocalAccount = useApp((s) => s.wipeLocalAccount);
  const resetLocalData = useApp((s) => s.resetLocalData);
  const profile = useApp((s) => s.profile);

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <div className="mb-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          {person.firstName}{" "}
          <span className="text-secondary">{person.age}</span>
        </h1>
        <p className="text-sm text-secondary">{person.city}</p>
        {wingName && (
          <p className="mt-2 text-sm font-medium text-wing-deep">
            Winged by {wingName}
          </p>
        )}
      </div>

      <PhotoGallery photos={person.photos} />

      <p className="mt-5 text-base leading-relaxed text-foreground">
        {person.vibe}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-secondary">{person.bio}</p>

      {prompts && prompts.length > 0 && (
        <div className="mt-5 space-y-3">
          {prompts.map((p) => (
            <div key={p.question} className="rounded-2xl bg-elevated px-4 py-3">
              <p className="text-xs font-semibold text-subtle">{p.question}</p>
              <p className="mt-1 text-sm font-medium">{p.answer}</p>
            </div>
          ))}
        </div>
      )}

      {isSelf && (
        <div className="mt-8 space-y-3">
          <h2 className="font-display text-lg font-extrabold">Preferences</h2>
          <AppearancePrefs />
          <h2 className="pt-2 font-display text-lg font-extrabold">Account</h2>
          <div className="divide-y divide-border rounded-2xl bg-surface shadow-soft">
            <div className="px-4 py-3.5">
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-secondary">
                Matches, Deal Room whispers, date reminders
              </p>
            </div>
            <div className="px-4 py-3.5">
              <p className="text-sm font-semibold">Privacy</p>
              <p className="text-xs text-secondary">
                Profile visible to your Wing network
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
              onClick={() => {
                switchShell();
                router.replace("/");
              }}
            >
              <span>
                <span className="block text-sm font-semibold">
                  {profile?.role === "bachelor"
                    ? "Also matchmake"
                    : "Also date"}
                </span>
                <span className="block text-xs text-secondary">
                  Open the other shell
                </span>
              </span>
              <span className="text-romance">→</span>
            </button>
          </div>
          <Button
            variant="ghost"
            className="w-full text-subtle"
            onClick={() => {
              signOutLocal();
              router.replace("/welcome");
            }}
          >
            Sign out
          </Button>
          <Button
            variant="ghost"
            className="w-full text-xs text-subtle"
            onClick={() => {
              wipeLocalAccount();
              router.replace("/welcome");
            }}
          >
            Delete account
          </Button>
          <Button
            variant="ghost"
            className="w-full text-[11px] text-subtle"
            onClick={() => {
              resetLocalData();
              router.replace("/welcome");
            }}
          >
            Reset local data
          </Button>
        </div>
      )}
    </section>
  );
}
