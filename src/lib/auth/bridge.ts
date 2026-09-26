/**
 * Bridge Supabase Auth users into the local Winged account/profile store.
 */

import { setSessionAccountId, type AccountRecord } from "@/lib/auth";

const ACCOUNTS_KEY = "winged-accounts-v1";

function readAccounts(): AccountRecord[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AccountRecord[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export type OAuthIdentity = {
  id: string;
  email: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  provider?: string;
};

/** Upsert a local account keyed by Supabase user id and set the session. */
export function bridgeSupabaseUser(user: OAuthIdentity): AccountRecord {
  const accounts = readAccounts();
  const email = (user.email || `${user.id}@oauth.winged.local`).toLowerCase();
  let account = accounts.find((a) => a.id === `sb_${user.id}` || a.email === email);

  if (!account) {
    account = {
      id: `sb_${user.id}`,
      email,
      passwordDigest: `oauth:${user.provider || "supabase"}`,
      createdAt: new Date().toISOString(),
    };
    writeAccounts([...accounts, account]);
  }

  setSessionAccountId(account.id);
  return account;
}
