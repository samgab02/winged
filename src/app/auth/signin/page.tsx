"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WingedMark } from "@/components/brand/winged-mark";
import { Button } from "@/components/ui/button";
import { DevLoginBootstrap } from "@/components/auth/dev-login-bootstrap";
import { signIn } from "@/lib/auth";
import { DEV_LOGINS, DEV_PASSWORD } from "@/lib/dev-logins";
import { useApp } from "@/lib/store";

export default function SignInPage() {
  const router = useRouter();
  const setAccount = useApp((s) => s.setAccount);
  const bootstrapDevLogins = useApp((s) => s.bootstrapDevLogins);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void bootstrapDevLogins();
  }, [bootstrapDevLogins]);

  async function finishSignIn(accountId: string) {
    setAccount(accountId);
    await bootstrapDevLogins();
    const profile = useApp.getState().profilesByAccount[accountId];
    if (!profile?.role) {
      router.replace("/auth/role");
      return;
    }
    if (!profile.onboardingComplete) {
      router.replace(
        profile.role === "bachelor"
          ? "/onboarding/bachelor"
          : "/onboarding/wing"
      );
      return;
    }
    router.replace(
      profile.role === "bachelor" ? "/bachelor/discover" : "/wing/swipe"
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await signIn(email, password);
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    await finishSignIn(result.account.id);
    setBusy(false);
  }

  async function quickLogin(loginEmail: string) {
    setBusy(true);
    setError("");
    setEmail(loginEmail);
    setPassword(DEV_PASSWORD);
    await bootstrapDevLogins();
    const result = await signIn(loginEmail, DEV_PASSWORD);
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    await finishSignIn(result.account.id);
    setBusy(false);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 pb-10 pt-10">
      <DevLoginBootstrap />
      <Link href="/welcome" className="inline-flex items-center gap-2">
        <WingedMark className="size-9" />
        <span className="font-display text-lg font-extrabold">Winged</span>
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

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Local defaults
        </p>
        <p className="text-xs text-secondary">
          Password: <span className="font-semibold">{DEV_PASSWORD}</span>
        </p>
        {DEV_LOGINS.map((login) => (
          <button
            key={login.id}
            type="button"
            disabled={busy}
            onClick={() => void quickLogin(login.email)}
            className="flex h-12 w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 text-sm font-semibold disabled:opacity-60"
          >
            <span>{login.label}</span>
            <span className="text-xs font-medium text-subtle">{login.email}</span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-secondary">
        New here?{" "}
        <Link href="/auth/signup" className="font-bold text-romance">
          Create account
        </Link>
      </p>
    </div>
  );
}
