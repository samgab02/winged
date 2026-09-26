"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoGallery({
  photos,
  className,
}: {
  photos: string[];
  className?: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className={cn("grid grid-cols-3 gap-1.5", className)}>
        {photos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setLightbox(i)}
            className={cn(
              "relative overflow-hidden rounded-xl bg-elevated",
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="size-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[lightbox]}
            alt=""
            className="max-h-[85dvh] max-w-full rounded-2xl object-contain"
          />
          <div className="absolute bottom-6 flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(i)}
                className={cn(
                  "size-2 rounded-full",
                  i === lightbox ? "bg-white" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
