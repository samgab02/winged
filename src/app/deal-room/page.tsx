import { DealRoomView } from "@/components/deal-room/deal-room-view";
import {
  mockDealMessages,
  mockDealRoom,
  mockProfiles,
} from "@/lib/mock-data";

export default function DealRoomPage() {
  return (
    <DealRoomView
      room={mockDealRoom}
      messages={mockDealMessages}
      sharkA={mockProfiles.shark_noa}
      sharkB={mockProfiles.shark_dani}
      bachelorA={mockProfiles.bach_maya}
      bachelorB={mockProfiles.bach_eli}
    />
  );
}
