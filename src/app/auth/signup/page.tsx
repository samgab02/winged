"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WingedMark } from "@/components/brand/winged-mark";
import { Button } from "@/components/ui/button";
import { ToastHost } from "@/components/ui/toast";
import { signUp } from "@/lib/auth";
import { useApp } from "@/lib/store";

export default function SignUpPage() {
  const router = useRouter();
  const setAccount = useApp((s) => s.setAccount);
  const showToast = useApp((s) => s.showToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await signUp(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAccount(result.account.id);
    router.replace("/auth/role");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center px-6 pb-10 pt-10 text-center">
      <ToastHost />
      <Link href="/welcome" className="inline-flex" aria-label="Winged">
        <WingedMark className="h-12 w-12" />
      </Link>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 max-w-xs text-sm text-secondary">
        Email and password to save your profile.
      </p>

      <form onSubmit={onSubmit} className="mt-8 w-full max-w-sm space-y-3 text-left">
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ characters)"
          className="h-12 w-full rounded-2xl border border-border bg-surface px-4 outline-none focus:border-romance/40"
        />
        {error && <p className="text-sm font-medium text-romance">{error}</p>}
        <Button className="w-full" disabled={busy}>
          {busy ? "Creating…" : "Continue"}
        </Button>
      </form>

      <div className="mt-6 w-full max-w-sm space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Or continue with
        </p>
        {(["Apple", "Google", "WhatsApp"] as const).map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => showToast(`${provider} sign-in coming soon`)}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface text-sm font-semibold"
          >
            Continue with {provider}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-secondary">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-bold text-romance">
          Sign in
        </Link>
      </p>
    </div>
  );
}
