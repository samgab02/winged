import type { InspectTarget } from "@/lib/qa/inspect";

const STORAGE_KEY = "winged-qa-tickets-v1";

export type QaTicket = {
  id: string;
  createdAt: string;
  note: string;
  route: string;
  href: string;
  click: { x: number; y: number; xPct: number; yPct: number };
  target: InspectTarget;
};

export function loadTickets(): QaTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QaTicket[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTickets(tickets: QaTicket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets.slice(0, 50)));
}

export function addTicket(
  ticket: Omit<QaTicket, "id" | "createdAt">
): QaTicket {
  const next: QaTicket = {
    ...ticket,
    id: `qa_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  const all = [next, ...loadTickets()];
  saveTickets(all);
  return next;
}

export function clearTickets() {
  localStorage.removeItem(STORAGE_KEY);
}
