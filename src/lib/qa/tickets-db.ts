/**
 * Sync QA tickets to Supabase `qa_tickets` when configured.
 * Falls back silently when env is missing (local-only Studio still works).
 */

import type { QaTicket } from "@/lib/qa/tickets";
import { getQaDeviceId } from "@/lib/qa/device-id";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function rowFromTicket(t: QaTicket, userId: string | null) {
  return {
    id: t.id,
    user_id: userId,
    device_id: getQaDeviceId(),
    status: t.status,
    note: t.note,
    route: t.route,
    href: t.href,
    click: t.click,
    target: t.target,
    created_at: t.createdAt,
    updated_at: t.updatedAt ?? t.createdAt,
  };
}

function ticketFromRow(row: Record<string, unknown>): QaTicket {
  const click = (row.click as QaTicket["click"]) || {
    x: 0,
    y: 0,
    xPct: 0,
    yPct: 0,
  };
  return {
    id: String(row.id),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    status: row.status === "fixed" ? "fixed" : "open",
    note: String(row.note ?? ""),
    route: String(row.route ?? "/"),
    href: String(row.href ?? "/"),
    click,
    target: row.target as QaTicket["target"],
  };
}

async function getClient() {
  if (!isSupabaseConfigured()) return null;
  const { tryCreateBrowserSupabase } = await import("@/lib/supabase/client");
  return tryCreateBrowserSupabase();
}

async function currentUserId(): Promise<string | null> {
  const sb = await getClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user?.id ?? null;
}

export async function pushTicketsToDb(tickets: QaTicket[]): Promise<{
  ok: boolean;
  error?: string;
  pushed: number;
}> {
  const sb = await getClient();
  if (!sb) return { ok: false, error: "Supabase not configured", pushed: 0 };
  const userId = await currentUserId();
  const rows = tickets.map((t) => rowFromTicket(t, userId));
  if (rows.length === 0) return { ok: true, pushed: 0 };
  const { error } = await sb.from("qa_tickets").upsert(rows, { onConflict: "id" });
  if (error) return { ok: false, error: error.message, pushed: 0 };
  return { ok: true, pushed: rows.length };
}

export async function pullTicketsFromDb(): Promise<{
  ok: boolean;
  tickets: QaTicket[];
  error?: string;
}> {
  const sb = await getClient();
  if (!sb) return { ok: false, tickets: [], error: "Supabase not configured" };
  const userId = await currentUserId();
  const deviceId = getQaDeviceId();
  let query = sb.from("qa_tickets").select("*").order("created_at", {
    ascending: false,
  });
  if (userId) {
    query = query.or(`user_id.eq.${userId},device_id.eq.${deviceId}`);
  } else {
    query = query.eq("device_id", deviceId);
  }
  const { data, error } = await query.limit(80);
  if (error) return { ok: false, tickets: [], error: error.message };
  return {
    ok: true,
    tickets: (data ?? []).map((r) => ticketFromRow(r as Record<string, unknown>)),
  };
}

export async function upsertTicketToDb(ticket: QaTicket): Promise<boolean> {
  const res = await pushTicketsToDb([ticket]);
  return res.ok;
}

export async function deleteTicketFromDb(id: string): Promise<boolean> {
  const sb = await getClient();
  if (!sb) return false;
  const { error } = await sb.from("qa_tickets").delete().eq("id", id);
  return !error;
}
