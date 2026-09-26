"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { WingedMark } from "@/components/brand/winged-mark";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

/**
 * Deep link for Wing invites — stores pending invite code and routes to signup.
 */
export default function InviteLandingPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code || "");
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const upsertProfile = useApp((s) => s.upsertProfile);

  useEffect(() => {
    if (!code) return;
    try {
      localStorage.setItem("winged-pending-invite", code);
    } catch {
      /* ignore */
    }
  }, [code]);

  useEffect(() => {
    if (profile?.role === "bachelor" && code) {
      upsertProfile({
        accountId: profile.accountId,
        linkedWingName: code,
      });
    }
  }, [profile, code, upsertProfile]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center px-6 pb-10 pt-16 text-center">
      <WingedMark className="h-16 w-16" />
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
        You&apos;re invited
      </h1>
      <p className="mt-2 max-w-sm text-sm text-secondary">
        <span className="font-semibold text-foreground">{code || "A friend"}</span>{" "}
        wants to be your Wing on Winged — friends plan it, you show up.
      </p>
      <div className="mt-8 w-full max-w-sm space-y-3">
        <Button
          className="w-full"
          onClick={() => router.push("/auth/signup")}
        >
          Create account
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/auth/signin")}
        >
          Sign in
        </Button>
        <Link href="/welcome" className="block text-sm font-semibold text-subtle">
          Back to welcome
        </Link>
      </div>
    </div>
  );
}
