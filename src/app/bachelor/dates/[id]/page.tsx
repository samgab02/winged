"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { mockDates } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PhotoGallery } from "@/components/photos/photo-gallery";

export default function BachelorDateDetailPage() {
  const params = useParams<{ id: string }>();
  const date = mockDates.find((d) => d.id === params.id) ?? mockDates[0];

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        {date.pair}
      </h1>
      <p className="mt-1 text-sm text-secondary">
        {date.when} · {date.venue}
      </p>
      <p className="mt-3 text-sm text-secondary">{date.note}</p>

      <h2 className="mt-6 mb-2 text-sm font-semibold text-secondary">
        {date.personB.firstName}’s photos
      </h2>
      <PhotoGallery photos={date.personB.photos} />

      <div className="mt-6 flex gap-2">
        <Link href={`/bachelor/flash/${date.matchId}`} className="flex-1">
          <Button className="w-full">Chemistry flash</Button>
        </Link>
        <Link href="/bachelor/dates" className="flex-1">
          <Button variant="outline" className="w-full">
            Back
          </Button>
        </Link>
      </div>
    </section>
  );
}
