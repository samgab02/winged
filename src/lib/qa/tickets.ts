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
    return true;
  } catch {
    return false;
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

/** Keep window mirror warm for agent dumps */
export function syncQaTicketsMirror() {
  if (typeof window === "undefined") return;
  (
    window as Window & { __WINGED_QA_TICKETS__?: QaTicket[] }
  ).__WINGED_QA_TICKETS__ = loadTickets();
}
