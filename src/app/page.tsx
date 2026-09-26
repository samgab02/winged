import { DualCardFeed } from "@/components/feed/dual-card-feed";
import { mockFeedCards } from "@/lib/mock-data";

export default function FeedPage() {
  return <DualCardFeed cards={mockFeedCards} />;
}
