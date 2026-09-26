"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Navigation } from "lucide-react";
import { mockDates } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PhotoGallery } from "@/components/photos/photo-gallery";

export default function BachelorDateDetailPage() {
  const params = useParams<{ id: string }>();
  const date = mockDates.find((d) => d.id === params.id) ?? mockDates[0];
  const [checkedIn, setCheckedIn] = useState(false);
  const [checking, setChecking] = useState(false);

  function checkIn() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setCheckedIn(true);
    }, 1200);
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        {date.pair}
      </h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-secondary">
        <MapPin className="size-4 text-shark" />
        {date.venue} · {date.when}
      </p>
      <p className="mt-3 text-sm text-secondary">{date.note}</p>

      <div className="mt-5 rounded-2xl bg-elevated p-4">
        <p className="text-sm font-semibold">Proof of Stay</p>
        <p className="mt-1 text-xs text-secondary">
          Check in on-site so both sides confirm you made it. GPS geofence is
          simulated for now.
        </p>
        {checkedIn ? (
          <p className="mt-3 text-sm font-bold text-success">
            Checked in · waiting on mutual confirm
          </p>
        ) : (
          <Button
            className="mt-3 w-full"
            onClick={checkIn}
            disabled={checking}
          >
            <Navigation className="size-4" />
            {checking ? "Finding you…" : "I’m here — check in"}
          </Button>
        )}
      </div>

      <h2 className="mt-6 mb-2 text-sm font-semibold text-secondary">
        {date.personB.firstName}
      </h2>
      <PhotoGallery photos={date.personB.photos} />

      <div className="mt-6 flex gap-2">
        <Link href={`/bachelor/flash/${date.matchId}`} className="flex-1">
          <Button className="w-full" variant="outline">
            Chemistry flash
          </Button>
        </Link>
        <Link href="/bachelor/dates" className="flex-1">
          <Button variant="ghost" className="w-full">
            Back
          </Button>
        </Link>
      </div>
    </section>
  );
}
