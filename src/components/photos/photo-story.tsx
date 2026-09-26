"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PhotoStory({
  photos,
  className,
  children,
  autoAdvanceMs = 0,
}: {
  photos: string[];
  className?: string;
  children?: ReactNode;
  autoAdvanceMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const total = Math.max(photos.length, 1);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoAdvanceMs || total < 2) return;
    const id = setInterval(next, autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoAdvanceMs, next, total]);

  return (
    <div className={cn("relative overflow-hidden bg-elevated", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[index] ?? photos[0]}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Story segments */}
      {total > 1 && (
        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
          {photos.map((_, i) => (
            <div
              key={i}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/35"
            >
              <div
                className={cn(
                  "h-full rounded-full bg-white transition-all",
                  i < index ? "w-full" : i === index ? "w-full" : "w-0"
                )}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tap zones */}
      <button
        type="button"
        aria-label="Previous photo"
        className="absolute inset-y-0 left-0 z-10 w-1/3"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
      />
      <button
        type="button"
        aria-label="Next photo"
        className="absolute inset-y-0 right-0 z-10 w-1/3"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
      />

      {children}
    </div>
  );
}
