"use client";

import { useParams } from "next/navigation";
import { ChemistryFlash } from "@/components/flash/chemistry-flash";

export default function SharkFlashPage() {
  const params = useParams<{ id: string }>();
  return (
    <ChemistryFlash matchId={params.id} backHref="/shark/deal-room" />
  );
}
