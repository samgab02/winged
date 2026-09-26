"use client";

import { useRouter } from "next/navigation";
import type { Person } from "@/lib/mock-data";
import { PhotoGallery } from "@/components/photos/photo-gallery";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/store";

export function ProfileView({
  person,
  sharkName,
  isSelf,
}: {
  person: Person;
  sharkName?: string;
  isSelf?: boolean;
  settingsHref?: string;
}) {
  const router = useRouter();
  const switchRole = useSession((s) => s.switchRole);
  const resetDemo = useSession((s) => s.resetDemo);
  const sharkMode = useSession((s) => s.sharkMode);

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <div className="mb-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          {person.firstName}{" "}
          <span className="text-secondary">{person.age}</span>
        </h1>
        <p className="text-sm text-secondary">{person.city}</p>
        {sharkName && (
          <p className="mt-2 text-sm font-medium text-shark-deep">
            Winged by {sharkName}
          </p>
        )}
      </div>

      <PhotoGallery photos={person.photos} />

      <p className="mt-5 text-base leading-relaxed text-foreground">
        {person.vibe}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-secondary">{person.bio}</p>

      {isSelf && (
        <div className="mt-8 space-y-3">
          <h2 className="font-display text-lg font-extrabold">Account</h2>
          <div className="rounded-2xl card-surface divide-y divide-border">
            <div className="px-4 py-3.5">
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-secondary">
                Matches, Deal Room whispers, date reminders — on
              </p>
            </div>
            <div className="px-4 py-3.5">
              <p className="text-sm font-semibold">Privacy</p>
              <p className="text-xs text-secondary">
                Profile visible to linked Shark network
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
              onClick={() => {
                switchRole();
                router.replace("/");
              }}
            >
              <span>
                <span className="block text-sm font-semibold">
                  {sharkMode === "pro" || !sharkName
                    ? "Also matchmake"
                    : "Switch to Shark"}
                </span>
                <span className="block text-xs text-secondary">
                  Open the other POVI shell for this device
                </span>
              </span>
              <span className="text-romance">→</span>
            </button>
          </div>
          <Button
            variant="ghost"
            className="w-full text-subtle"
            onClick={() => {
              resetDemo();
              router.replace("/");
            }}
          >
            Sign out
          </Button>
        </div>
      )}
    </section>
  );
}
