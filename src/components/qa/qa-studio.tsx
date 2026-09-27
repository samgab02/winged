"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crosshair, X } from "lucide-react";
import { signIn } from "@/lib/auth";
import { DEV_LOGINS, DEV_PASSWORD } from "@/lib/dev-logins";
import { APPEARANCE_OPTIONS, type AppearancePref } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  inspectElement,
  isQaChrome,
  targetFromPoint,
  viewportPercents,
  type InspectTarget,
} from "@/lib/qa/inspect";
import {
  addTicket,
  clearTickets,
  copyTicketsJson,
  exportTicketsDownload,
  importTicketsFromJson,
  loadTickets,
  removeTicket,
  setTicketStatus,
  syncQaTicketsMirror,
  type QaTicket,
  type QaTicketStatus,
} from "@/lib/qa/tickets";

const QA_POS_KEY = "winged-qa-fab-pos";
const FAB_SIZE = 48;
const DRAG_THRESHOLD = 8;

type FabPos = { x: number; y: number };

function loadFabPos(): FabPos | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QA_POS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as FabPos;
    if (typeof p.x !== "number" || typeof p.y !== "number") return null;
    return p;
  } catch {
    return null;
  }
}

function clampFab(x: number, y: number): FabPos {
  const pad = 8;
  const maxX = Math.max(pad, window.innerWidth - FAB_SIZE - pad);
  const maxY = Math.max(pad, window.innerHeight - FAB_SIZE - pad);
  return {
    x: Math.min(maxX, Math.max(pad, x)),
    y: Math.min(maxY, Math.max(pad, y)),
  };
}

function defaultFabPos(): FabPos {
  if (typeof window === "undefined") return { x: 12, y: 400 };
  return clampFab(12, window.innerHeight - FAB_SIZE - 92);
}

const ROUTES = [
  { label: "Welcome", href: "/welcome" },
  { label: "Sign in", href: "/auth/signin" },
  { label: "Role pick", href: "/auth/role" },
  { label: "Bachelor Discover", href: "/bachelor/discover" },
  { label: "Matches", href: "/bachelor/matches" },
  { label: "Deal Room", href: "/bachelor/deal-room/match_maya_eli" },
  { label: "Wing Swipe", href: "/wing/swipe" },
  { label: "Wings hub", href: "/wing/hub" },
  { label: "Wings network", href: "/wing/network" },
  { label: "Pro profile", href: "/wing/pro/nw_noa" },
  { label: "Earn & escrow", href: "/wing/me/earnings" },
  { label: "Wing Deal Room", href: "/wing/deal-room" },
  { label: "My Wing", href: "/bachelor/my-wing" },
  { label: "Find Pro Wing", href: "/bachelor/find-wing" },
  { label: "Profile", href: "/bachelor/profile" },
];

type Draft = {
  target: InspectTarget;
  x: number;
  y: number;
  xPct: number;
  yPct: number;
};

export function QaStudio() {
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [note, setNote] = useState("");
  const [ticketNote, setTicketNote] = useState("");
  const [tickets, setTickets] = useState<QaTicket[]>([]);
  const [busy, setBusy] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<"open" | "fixed" | "all">(
    "open"
  );
  const [fabPos, setFabPos] = useState<FabPos>(() => loadFabPos() ?? defaultFabPos());
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    pointerId: number | null;
  }>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    pointerId: null,
  });
  const reduced = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const bootstrapDevLogins = useApp((s) => s.bootstrapDevLogins);
  const setAccount = useApp((s) => s.setAccount);
  const upsertProfile = useApp((s) => s.upsertProfile);
  const resetLocalData = useApp((s) => s.resetLocalData);
  const switchShell = useApp((s) => s.switchShell);
  const profile = useApp((s) => s.profile);
  const showToast = useApp((s) => s.showToast);

  useEffect(() => {
    void bootstrapDevLogins();
    setTickets(loadTickets());
    syncQaTicketsMirror();
    const saved = loadFabPos();
    setFabPos(saved ? clampFab(saved.x, saved.y) : defaultFabPos());
  }, [bootstrapDevLogins]);

  useEffect(() => {
    function refresh() {
      setTickets(loadTickets());
      syncQaTicketsMirror();
    }
    function onResize() {
      setFabPos((p) => clampFab(p.x, p.y));
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("storage", refresh);
    window.addEventListener("winged-qa-tickets-changed", refresh);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("winged-qa-tickets-changed", refresh);
    };
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === "all") return true;
    return t.status === ticketFilter;
  });
  const openCount = tickets.filter((t) => t.status === "open").length;
  const fixedCount = tickets.filter((t) => t.status === "fixed").length;

  useEffect(() => {
    if (!picking) {
      setHoverRect(null);
      return;
    }

    function onMove(e: PointerEvent) {
      const el = targetFromPoint(e.clientX, e.clientY);
      if (!el) {
        setHoverRect(null);
        return;
      }
      setHoverRect(el.getBoundingClientRect());
    }

    function onClick(e: PointerEvent) {
      if (isQaChrome(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
      const el = targetFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const target = inspectElement(el);
      const { xPct, yPct } = viewportPercents(e.clientX, e.clientY);
      setDraft({
        target,
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        xPct,
        yPct,
      });
      setTicketNote("");
      setPicking(false);
      setHoverRect(null);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setPicking(false);
        setHoverRect(null);
        showToast("Pick mode cancelled");
      }
    }

    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    document.body.style.cursor = "crosshair";

    return () => {
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.cursor = "";
    };
  }, [picking, showToast]);

  function startPick() {
    setOpen(false);
    setDraft(null);
    setPicking(true);
    showToast("Pick mode — tap anything · Esc to cancel");
  }

  function toggleFab() {
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    if (picking) {
      setPicking(false);
      setHoverRect(null);
      showToast("Pick mode cancelled");
      return;
    }
    if (draft) {
      setDraft(null);
      return;
    }
    if (open) {
      setOpen(false);
      return;
    }
    startPick();
  }

  function onFabPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    longPressed.current = false;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: fabPos.x,
      origY: fabPos.y,
      pointerId: e.pointerId,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    longPressTimer.current = setTimeout(() => {
      if (dragRef.current.moved) return;
      longPressed.current = true;
      setPicking(false);
      setHoverRect(null);
      setOpen(true);
      setTickets(loadTickets());
      showToast("QA Studio tools");
    }, 500);
  }

  function onFabPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragRef.current.moved = true;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
    const next = clampFab(dragRef.current.origX + dx, dragRef.current.origY + dy);
    setFabPos(next);
  }

  function onFabPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (dragRef.current.active && dragRef.current.moved) {
      setFabPos((p) => {
        const clamped = clampFab(p.x, p.y);
        try {
          localStorage.setItem(QA_POS_KEY, JSON.stringify(clamped));
        } catch {
          /* ignore */
        }
        return clamped;
      });
    }
    dragRef.current.active = false;
    if (dragRef.current.pointerId != null) {
      try {
        e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
      } catch {
        /* ignore */
      }
    }
  }

  async function quickLogin(email: string) {
    setBusy(true);
    setNote("");
    await bootstrapDevLogins();
    const result = await signIn(email, DEV_PASSWORD);
    if (!result.ok) {
      setNote(result.error);
      setBusy(false);
      return;
    }
    setAccount(result.account.id);
    await bootstrapDevLogins();
    const p = useApp.getState().profilesByAccount[result.account.id];
    const dest =
      p?.role === "wing" ? "/wing/swipe" : "/bachelor/discover";
    router.replace(dest);
    showToast(`Signed in as ${email}`);
    setBusy(false);
    setOpen(false);
  }

  function setAppearance(appearance: AppearancePref) {
    if (!profile) {
      setNote("Sign in first to set appearance.");
      return;
    }
    upsertProfile({ accountId: profile.accountId, appearance });
    showToast(`Appearance → ${appearance}`);
  }

  function confirmTicket() {
    if (!draft) return;
    try {
      const ticket = addTicket({
        note: ticketNote.trim() || "UI issue",
        route: pathname,
        href: typeof window !== "undefined" ? window.location.href : pathname,
        click: {
          x: draft.x,
          y: draft.y,
          xPct: draft.xPct,
          yPct: draft.yPct,
        },
        target: draft.target,
        status: "open",
      });
      const persisted = loadTickets();
      setTickets(persisted);
      const ok = persisted.some((t) => t.id === ticket.id);
      setDraft(null);
      setOpen(true);
      setTicketFilter("open");
      showToast(
        ok
          ? `Ticket saved · ${ticket.target.sourceLabel}`
          : "Ticket save may have failed — check storage"
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not save ticket");
    }
  }

  function markTicket(id: string, status: QaTicketStatus) {
    setTicketStatus(id, status);
    setTickets(loadTickets());
    showToast(status === "fixed" ? "Marked fixed" : "Reopened");
  }

  async function onExport() {
    await exportTicketsDownload(tickets);
    showToast(
      tickets.length
        ? "Tickets exported as JSON"
        : "Exported empty ticket list — share after filing bugs"
    );
  }

  async function onCopyExport() {
    const result = await copyTicketsJson(tickets);
    showToast(result === "copied" ? "Tickets JSON copied" : "Copy failed");
  }

  function onImportFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const result = importTicketsFromJson(text);
      if (!result.ok) {
        showToast(result.error);
        return;
      }
      setTickets(loadTickets());
      showToast(
        `Imported ${result.count} ticket${result.count === 1 ? "" : "s"}`
      );
    };
    reader.onerror = () => showToast("Could not read file");
    reader.readAsText(file);
  }

  return (
    <>
      {/* Circular text-only FAB — centered label, draggable, tap = pick */}
      <motion.button
        type="button"
        data-qa-chrome
        aria-label={picking ? "Cancel pick mode" : "QA pick mode"}
        title="Drag to move · tap to pick · hold for tools"
        onClick={toggleFab}
        onPointerDown={onFabPointerDown}
        onPointerMove={onFabPointerMove}
        onPointerUp={onFabPointerUp}
        onPointerCancel={onFabPointerUp}
        style={{ left: fabPos.x, top: fabPos.y, width: FAB_SIZE, height: FAB_SIZE }}
        className={cn(
          "fixed z-[100] flex touch-none items-center justify-center rounded-full p-0 text-[11px] font-extrabold leading-none tracking-[0.06em] text-white shadow-soft select-none",
          picking ? "bg-romance ring-2 ring-romance/40" : "bg-wing",
          dragRef.current.moved ? "cursor-grabbing" : "cursor-grab"
        )}
        whileTap={reduced || dragRef.current.moved ? undefined : { scale: 0.94 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="pointer-events-none flex size-full items-center justify-center">
          QA
        </span>
      </motion.button>

      {openCount > 0 && !open && !picking && !draft && (
        <button
          type="button"
          data-qa-chrome
          onClick={() => {
            setTicketFilter("open");
            setOpen(true);
          }}
          className="fixed bottom-4 left-3 z-[99] flex items-center gap-1.5 rounded-full bg-romance px-3 py-1.5 text-[11px] font-bold text-white shadow-soft safe-bottom"
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
            !
          </span>
          {openCount} Issue{openCount === 1 ? "" : "s"}
        </button>
      )}

      {/* Pick highlight + banner */}
      <AnimatePresence>
        {picking && (
          <>
            <motion.div
              data-qa-chrome
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none fixed inset-0 z-[90] bg-foreground/10"
            />
            {hoverRect && (
              <div
                data-qa-chrome
                className="pointer-events-none fixed z-[92] rounded-md border-2 border-romance bg-romance/10 shadow-[0_0_0_9999px_rgba(42,36,33,0.12)]"
                style={{
                  top: hoverRect.top - 2,
                  left: hoverRect.left - 2,
                  width: hoverRect.width + 4,
                  height: hoverRect.height + 4,
                }}
              />
            )}
            <motion.div
              data-qa-chrome
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="pointer-events-none fixed inset-x-0 top-3 z-[96] flex justify-center px-4"
            >
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface/95 px-3 py-2 text-xs font-semibold shadow-card backdrop-blur">
                <Crosshair className="size-3.5 text-romance" />
                Tap any object · Esc cancels
                <button
                  type="button"
                  data-qa-chrome
                  className="pointer-events-auto ml-1 rounded-full bg-elevated px-2 py-0.5 text-[10px] font-bold"
                  onClick={() => {
                    setPicking(false);
                    setOpen(true);
                  }}
                >
                  Tools
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ticket composer */}
      <AnimatePresence>
        {draft && (
          <>
            <motion.button
              type="button"
              data-qa-chrome
              aria-label="Close ticket"
              className="fixed inset-0 z-[97] bg-foreground/35 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDraft(null)}
            />
            <motion.aside
              data-qa-chrome
              role="dialog"
              aria-label="QA ticket"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed inset-x-3 bottom-[5.5rem] z-[98] mx-auto max-h-[min(78dvh,640px)] max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-card safe-bottom md:bottom-6 md:left-3 md:right-auto md:w-[22rem]"
            >
              <header className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="font-display text-base font-extrabold tracking-tight">
                    New QA ticket
                  </p>
                  <p className="text-[11px] text-subtle">{pathname}</p>
                </div>
                <button
                  type="button"
                  data-qa-chrome
                  onClick={() => setDraft(null)}
                  className="flex size-9 items-center justify-center rounded-full bg-elevated"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </header>

              <div className="space-y-3 overflow-y-auto px-4 py-3 pb-5 text-left text-xs">
                <div
                  className="rounded-xl border border-romance/30 bg-romance-soft px-3 py-2"
                  style={{
                    outline: "2px solid transparent",
                  }}
                >
                  <p className="font-semibold text-romance">
                    {draft.target.tag}
                    {draft.target.componentName
                      ? ` · ${draft.target.componentName}`
                      : ""}
                  </p>
                  <p className="mt-0.5 break-all font-mono text-[10px] text-secondary">
                    {draft.target.sourceLabel}
                  </p>
                </div>

                <dl className="space-y-1.5 font-mono text-[10px] leading-relaxed text-secondary">
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                      Click
                    </dt>
                    <dd>
                      {draft.x},{draft.y}px · {draft.xPct}%,{draft.yPct}%
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                      Selector
                    </dt>
                    <dd className="break-all">{draft.target.selector}</dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                      Path
                    </dt>
                    <dd className="break-all">{draft.target.cssPath}</dd>
                  </div>
                  {draft.target.text && (
                    <div>
                      <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                        Text
                      </dt>
                      <dd className="font-sans">“{draft.target.text}”</dd>
                    </div>
                  )}
                  {Object.keys(draft.target.dataAttrs).length > 0 && (
                    <div>
                      <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                        data-*
                      </dt>
                      <dd className="break-all">
                        {Object.entries(draft.target.dataAttrs)
                          .map(([k, v]) => `${k}="${v}"`)
                          .join(" · ")}
                      </dd>
                    </div>
                  )}
                  {draft.target.componentStack.length > 0 && (
                    <div>
                      <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                        Component stack
                      </dt>
                      <dd className="break-all">
                        {draft.target.componentStack.slice(0, 6).join(" ← ")}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-subtle">
                      BBox
                    </dt>
                    <dd>
                      {draft.target.rect.width}×{draft.target.rect.height} @{" "}
                      {draft.target.rect.x},{draft.target.rect.y}
                    </dd>
                  </div>
                </dl>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-subtle">
                    Note
                  </span>
                  <textarea
                    data-qa-chrome
                    value={ticketNote}
                    onChange={(e) => setTicketNote(e.target.value)}
                    rows={2}
                    placeholder="What’s wrong?"
                    className="w-full rounded-xl border border-border bg-elevated/50 px-3 py-2 text-sm outline-none focus:border-romance/40"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    data-qa-chrome
                    onClick={() => {
                      setDraft(null);
                      startPick();
                    }}
                    className="h-10 flex-1 rounded-xl border border-border text-xs font-semibold"
                  >
                    Re-pick
                  </button>
                  <button
                    type="button"
                    data-qa-chrome
                    onClick={confirmTicket}
                    className="h-10 flex-1 rounded-xl bg-romance text-xs font-bold text-white"
                  >
                    Save ticket
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Tools panel */}
      <AnimatePresence>
        {open && !draft && (
          <>
            <motion.button
              type="button"
              data-qa-chrome
              aria-label="Close QA Studio"
              className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              data-qa-chrome
              role="dialog"
              aria-label="QA Studio"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed inset-x-3 bottom-[5.5rem] z-[95] mx-auto max-h-[min(78dvh,640px)] max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-card safe-bottom md:bottom-6 md:left-3 md:right-auto md:w-[22rem]"
            >
              <header className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="font-display text-base font-extrabold tracking-tight">
                    QA Studio
                  </p>
                  <p className="text-[11px] text-subtle">
                    Tap QA to pick · hold for tools · {pathname}
                  </p>
                </div>
                <button
                  type="button"
                  data-qa-chrome
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full bg-elevated"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </header>

              <div className="space-y-4 overflow-y-auto px-4 py-3 pb-5">
                <section>
                  <button
                    type="button"
                    data-qa-chrome
                    onClick={startPick}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-romance text-xs font-bold text-white"
                  >
                    <Crosshair className="size-3.5" />
                    Pick element for ticket
                  </button>
                </section>

                <section>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                      Tickets ({openCount} open · {fixedCount} fixed)
                    </p>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        data-qa-chrome
                        onClick={() => void onCopyExport()}
                        className="text-[10px] font-semibold text-wing-deep"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        data-qa-chrome
                        onClick={() => void onExport()}
                        className="text-[10px] font-bold text-wing-deep"
                      >
                        Export
                      </button>
                      <label className="cursor-pointer text-[10px] font-semibold text-wing-deep">
                        Import
                        <input
                          type="file"
                          accept="application/json,.json"
                          data-qa-chrome
                          className="sr-only"
                          onChange={(e) => {
                            onImportFile(e.target.files?.[0] ?? null);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {tickets.length > 0 && (
                        <button
                          type="button"
                          data-qa-chrome
                          onClick={() => {
                            clearTickets();
                            setTickets([]);
                          }}
                          className="text-[10px] font-semibold text-romance"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mb-2 flex gap-1">
                    {(
                      [
                        ["open", `Open (${openCount})`],
                        ["fixed", `Fixed (${fixedCount})`],
                        ["all", "All"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        data-qa-chrome
                        onClick={() => setTicketFilter(id)}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                          ticketFilter === id
                            ? "border-romance/40 panel-wash text-romance-deep"
                            : "border-border text-secondary"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {filteredTickets.length === 0 ? (
                    <div className="space-y-2 rounded-xl border border-dashed border-border px-3 py-4 text-center">
                      <p className="text-[11px] text-secondary">
                        {tickets.length === 0
                          ? "No tickets in this browser. Pick an element to file one, or Import JSON from another device."
                          : `No ${ticketFilter} tickets.`}
                      </p>
                      {tickets.length === 0 && (
                        <button
                          type="button"
                          data-qa-chrome
                          onClick={() => void onExport()}
                          className="text-[11px] font-bold text-wing-deep underline-offset-2 hover:underline"
                        >
                          Export empty JSON template
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                      {filteredTickets.map((t) => (
                        <li
                          key={t.id}
                          className="rounded-xl border border-border bg-elevated/50 px-3 py-2 text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold">{t.note}</p>
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                                t.status === "fixed"
                                  ? "bg-success/15 text-success"
                                  : "panel-wash text-romance-deep"
                              )}
                            >
                              {t.status}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[10px] text-subtle">
                            {t.route}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-secondary">
                            {t.target?.sourceLabel ?? "—"}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-subtle">
                            {t.target?.selector ?? "—"}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {t.status === "open" ? (
                              <button
                                type="button"
                                data-qa-chrome
                                onClick={() => markTicket(t.id, "fixed")}
                                className="text-[10px] font-bold text-success"
                              >
                                Mark fixed
                              </button>
                            ) : (
                              <button
                                type="button"
                                data-qa-chrome
                                onClick={() => markTicket(t.id, "open")}
                                className="text-[10px] font-bold text-wing-deep"
                              >
                                Reopen
                              </button>
                            )}
                            <button
                              type="button"
                              data-qa-chrome
                              onClick={() => {
                                removeTicket(t.id);
                                setTickets(loadTickets());
                                showToast("Ticket removed");
                              }}
                              className="text-[10px] font-bold text-romance"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                    Seed logins
                  </p>
                  <p className="mb-2 text-[11px] text-secondary">
                    Password: {DEV_PASSWORD}
                  </p>
                  <div className="space-y-1.5">
                    {DEV_LOGINS.map((login) => (
                      <button
                        key={login.id}
                        type="button"
                        data-qa-chrome
                        disabled={busy}
                        onClick={() => void quickLogin(login.email)}
                        className="flex h-10 w-full items-center justify-between rounded-xl border border-border bg-elevated/60 px-3 text-left text-xs font-semibold disabled:opacity-50"
                      >
                        <span>{login.label}</span>
                        <span className="text-[10px] font-medium text-subtle">
                          {login.email}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                    Appearance
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {APPEARANCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        data-qa-chrome
                        onClick={() => setAppearance(opt.id)}
                        className={cn(
                          "rounded-xl border px-2.5 py-2 text-left text-xs font-semibold",
                          (profile?.appearance ?? "auto") === opt.id
                            ? "border-romance bg-romance-soft"
                            : "border-border bg-elevated/50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                    Jump
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ROUTES.map((r) => (
                      <button
                        key={r.href}
                        type="button"
                        data-qa-chrome
                        onClick={() => {
                          router.push(r.href);
                          setOpen(false);
                        }}
                        className="rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] font-semibold"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="flex flex-col gap-1.5">
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                    Session
                  </p>
                  <button
                    type="button"
                    data-qa-chrome
                    disabled={!profile}
                    onClick={() => {
                      switchShell();
                      router.replace("/");
                      setOpen(false);
                    }}
                    className="h-10 rounded-xl border border-border text-xs font-semibold disabled:opacity-40"
                  >
                    Switch Bachelor ↔ Wing
                  </button>
                  <button
                    type="button"
                    data-qa-chrome
                    onClick={() => {
                      resetLocalData();
                      void bootstrapDevLogins();
                      router.replace("/welcome");
                      showToast("Local data reset");
                      setOpen(false);
                    }}
                    className="h-10 rounded-xl border border-border text-xs font-semibold text-romance"
                  >
                    Reset local data
                  </button>
                </section>

                {note && (
                  <p className="text-xs font-medium text-romance">{note}</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
