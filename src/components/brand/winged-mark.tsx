import { cn } from "@/lib/utils";

/**
 * Compact company mark for nav / auth — SVG wing only, never a colored tile.
 * Prefer this over the vertical PNG lockup in tight chrome.
 */
export function WingedMark({
  className,
  title = "Winged",
}: {
  className?: string;
  title?: string;
  priority?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <path
        d="M8 44c9-2.5 16-9.5 20.5-18.5 1.4-2.8 4.4-3.8 7-2.6 1.9.9 2.8 3 2.3 5.1-1.4 6-5.1 11.8-10.6 16.4-3.7 3-8.5 5.1-13.8 6-.9.2-1.6-.6-1.4-1.5.3-1.6.9-3.2 1.7-4.9Z"
        fill="#2A2421"
      />
      <path
        d="M30 16c3.8 1.4 8 5 11.2 10.8 1.2 2.1.2 4.7-1.9 5.6l-3.8 1.6c-1.9.8-4-.3-4.5-2.3L29.2 23c-.6-2.1.9-4.2 3-4.9.1 0 .2 0 .3-.1Z"
        fill="#D4516C"
      />
      <path
        d="M36 12c5.2 2.4 10.8 7.6 14.6 15.4 1.1 2.1 0 4.7-2.2 5.4l-3 .9c-1.8.5-3.6-.6-4-2.4l-1.4-6.8c-.5-2.4 1.2-4.6 3.5-5.3.2-.1.5-.2.7-.2Z"
        fill="#2A2421"
      />
      <path
        d="M44 10c4.4 2.8 8.8 8.2 11.8 15.2.8 1.9-.2 4-2.1 4.6l-2.1.7c-1.4.4-2.9-.4-3.3-1.8L46.8 21c-.5-1.9.7-3.8 2.6-4.3.2-.1.4-.2.6-.2Z"
        fill="#6B8F9C"
        opacity=".85"
      />
    </svg>
  );
}

/** Horizontal company lockup PNG — splash / welcome */
export function WingedLockup({
  className,
  title = "Winged",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      role="img"
      aria-label={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/winged-lockup.png"
        alt={title}
        className="h-full w-full object-contain object-center"
        draggable={false}
      />
    </span>
  );
}

/** Vertical mark PNG (graphic + WINGED) when a stacked brand unit is needed */
export function WingedMarkLockup({
  className,
  title = "Winged",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      role="img"
      aria-label={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/winged-mark.png"
        alt={title}
        className="h-full w-full object-contain object-center"
        draggable={false}
      />
    </span>
  );
}

export function WingedWordmark({
  className,
  markClassName,
  showWord = false,
}: {
  className?: string;
  markClassName?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <WingedMark className={cn("size-8", markClassName)} />
      {showWord && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          Winged
        </span>
      )}
    </span>
  );
}
