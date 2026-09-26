/** Browser geolocation + haversine distance for Proof of Stay. */

export type LatLng = { lat: number; lng: number };

export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getCurrentPosition(
  options?: PositionOptions
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not available in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
      ...options,
    });
  });
}

/** Known venue coordinates for seed dates (Tel Aviv area). */
export const VENUE_COORDS: Record<string, LatLng> = {
  "Cafe Xo, Florentin": { lat: 32.0565, lng: 34.7678 },
  "The Port, Jaffa": { lat: 32.0535, lng: 34.7512 },
  "Norman Rooftop": { lat: 32.0736, lng: 34.7818 },
  "Gordon Beach café": { lat: 32.0831, lng: 34.7685 },
  default: { lat: 32.0853, lng: 34.7818 },
};

export async function checkInNearVenue(
  venueName: string,
  radiusMeters = 250
): Promise<
  | { ok: true; distanceM: number; accuracyM: number }
  | { ok: false; error: string; distanceM?: number }
> {
  try {
    const pos = await getCurrentPosition();
    const here = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
    const target =
      VENUE_COORDS[venueName] ||
      VENUE_COORDS.default;
    const distanceM = Math.round(haversineMeters(here, target));
    if (distanceM <= radiusMeters + (pos.coords.accuracy || 0)) {
      return {
        ok: true,
        distanceM,
        accuracyM: Math.round(pos.coords.accuracy || 0),
      };
    }
    return {
      ok: false,
      error: `You're about ${distanceM}m away (need within ~${radiusMeters}m).`,
      distanceM,
    };
  } catch (e) {
    const msg =
      e instanceof GeolocationPositionError
        ? e.code === 1
          ? "Location permission denied — enable it to check in."
          : e.message
        : e instanceof Error
          ? e.message
          : "Could not read location.";
    return { ok: false, error: msg };
  }
}
