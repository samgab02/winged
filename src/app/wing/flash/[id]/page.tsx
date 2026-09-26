"use client";

import { useParams } from "next/navigation";
import { ChemistryFlash } from "@/components/flash/chemistry-flash";

export default function WingFlashPage() {
  const params = useParams<{ id: string }>();
  return (
    <ChemistryFlash matchId={params.id} backHref="/wing/deal-room" />
  );
}
