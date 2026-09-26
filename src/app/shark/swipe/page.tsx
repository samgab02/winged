"use client";

import { SwipeDeck } from "@/components/cards/swipe-card";
import { sharkSwipeCards } from "@/lib/mock-data";
import { useSession } from "@/lib/store";

export default function SharkSwipePage() {
  const bachelor = useSession((s) => s.linkedBachelorName);

  return (
    <SwipeDeck
      cards={sharkSwipeCards}
      title="Swipe for them"
      subtitle={`Vouch who feels right for ${bachelor}. Skip the rest.`}
      leftLabel="Skip"
      rightLabel="Vouch"
    />
  );
}
