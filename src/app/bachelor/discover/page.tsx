"use client";

import { useEffect } from "react";
import { SwipeDeck } from "@/components/cards/swipe-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { discoverCards } from "@/lib/mock-data";
import { useSession } from "@/lib/store";

export default function BachelorDiscoverPage() {
  const listStatus = useSession((s) => s.listStatus);
  const setListStatus = useSession((s) => s.setListStatus);

  useEffect(() => {
    if (listStatus === "loading") {
      const t = setTimeout(() => setListStatus("ready"), 700);
      return () => clearTimeout(t);
    }
  }, [listStatus, setListStatus]);

  if (listStatus === "loading") {
    return <LoadingState label="Finding people near you…" />;
  }
  if (listStatus === "error") {
    return (
      <ErrorState onRetry={() => setListStatus("loading")} />
    );
  }
  if (listStatus === "empty") {
    return (
      <EmptyState
        title="Nobody new right now"
        body="Check back when Sharks vouch fresh profiles — or replay the demo deck."
        actionLabel="Reload demo"
        onAction={() => setListStatus("ready")}
      />
    );
  }

  return (
    <SwipeDeck
      cards={discoverCards}
      title="Discover"
      subtitle="Like someone? Your Shark will take it from there."
      leftLabel="Pass"
      rightLabel="Like"
    />
  );
}
