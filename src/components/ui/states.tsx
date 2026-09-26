"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoviMark } from "@/components/brand/povi-mark";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <PoviMark className="size-10 animate-pulse" />
      <p className="text-sm font-medium text-secondary">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-elevated">
        <PoviMark className="size-8" />
      </div>
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="max-w-xs text-sm text-secondary">{body}</p>
      {actionLabel && onAction && (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went sideways",
  body = "Something went wrong — try again in a moment.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-romance-soft">
        <AlertCircle className="size-6 text-romance" strokeWidth={1.75} />
      </div>
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="max-w-xs text-sm text-secondary">{body}</p>
      {onRetry && (
        <Button variant="outline" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
