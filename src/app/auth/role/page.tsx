"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WingedMark } from "@/components/brand/winged-mark";
import { getSessionAccountId } from "@/lib/auth";
import { useApp } from "@/lib/store";

export default function RolePickPage() {
  const router = useRouter();
  const accountId = useApp((s) => s.accountId);
  const hydrateSession = useApp((s) => s.hydrateSession);
  const upsertProfile = useApp((s) => s.upsertProfile);

  useEffect(() => {
    const id = getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    hydrateSession(id);
  }, [hydrateSession, router]);

  function choose(role: "bachelor" | "wing") {
    const id = accountId || getSessionAccountId();
    if (!id) {
      router.replace("/welcome");
      return;
    }
    upsertProfile({ accountId: id, role, onboardingComplete: false });
    router.push(
      role === "bachelor" ? "/onboarding/bachelor" : "/onboarding/wing"
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 pb-10 pt-10">
      <WingedMark className="h-14 w-14" />
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
        How will you use Winged?
      </h1>
      <p className="mt-2 text-sm text-secondary">
        You can add the other mode later from settings.
      </p>

      <div className="mt-10 space-y-3">
        <button
          type="button"
          onClick={() => choose("bachelor")}
          className="w-full rounded-2xl bg-romance px-5 py-4 text-left text-white shadow-soft"
        >
          <span className="block font-display text-lg font-extrabold">
            I&apos;m dating
          </span>
          <span className="mt-0.5 block text-sm text-white/85">
            Bachelor · discover people with a Wing in your corner
          </span>
        </button>
        <button
          type="button"
          onClick={() => choose("wing")}
          className="w-full rounded-2xl bg-wing px-5 py-4 text-left text-white shadow-soft"
        >
          <span className="block font-display text-lg font-extrabold">
            I&apos;m a Wing
          </span>
          <span className="mt-0.5 block text-sm text-white/85">
            Wing · vouch, negotiate, lock the date
          </span>
        </button>
      </div>
    </div>
  );
}
