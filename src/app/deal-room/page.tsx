import { DealRoomView } from "@/components/deal-room/deal-room-view";
import {
  mockDealMessages,
  mockDealRoom,
  mockProfiles,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function DealRoomPage() {
  const started = Date.now() - 45_000;
  const room = {
    ...mockDealRoom,
    started_at: new Date(started).toISOString(),
    ends_at: new Date(started + 180_000).toISOString(),
    status: "active" as const,
  };

  return (
    <DealRoomView
      room={room}
      messages={mockDealMessages}
      sharkA={mockProfiles.shark_noa}
      sharkB={mockProfiles.shark_dani}
      bachelorA={mockProfiles.bach_maya}
      bachelorB={mockProfiles.bach_eli}
    />
  );
}
