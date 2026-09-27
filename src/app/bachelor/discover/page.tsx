"use client";

import { useEffect, useMemo, useState } from "react";
import { SwipeDeck } from "@/components/cards/swipe-card";
import { DiscoverSideRail } from "@/components/discover/discover-side-rail";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { catalogAsDuoCards } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export default function BachelorDiscoverPage() {
  const lookingFor = useApp((s) => s.profile?.lookingFor);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">(
    "loading"
  );

  const cards = useMemo(
    () => catalogAsDuoCards(lookingFor),
    [lookingFor]
  );

  useEffect(() => {
    const t = setTimeout(() => setStatus(cards.length ? "ready" : "empty"), 500);
    return () => clearTimeout(t);
  }, [cards.length]);

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
        body="Check back soon — Wings are vouching fresh profiles."
        actionLabel="Refresh"
        onAction={() => setStatus("loading")}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col lg:max-w-6xl lg:flex-row lg:items-start lg:gap-8 lg:px-6 lg:py-5 xl:gap-10 xl:px-8">
      <div className="min-w-0 flex-1 lg:pt-1">
        <SwipeDeck
          cards={cards}
          title="Discover"
          subtitle="Like someone and your Wing takes the next step."
          leftLabel="Pass"
          rightLabel="Like"
        />
      </div>
      <div className="w-full shrink-0 px-4 pb-6 lg:w-[20rem] lg:px-0 lg:pb-0 xl:w-[22rem]">
        <DiscoverSideRail />
      </div>
    </div>
  );
}
