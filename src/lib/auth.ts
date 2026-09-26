/**
 * Local account auth — swap for Supabase Auth when credentials exist.
 * Email + password persisted in localStorage; no external secrets required.
 */

const ACCOUNTS_KEY = "winged-accounts-v1";
const SESSION_KEY = "winged-auth-session-v1";

export type AccountRecord = {
  id: string;
  email: string;
  /** Local-only digest; replace with Supabase Auth */
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

export async function signUp(
  email: string,
  password: string
): Promise<{ ok: true; account: AccountRecord } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || password.length < 6) {
    return { ok: false, error: "Use a valid email and a password with 6+ characters." };
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
  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === normalized);
  if (!account) return { ok: false, error: "No account found for that email." };
  const digest = await digestPassword(password, account.id);
  if (digest !== account.passwordDigest) {
    return { ok: false, error: "Incorrect password." };
  }
  setSessionAccountId(account.id);
  return { ok: true, account };
}

export function signOut() {
  setSessionAccountId(null);
}

export function deleteAccount(accountId: string) {
  writeAccounts(readAccounts().filter((a) => a.id !== accountId));
  if (getSessionAccountId() === accountId) setSessionAccountId(null);
}

export function getAccount(accountId: string): AccountRecord | null {
  return readAccounts().find((a) => a.id === accountId) ?? null;
}
