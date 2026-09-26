/**
 * Auth — local email/password always works; when Supabase env is set,
 * email/password also syncs to Supabase Auth.
 */

import { isSupabaseConfigured } from "@/lib/supabase/config";

const ACCOUNTS_KEY = "winged-accounts-v1";
const SESSION_KEY = "winged-auth-session-v1";

export type AccountRecord = {
  id: string;
  email: string;
  /** Local-only digest; OAuth accounts use oauth:provider */
  passwordDigest: string;
  createdAt: string;
};

function readAccounts(): AccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AccountRecord[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function digestPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}:winged`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getSessionAccountId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionAccountId(id: string | null) {
  if (id) localStorage.setItem(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

async function supabaseEmailSignUp(email: string, password: string) {
  if (!isSupabaseConfigured()) return null;
  const { tryCreateBrowserSupabase } = await import("@/lib/supabase/client");
  const supabase = tryCreateBrowserSupabase();
  if (!supabase) return null;
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  });
}

async function supabaseEmailSignIn(email: string, password: string) {
  if (!isSupabaseConfigured()) return null;
  const { tryCreateBrowserSupabase } = await import("@/lib/supabase/client");
  const supabase = tryCreateBrowserSupabase();
  if (!supabase) return null;
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(
  email: string,
  password: string
): Promise<{ ok: true; account: AccountRecord } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || password.length < 6) {
    return {
      ok: false,
      error: "Use a valid email and a password with 6+ characters.",
    };
  }

  // Prefer Supabase when configured
  const sb = await supabaseEmailSignUp(normalized, password);
  if (sb) {
    if (sb.error) {
      // Fall through to local if user already exists remotely but we still want local demo
      if (!sb.error.message.toLowerCase().includes("already")) {
        return { ok: false, error: sb.error.message };
      }
    }
    if (sb.data.user) {
      const { bridgeSupabaseUser } = await import("@/lib/auth/bridge");
      const account = bridgeSupabaseUser({
        id: sb.data.user.id,
        email: sb.data.user.email ?? normalized,
        provider: "email",
      });
      return { ok: true, account };
    }
  }

  const accounts = readAccounts();
  if (accounts.some((a) => a.email === normalized)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const id = `acc_${crypto.randomUUID()}`;
  const passwordDigest = await digestPassword(password, id);
  const account: AccountRecord = {
    id,
    email: normalized,
    passwordDigest,
    createdAt: new Date().toISOString(),
  };
  writeAccounts([...accounts, account]);
  setSessionAccountId(id);
  return { ok: true, account };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ ok: true; account: AccountRecord } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();

  const sb = await supabaseEmailSignIn(normalized, password);
  if (sb) {
    if (!sb.error && sb.data.user) {
      const { bridgeSupabaseUser } = await import("@/lib/auth/bridge");
      const account = bridgeSupabaseUser({
        id: sb.data.user.id,
        email: sb.data.user.email ?? normalized,
        provider: "email",
      });
      return { ok: true, account };
    }
    // If Supabase rejects but local account exists (dev logins), continue local
  }

  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === normalized);
  if (!account) {
    return {
      ok: false,
      error: sb?.error?.message || "No account found for that email.",
    };
  }
  if (account.passwordDigest.startsWith("oauth:")) {
    return {
      ok: false,
      error: "This account uses social login. Continue with Google/Apple/Phone.",
    };
  }
  const digest = await digestPassword(password, account.id);
  if (digest !== account.passwordDigest) {
    return { ok: false, error: "Incorrect password." };
  }
  setSessionAccountId(account.id);
  return { ok: true, account };
}

export function signOut() {
  setSessionAccountId(null);
  if (isSupabaseConfigured()) {
    void import("@/lib/supabase/client").then(({ tryCreateBrowserSupabase }) => {
      tryCreateBrowserSupabase()?.auth.signOut();
    });
  }
}

export function deleteAccount(accountId: string) {
  writeAccounts(readAccounts().filter((a) => a.id !== accountId));
  if (getSessionAccountId() === accountId) setSessionAccountId(null);
}

export function getAccount(accountId: string): AccountRecord | null {
  return readAccounts().find((a) => a.id === accountId) ?? null;
}
