"use client";

import { useParams } from "next/navigation";
import { DealRoomPanel } from "@/components/deal-room/deal-room";

export default function BachelorDealRoomPage() {
  const params = useParams<{ id: string }>();
  return <DealRoomPanel mode="bachelor" matchId={params.id} />;
}
