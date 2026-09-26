"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  startOAuth,
  startPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/auth/oauth";
import { bridgeSupabaseUser } from "@/lib/auth/bridge";
import { isSupabaseConfigured, missingAuthEnv } from "@/lib/supabase/config";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function OAuthButtons({ className }: { className?: string }) {
  const router = useRouter();
  const setAccount = useApp((s) => s.setAccount);
  const bootstrapDevLogins = useApp((s) => s.bootstrapDevLogins);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const configured = isSupabaseConfigured();

  async function onGoogle() {
    setBusy("google");
    setError("");
    setMissing([]);
    const result = await startOAuth("google");
    if (!result.ok) {
      setError(result.error);
      setMissing(result.missingEnv ?? missingAuthEnv());
      setBusy(null);
    }
    // On success, browser navigates away.
  }

  async function onApple() {
    setBusy("apple");
    setError("");
    setMissing([]);
    const result = await startOAuth("apple");
    if (!result.ok) {
      setError(result.error);
      setMissing(result.missingEnv ?? missingAuthEnv());
      setBusy(null);
    }
  }

  async function onSendOtp() {
    setBusy("phone");
    setError("");
    const result = await startPhoneOtp(phone);
    if (!result.ok) {
      setError(result.error);
      setMissing(result.missingEnv ?? []);
      setBusy(null);
      return;
    }
    setOtpSent(true);
    setBusy(null);
  }

  async function onVerifyOtp() {
    setBusy("phone");
    setError("");
    const result = await verifyPhoneOtp(phone, otp);
    if (!result.ok || !result.userId) {
      setError(result.ok === false ? result.error : "Verification failed.");
      setBusy(null);
      return;
    }
    const account = bridgeSupabaseUser({
      id: result.userId,
      email: result.email ?? null,
      provider: "phone",
    });
    setAccount(account.id);
    await bootstrapDevLogins();
    const profile = useApp.getState().profilesByAccount[account.id];
    setBusy(null);
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
      profile.role === "bachelor" ? "/bachelor/discover" : "/wing/hub"
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-subtle">
        Continue with
      </p>

      {!configured && (
        <p className="rounded-xl border border-border bg-elevated/60 px-3 py-2 text-left text-[11px] leading-relaxed text-secondary">
          OAuth is wired end-to-end. Add{" "}
          <code className="font-mono text-foreground">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="font-mono text-foreground">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          , enable Google (and Apple/Phone) in the Supabase dashboard, set the
          redirect URL to{" "}
          <code className="font-mono text-foreground">/auth/callback</code>,
          then redeploy. Buttons below call the real providers — they won&apos;t
          fake-succeed.
        </p>
      )}

      <button
        type="button"
        disabled={!!busy}
        onClick={() => void onGoogle()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface text-sm font-semibold disabled:opacity-60"
      >
        <GoogleGlyph />
        {busy === "google" ? "Redirecting…" : "Continue with Google"}
      </button>

      <button
        type="button"
        disabled={!!busy}
        onClick={() => void onApple()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface text-sm font-semibold disabled:opacity-60"
      >
        <AppleGlyph />
        {busy === "apple" ? "Redirecting…" : "Continue with Apple"}
      </button>

      <button
        type="button"
        disabled={!!busy}
        onClick={() => {
          setPhoneOpen((v) => !v);
          setError("");
        }}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface text-sm font-semibold disabled:opacity-60"
      >
        <PhoneGlyph />
        Continue with phone
      </button>

      {phoneOpen && (
        <div className="space-y-2 rounded-2xl border border-border bg-elevated/40 p-3 text-left">
          <p className="text-xs text-secondary">
            SMS OTP via Supabase Phone auth (Twilio or Supabase SMS). Replaces a
            dead WhatsApp button when Meta WhatsApp isn&apos;t configured.
          </p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+972…"
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-romance/40"
          />
          {otpSent && (
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-romance/40"
            />
          )}
          <Button
            type="button"
            className="w-full"
            disabled={!!busy}
            onClick={() => void (otpSent ? onVerifyOtp() : onSendOtp())}
          >
            {busy === "phone"
              ? "Working…"
              : otpSent
                ? "Verify code"
                : "Send code"}
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-romance/30 bg-romance-soft px-3 py-2 text-left text-xs text-romance-deep">
          <p className="font-semibold">{error}</p>
          {missing.length > 0 && (
            <ul className="mt-1 list-inside list-disc font-mono text-[10px]">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.8 14.6 3 12 3 7.6 3 4 6.6 4 11s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.2H12z"
      />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-foreground" aria-hidden>
      <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1-.1 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.2-3.2zM14.7 6.3c.6-.7 1-1.7.9-2.7-.8.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 1.9-.4 2.5-1.1z" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
    </svg>
  );
}
