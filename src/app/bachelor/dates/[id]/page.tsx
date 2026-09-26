"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Navigation, QrCode } from "lucide-react";
import { mockDates } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PhotoGallery } from "@/components/photos/photo-gallery";
import { checkInNearVenue } from "@/lib/geo";
import { checkQr, GEOFENCE_DWELL_SEC, QR_TTL_SEC } from "@/lib/fraud/rules";
import { useFraud } from "@/lib/fraud/store";
import { useApp } from "@/lib/store";

export default function BachelorDateDetailPage() {
  const params = useParams<{ id: string }>();
  const date = mockDates.find((d) => d.id === params.id) ?? mockDates[0];
  const showToast = useApp((s) => s.showToast);
  const startProof = useFraud((s) => s.startProof);
  const releaseOrFreeze = useFraud((s) => s.releaseOrFreeze);
  const escrow = useFraud((s) => s.escrow);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState("");
  const [dwell, setDwell] = useState(0);
  const [qrIssuedAt, setQrIssuedAt] = useState(Date.now());
  const [qrTick, setQrTick] = useState(0);
  const [mutualScans, setMutualScans] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setQrTick((t) => t + 1);
      if ((Date.now() - qrIssuedAt) / 1000 > QR_TTL_SEC) {
        setQrIssuedAt(Date.now());
        setMutualScans(0);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [qrIssuedAt]);

  useEffect(() => {
    if (!checkedIn || dwell >= GEOFENCE_DWELL_SEC) return;
    const id = setInterval(() => setDwell((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [checkedIn, dwell]);

  async function checkIn() {
    setChecking(true);
    setStatus("Reading GPS…");
    const geo = await checkInNearVenue(date.venue, 250);
    setChecking(false);
    if (!geo.ok) {
      setStatus(geo.error);
      showToast(geo.error);
      return;
    }
    setCheckedIn(true);
    setDwell(0);
    setStatus(
      `On-site · ${geo.distanceM}m away (±${geo.accuracyM}m). Stay ${GEOFENCE_DWELL_SEC}s.`
    );
    const open = escrow.find(
      (e) => e.status === "held" || e.status === "proof_pending"
    );
    if (open) startProof(open.id);
  }

  function scanHandshake() {
    const decision = checkQr({
      issuedAtMs: qrIssuedAt,
      used: false,
      mutualScans: mutualScans + 1,
    });
    const next = mutualScans + 1;
    setMutualScans(next);
    if (!decision.allow && next < 2) {
      showToast("Scan 1/2 — partner must scan live too");
      return;
    }
    if (!decision.allow) {
      showToast(decision.message);
      setQrIssuedAt(Date.now());
      setMutualScans(0);
      return;
    }
    if (dwell < GEOFENCE_DWELL_SEC) {
      showToast(`Keep dwelling — ${GEOFENCE_DWELL_SEC - dwell}s left`);
      return;
    }
    const open = escrow.find((e) => e.status === "proof_pending");
    if (open) {
      releaseOrFreeze(open.id, "ok");
      showToast("Mutual proof OK — escrow can release");
    } else {
      showToast("Proof handshake complete");
    }
  }

  const qrAge = Math.max(
    0,
    QR_TTL_SEC - Math.floor((Date.now() - qrIssuedAt) / 1000)
  );

  return (
    <section className="mx-auto w-full max-w-md px-4 pt-3 pb-6">
      <h1 className="text-center font-display text-2xl font-extrabold tracking-tight">
        {date.pair}
      </h1>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-secondary">
        <MapPin className="size-4 text-wing" />
        {date.venue} · {date.when}
      </p>
      <p className="mt-3 text-center text-sm text-secondary">{date.note}</p>

      <div className="mt-5 rounded-2xl panel-soft p-4">
        <p className="text-sm font-semibold">Proof of Stay</p>
        <p className="mt-1 text-xs text-secondary">
          Real browser GPS geofence + dwell + rotating QR handshake (≤{QR_TTL_SEC}
          s). Screenshots don&apos;t pay.
        </p>
        {status && (
          <p className="mt-2 text-xs font-medium text-secondary">{status}</p>
        )}
        {checkedIn ? (
          <>
            <p className="mt-3 text-sm font-bold text-success">
              Checked in · dwell {dwell}/{GEOFENCE_DWELL_SEC}s
            </p>
            <div className="mt-3 flex flex-col items-center rounded-2xl border border-border bg-surface p-4">
              <QrCode className="size-16 text-foreground" />
              <p className="mt-2 font-mono text-xs font-bold">
                LIVE · {qrAge}s · scans {mutualScans}/2
              </p>
              <p className="text-[10px] text-subtle" suppressHydrationWarning>
                token {(qrIssuedAt + qrTick).toString(36).slice(-6)}
              </p>
              <Button className="mt-3 w-full" onClick={scanHandshake}>
                Mutual scan handshake
              </Button>
            </div>
          </>
        ) : (
          <Button className="mt-3 w-full" onClick={checkIn} disabled={checking}>
            <Navigation className="size-4" />
            {checking ? "Finding you…" : "I’m here — check in"}
          </Button>
        )}
      </div>

      <h2 className="mt-6 mb-2 text-sm font-semibold text-secondary">
        {date.personB.firstName}
      </h2>
      <PhotoGallery photos={date.personB.photos} />

      <div className="mt-6 flex gap-2">
        <Link href={`/bachelor/flash/${date.matchId}`} className="flex-1">
          <Button className="w-full" variant="outline">
            Chemistry flash
          </Button>
        </Link>
        <Link href="/bachelor/dates" className="flex-1">
          <Button variant="ghost" className="w-full">
            Back
          </Button>
        </Link>
      </div>
    </section>
  );
}
