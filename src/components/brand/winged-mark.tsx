import { cn } from "@/lib/utils";

/**
 * Company mark — AI logo v2 heart-wing symbol (PNG, no tile).
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
    <span
      className={cn("relative inline-block shrink-0", className)}
      role="img"
      aria-label={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/winged-symbol-v2.png"
        alt=""
        className="h-full w-full object-contain object-center"
        draggable={false}
      />
    </span>
  );
}

/** Horizontal lockup — symbol + WINGED wordmark */
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
        src="/brand/winged-lockup-v2.png"
        alt={title}
        className="h-full w-full object-contain object-center"
        draggable={false}
      />
    </span>
  );
}

/** Alias: stacked/compact still uses the symbol */
export function WingedMarkLockup({
  className,
  title = "Winged",
}: {
  className?: string;
  title?: string;
}) {
  return <WingedMark className={className} title={title} />;
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

/** Single wing sprite for motion layers */
export function WingSprite({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/winged-sprite-wing.png"
      alt=""
      aria-hidden
      draggable={false}
      className={cn(
        "pointer-events-none select-none object-contain",
        flip && "scale-x-[-1]",
        className
      )}
    />
  );
}
