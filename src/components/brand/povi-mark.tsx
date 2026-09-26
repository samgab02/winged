import { cn } from "@/lib/utils";

export function PoviMark({
  className,
  title = "POVI",
}: {
  className?: string;
  title?: string;
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
      <rect width="64" height="64" rx="18" fill="#FF4D6D" />
      <path
        d="M14 34c2.5-9 9-15 18-15s15.5 6 18 15c.6 2.2-1 4.2-3.2 4.2H17.2C15 38.2 13.4 36.2 14 34Z"
        fill="#FFF8F4"
      />
      <path
        d="M22 28.5c1.2-3.5 4-5.5 8-5.5"
        stroke="#FF4D6D"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="26.5" cy="31.5" r="2.2" fill="#1A1A1A" />
      <path
        d="M40 22l8-5v7.5c0 2.2-1.5 3.5-3.5 4.2L40 30V22Z"
        fill="#2EC4B6"
      />
      <path
        d="M18 40.5c3.5 3 8 4.5 14 4.5s10.5-1.5 14-4.5"
        stroke="#FFF8F4"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}

export function PoviWordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PoviMark className={cn("size-8", markClassName)} />
      <span className="font-display text-xl font-extrabold tracking-tight">
        POVI
      </span>
    </span>
  );
}
