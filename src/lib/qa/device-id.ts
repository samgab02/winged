const KEY = "winged-qa-device-id-v1";

/** Stable anon device id for QA ticket sync before/without login. */
export function getQaDeviceId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = `dev_${crypto.randomUUID()}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `dev_ephemeral`;
  }
}
