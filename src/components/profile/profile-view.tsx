"use client";

import Link from "next/link";
import type { Person } from "@/lib/mock-data";
import { PhotoGallery } from "@/components/photos/photo-gallery";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/store";

export function ProfileView({
  person,
  sharkName,
  isSelf,
  settingsHref,
}: {
  person: Person;
  sharkName?: string;
  isSelf?: boolean;
  settingsHref?: string;
}) {
  const switchRole = useSession((s) => s.switchRole);
  const resetDemo = useSession((s) => s.resetDemo);
  const setListStatus = useSession((s) => s.setListStatus);

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {person.firstName}{" "}
            <span className="text-secondary">{person.age}</span>
          </h1>
          <p className="text-sm text-secondary">{person.city}</p>
        </div>
        {sharkName && (
          <span className="rounded-full bg-shark-soft px-3 py-1 text-xs font-bold text-shark-deep">
            Shark: {sharkName}
          </span>
        )}
      </div>

      <PhotoGallery photos={person.photos} />

      <p className="mt-5 text-sm leading-relaxed text-secondary">{person.bio}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{person.vibe}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {person.interests.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-elevated px-3 py-1 text-xs font-semibold text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>

      {isSelf && (
        <div className="mt-8 space-y-2 rounded-3xl card-surface p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-subtle">
            Demo settings
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              switchRole();
              window.location.href = "/";
            }}
          >
            Switch role (demo)
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setListStatus("loading")}
          >
            Simulate Discover loading
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setListStatus("empty")}
          >
            Simulate Discover empty
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setListStatus("error")}
          >
            Simulate Discover error
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              resetDemo();
              window.location.href = "/";
            }}
          >
            Reset demo
          </Button>
          {settingsHref && (
            <Link href={settingsHref} className="block text-center text-xs text-subtle">
              {settingsHref}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
