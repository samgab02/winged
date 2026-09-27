/**
 * Known user-reported product issues when the agent browser dump is empty.
 * Seeded as fixed once the corresponding motion/auth fixes ship.
 */

import type { InspectTarget } from "@/lib/qa/inspect";
import {
  loadTickets,
  saveTickets,
  type QaTicket,
} from "@/lib/qa/tickets";

const stubTarget = (label: string, selector: string): InspectTarget => ({
  tag: "div",
  id: null,
  classes: [],
  dataAttrs: {},
  text: label,
  ariaLabel: null,
  role: null,
  selector,
  cssPath: selector,
  rect: { x: 0, y: 0, width: 0, height: 0 },
  componentName: label,
  componentStack: [label],
  source: null,
  sourceLabel: label,
});

export const SAMPLE_PRODUCT_TICKETS: QaTicket[] = [
  {
    id: "qa_welcome_auth_slide",
    createdAt: "2026-09-27T04:40:00.000Z",
    updatedAt: new Date().toISOString(),
    status: "fixed",
    note: "Welcome→auth not fluid; background doesn’t slide continuously",
    route: "/welcome",
    href: "/welcome",
    click: { x: 195, y: 620, xPct: 50, yPct: 73 },
    target: stubTarget(
      "WelcomePage Create account",
      "button:has-text('Create account')"
    ),
  },
  {
    id: "qa_route_wings_lr",
    createdAt: "2026-09-27T04:41:00.000Z",
    updatedAt: new Date().toISOString(),
    status: "fixed",
    note: "Page-change wings too fast; left/right swapped; fade not slow",
    route: "/bachelor/discover",
    href: "/bachelor/discover",
    click: { x: 40, y: 400, xPct: 10, yPct: 47 },
    target: stubTarget("RouteTransition wings", "[data-route-wing]"),
  },
  {
    id: "qa_blank_nav",
    createdAt: "2026-09-27T04:42:00.000Z",
    updatedAt: new Date().toISOString(),
    status: "fixed",
    note: "Blank pages / stuck blur during navigation",
    route: "/bachelor/matches",
    href: "/bachelor/matches",
    click: { x: 200, y: 100, xPct: 51, yPct: 12 },
    target: stubTarget("RouteTransition content", "main"),
  },
];

/** Seed sample product tickets only when local dump is empty. */
export function seedSampleTicketsIfEmpty(): QaTicket[] {
  if (typeof window === "undefined") return [];
  const existing = loadTickets();
  if (existing.length > 0) return existing;
  saveTickets(SAMPLE_PRODUCT_TICKETS);
  return SAMPLE_PRODUCT_TICKETS;
}
