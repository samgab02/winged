"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WingedMark } from "@/components/brand/winged-mark";
import { Button } from "@/components/ui/button";
import { ToastHost } from "@/components/ui/toast";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { AuthEnterFromWelcome } from "@/components/motion/welcome-auth-transition";
import { signUp } from "@/lib/auth";
import { useApp } from "@/lib/store";

export default function SignUpPage() {
  const router = useRouter();
  const setAccount = useApp((s) => s.setAccount);
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
    <AuthEnterFromWelcome>
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center px-6 pb-10 pt-10 text-center">
      <ToastHost />
      <Link href="/welcome" className="inline-flex" aria-label="Winged">
        <WingedMark className="h-12 w-12" />
      </Link>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 max-w-xs text-sm text-secondary">
        Email, Google, Apple, or phone — real auth paths, not placeholders.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 w-full max-w-sm space-y-3 text-left"
      >
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

      <OAuthButtons className="mt-6 w-full max-w-sm" />

      <p className="mt-8 text-sm text-secondary">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-bold text-romance">
          Sign in
        </Link>
      </p>
    </div>
    </AuthEnterFromWelcome>
  );
}
