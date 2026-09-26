import { NextResponse } from "next/server";

/**
 * Venue search via OpenStreetMap Nominatim (no API key).
 * Optional Mapbox if NEXT_PUBLIC_MAPBOX_TOKEN is set.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const city = (searchParams.get("city") || "Tel Aviv").trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const mapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  if (mapbox) {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        `${q} ${city}`
      )}.json`
    );
    url.searchParams.set("access_token", mapbox);
    url.searchParams.set("limit", "6");
    url.searchParams.set("types", "poi,address");
    const res = await fetch(url.toString());
    if (!res.ok) {
      return NextResponse.json(
        { error: "Mapbox search failed", results: [] },
        { status: 502 }
      );
    }
    const data = (await res.json()) as {
      features?: { id: string; place_name: string; center: [number, number] }[];
    };
    return NextResponse.json({
      results: (data.features || []).map((f) => ({
        id: f.id,
        name: f.place_name.split(",")[0],
        label: f.place_name,
        lat: f.center[1],
        lng: f.center[0],
      })),
    });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", `${q}, ${city}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "6");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "WingedDatingApp/1.0 (venues; contact: winged@local)",
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Nominatim search failed", results: [] },
      { status: 502 }
    );
  }

  const data = (await res.json()) as {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    name?: string;
  }[];

  return NextResponse.json({
    results: data.map((d) => ({
      id: String(d.place_id),
      name: d.name || d.display_name.split(",")[0],
      label: d.display_name,
      lat: Number(d.lat),
      lng: Number(d.lon),
    })),
  });
}
