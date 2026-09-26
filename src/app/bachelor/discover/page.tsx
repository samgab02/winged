"use client";

import { useEffect, useState } from "react";
import { SwipeDeck } from "@/components/cards/swipe-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { discoverCards } from "@/lib/mock-data";

export default function BachelorDiscoverPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">(
    "loading"
  );

  useEffect(() => {
    const t = setTimeout(() => setStatus("ready"), 550);
    return () => clearTimeout(t);
  }, []);

  if (status === "loading") {
    return <LoadingState label="Finding people near you…" />;
  }
  if (status === "error") {
    return <ErrorState onRetry={() => setStatus("loading")} />;
  }
  if (status === "empty") {
    return (
      <EmptyState
        title="Nobody new right now"
        body="Check back soon — Sharks are vouching fresh profiles."
        actionLabel="Refresh"
        onAction={() => setStatus("loading")}
      />
    );
  }

  return (
    <SwipeDeck
      cards={discoverCards}
      title="Discover"
      subtitle="Like someone and your Shark takes the next step."
      leftLabel="Pass"
      rightLabel="Like"
    />
  );
}
