"use client";

import { SwipeDeck } from "@/components/cards/swipe-card";
import { catalogAsDuoCards } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export default function WingSwipePage() {
  const bachelor = useApp((s) => s.profile?.linkedBachelorName ?? "them");
  const cards = catalogAsDuoCards();

  return (
    <SwipeDeck
      cards={cards}
      title="Swipe for them"
      subtitle={`Vouch who feels right for ${bachelor}.`}
      leftLabel="Pass"
      rightLabel="Vouch"
    />
  );
}
