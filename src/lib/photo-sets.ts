/**
 * Same-identity multi-photo sets for seed profiles.
 * Each set is built from ONE Unsplash asset with varied crops/framing so
 * Story / gallery never mixes different people in one profile.
 */

export type ShotOpts = {
  w?: number;
  h?: number;
  crop?: "faces" | "entropy" | "top" | "bottom" | "focalpoint" | "edges";
  fpY?: number;
  fpX?: number;
  q?: number;
};

export function unsplashShot(id: string, opts: ShotOpts = {}): string {
  const {
    w = 800,
    h = 1200,
    crop = "faces",
    fpY,
    fpX,
    q = 82,
  } = opts;
  const params = new URLSearchParams({
    w: String(w),
    h: String(h),
    fit: "crop",
    crop,
    auto: "format",
    q: String(q),
  });
  if (crop === "focalpoint") {
    params.set("fp-x", String(fpX ?? 0.5));
    params.set("fp-y", String(fpY ?? 0.35));
  }
  return `https://images.unsplash.com/${id}?${params.toString()}`;
}

/** 4–5 frames of the same person via crop / focal variants of one photo id */
export function samePersonPhotos(photoId: string, count = 4): string[] {
  const frames: ShotOpts[] = [
    { w: 800, h: 1200, crop: "faces" },
    { w: 900, h: 1200, crop: "focalpoint", fpY: 0.28 },
    { w: 800, h: 1100, crop: "entropy" },
    { w: 850, h: 1200, crop: "top" },
    { w: 800, h: 1200, crop: "focalpoint", fpY: 0.45, fpX: 0.48 },
    { w: 820, h: 1150, crop: "edges" },
  ];
  return frames.slice(0, Math.min(count, frames.length)).map((o) =>
    unsplashShot(photoId, o)
  );
}

export function avatarFrom(photoId: string, size = 200): string {
  return unsplashShot(photoId, {
    w: size,
    h: size,
    crop: "faces",
    q: 85,
  });
}

/** Primary Unsplash ids — one identity per seed person */
export const IDENTITY_PHOTO = {
  eli: "photo-1506794778202-cad84cf45f1d",
  lina: "photo-1531746020798-e6953c6e8e04",
  yonatan: "photo-1492562080023-ab3db95bfbce",
  tom: "photo-1539571696357-5a69c17a67c6",
  maya: "photo-1524504388940-b1c1722653e1",
  noa: "photo-1534528741775-53994a69daeb",
  dani: "photo-1507003211169-0a1dd7228f2d",
  omi: "photo-1438761681033-6461ffad8d80",
  tamar: "photo-1544005313-94ddf0286df2",
  leo: "photo-1500648767791-00dcc994a43e",
} as const;

export const PHOTO_STARTER_PACK = [
  ...samePersonPhotos(IDENTITY_PHOTO.maya, 2),
  ...samePersonPhotos(IDENTITY_PHOTO.lina, 2),
  ...samePersonPhotos(IDENTITY_PHOTO.eli, 2),
  ...samePersonPhotos(IDENTITY_PHOTO.tom, 2),
  ...samePersonPhotos(IDENTITY_PHOTO.yonatan, 2),
  ...samePersonPhotos(IDENTITY_PHOTO.noa, 2),
];
