/** Real Web Share + clipboard helpers for Wing invites. */

export async function shareOrCopy(opts: {
  title: string;
  text: string;
  url: string;
}): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return "shared";
    } catch (e) {
      // User cancelled share sheet — fall through to copy only if not AbortError
      if (e instanceof DOMException && e.name === "AbortError") {
        throw e;
      }
    }
  }

  await navigator.clipboard.writeText(`${opts.text}\n${opts.url}`);
  return "copied";
}

export function inviteUrl(code: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "https://winged.app");
  return `${base}/invite/${encodeURIComponent(code)}`;
}
