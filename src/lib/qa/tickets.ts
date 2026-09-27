import type { InspectTarget } from "@/lib/qa/inspect";

export const QA_TICKETS_STORAGE_KEY = "winged-qa-tickets-v1";

export type QaTicketStatus = "open" | "fixed";

export type QaTicket = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: QaTicketStatus;
  note: string;
  route: string;
  href: string;
  click: { x: number; y: number; xPct: number; yPct: number };
  target: InspectTarget;
};

function normalize(raw: unknown): QaTicket[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    const ticket = t as Partial<QaTicket>;
    return {
      id: String(ticket.id ?? `qa_${Date.now().toString(36)}`),
      createdAt: String(ticket.createdAt ?? new Date().toISOString()),
      updatedAt: ticket.updatedAt,
      status: ticket.status === "fixed" ? "fixed" : "open",
      note: String(ticket.note ?? "UI issue"),
      route: String(ticket.route ?? "/"),
      href: String(ticket.href ?? ticket.route ?? "/"),
      click: {
        x: Number(ticket.click?.x ?? 0),
        y: Number(ticket.click?.y ?? 0),
        xPct: Number(ticket.click?.xPct ?? 0),
        yPct: Number(ticket.click?.yPct ?? 0),
      },
      target: ticket.target as InspectTarget,
    };
  });
}

export function loadTickets(): QaTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QA_TICKETS_STORAGE_KEY);
    if (!raw) return [];
    return normalize(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveTickets(tickets: QaTicket[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(
      QA_TICKETS_STORAGE_KEY,
      JSON.stringify(tickets.slice(0, 80))
    );
    // Expose for Playwright / agent dumps without pick-mode friction
    (
      window as Window & { __WINGED_QA_TICKETS__?: QaTicket[] }
    ).__WINGED_QA_TICKETS__ = loadTickets();
    window.dispatchEvent(new CustomEvent("winged-qa-tickets-changed"));
    // Fire-and-forget Supabase sync when configured
    void import("@/lib/qa/tickets-db").then(({ pushTicketsToDb }) => {
      void pushTicketsToDb(tickets.slice(0, 80));
    });
    return true;
  } catch {
    return false;
  }
}

/** Merge remote DB tickets into localStorage (remote wins on newer updatedAt). */
export async function syncTicketsFromDb(): Promise<{
  ok: boolean;
  merged: number;
  error?: string;
}> {
  try {
    const { pullTicketsFromDb } = await import("@/lib/qa/tickets-db");
    const remote = await pullTicketsFromDb();
    if (!remote.ok) return { ok: false, merged: 0, error: remote.error };
    const local = loadTickets();
    const byId = new Map(local.map((t) => [t.id, t]));
    let merged = 0;
    for (const t of remote.tickets) {
      const prev = byId.get(t.id);
      const prevT = prev?.updatedAt || prev?.createdAt || "";
      const nextT = t.updatedAt || t.createdAt || "";
      if (!prev || nextT >= prevT) {
        if (!prev || JSON.stringify(prev) !== JSON.stringify(t)) merged += 1;
        byId.set(t.id, t);
      }
    }
    const next = [...byId.values()].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    // Persist without re-pushing immediately (avoid loop) — set localStorage directly
    localStorage.setItem(QA_TICKETS_STORAGE_KEY, JSON.stringify(next.slice(0, 80)));
    (
      window as Window & { __WINGED_QA_TICKETS__?: QaTicket[] }
    ).__WINGED_QA_TICKETS__ = next;
    window.dispatchEvent(new CustomEvent("winged-qa-tickets-changed"));
    return { ok: true, merged };
  } catch (e) {
    return {
      ok: false,
      merged: 0,
      error: e instanceof Error ? e.message : "sync failed",
    };
  }
}

export function addTicket(
  ticket: Omit<QaTicket, "id" | "createdAt" | "status" | "updatedAt"> & {
    status?: QaTicketStatus;
  }
): QaTicket {
  const next: QaTicket = {
    ...ticket,
    id: `qa_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: ticket.status ?? "open",
  };
  const all = [next, ...loadTickets()];
  if (!saveTickets(all)) {
    throw new Error("Could not persist QA ticket (storage full or blocked)");
  }
  return next;
}

export function updateTicket(
  id: string,
  patch: Partial<Pick<QaTicket, "note" | "status">>
): QaTicket | null {
  const all = loadTickets();
  const idx = all.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  const updated: QaTicket = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  saveTickets(all);
  return updated;
}

export function setTicketStatus(
  id: string,
  status: QaTicketStatus
): QaTicket | null {
  return updateTicket(id, { status });
}

export function removeTicket(id: string): boolean {
  const next = loadTickets().filter((t) => t.id !== id);
  if (next.length === loadTickets().length) return false;
  void import("@/lib/qa/tickets-db").then(({ deleteTicketFromDb }) => {
    void deleteTicketFromDb(id);
  });
  return saveTickets(next);
}

export function clearTickets() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QA_TICKETS_STORAGE_KEY);
  (
    window as Window & { __WINGED_QA_TICKETS__?: QaTicket[] }
  ).__WINGED_QA_TICKETS__ = [];
  window.dispatchEvent(new CustomEvent("winged-qa-tickets-changed"));
}

export function ticketsToExportJson(tickets: QaTicket[] = loadTickets()): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      key: QA_TICKETS_STORAGE_KEY,
      count: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      fixed: tickets.filter((t) => t.status === "fixed").length,
      tickets,
    },
    null,
    2
  );
}

export async function exportTicketsDownload(
  tickets: QaTicket[] = loadTickets()
): Promise<void> {
  const json = ticketsToExportJson(tickets);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `winged-qa-tickets-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyTicketsJson(
  tickets: QaTicket[] = loadTickets()
): Promise<"copied" | "failed"> {
  try {
    await navigator.clipboard.writeText(ticketsToExportJson(tickets));
    return "copied";
  } catch {
    return "failed";
  }
}

export type ImportTicketsResult =
  | { ok: true; count: number; merged: number }
  | { ok: false; error: string };

/** Merge tickets from Export JSON (or a bare array). Newer ids win on conflict. */
export function importTicketsFromJson(raw: string): ImportTicketsResult {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed)
      ? parsed
      : parsed &&
          typeof parsed === "object" &&
          Array.isArray((parsed as { tickets?: unknown }).tickets)
        ? (parsed as { tickets: unknown[] }).tickets
        : null;
    if (!list) {
      return { ok: false, error: "JSON must be an array or { tickets: [] }" };
    }
    const incoming = normalize(list);
    const byId = new Map(loadTickets().map((t) => [t.id, t]));
    let merged = 0;
    for (const t of incoming) {
      if (byId.has(t.id)) merged += 1;
      byId.set(t.id, t);
    }
    const next = [...byId.values()].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!saveTickets(next)) {
      return { ok: false, error: "Could not persist imported tickets" };
    }
    return { ok: true, count: incoming.length, merged };
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}

/** Keep window mirror warm for agent dumps */
export function syncQaTicketsMirror() {
  if (typeof window === "undefined") return;
  (
    window as Window & { __WINGED_QA_TICKETS__?: QaTicket[] }
  ).__WINGED_QA_TICKETS__ = loadTickets();
}
