"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PoviMark } from "@/components/brand/povi-mark";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { useApp } from "@/lib/store";

export default function SignInPage() {
  const router = useRouter();
  const setAccount = useApp((s) => s.setAccount);
  const profilesByAccount = useApp((s) => s.profilesByAccount);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await signIn(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAccount(result.account.id);
    const profile =
      useApp.getState().profilesByAccount[result.account.id] ??
      profilesByAccount[result.account.id];
    if (!profile?.role) {
      router.replace("/auth/role");
      return;
    }
    if (!profile.onboardingComplete) {
      router.replace(
        profile.role === "bachelor"
          ? "/onboarding/bachelor"
          : "/onboarding/shark"
      );
      return;
    }
    router.replace(
      profile.role === "bachelor" ? "/bachelor/discover" : "/shark/swipe"
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 pb-10 pt-10">
      <Link href="/welcome" className="inline-flex items-center gap-2">
        <PoviMark className="size-9" />
        <span className="font-display text-lg font-extrabold">POVI</span>
      </Link>
      <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-secondary">Sign in to continue.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-romance/40"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-romance/40"
        />
        {error && <p className="text-sm font-medium text-romance">{error}</p>}
        <Button className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary">
        New here?{" "}
        <Link href="/auth/signup" className="font-bold text-romance">
          Create account
        </Link>
      </p>
    </div>
  );
}
