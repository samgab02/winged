"use client";

import { useEffect, useRef, useState } from "react";
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
  loadTickets,
  type QaTicket,
} from "@/lib/qa/tickets";

const ROUTES = [
  { label: "Welcome", href: "/welcome" },
  { label: "Sign in", href: "/auth/signin" },
  { label: "Role pick", href: "/auth/role" },
  { label: "Bachelor Discover", href: "/bachelor/discover" },
  { label: "Matches", href: "/bachelor/matches" },
  { label: "Deal Room", href: "/bachelor/deal-room/match_maya_eli" },
  { label: "Wing Swipe", href: "/wing/swipe" },
  { label: "Wing Deal Room", href: "/wing/deal-room" },
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
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
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
  }, [bootstrapDevLogins]);

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
    // Primary: enter pick mode
    startPick();
  }

  function onFabPointerDown() {
    longPressed.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressed.current = true;
      setPicking(false);
      setHoverRect(null);
      setOpen(true);
      setTickets(loadTickets());
      showToast("QA Studio tools");
    }, 500);
  }

  function onFabPointerUp() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
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
    });
    setTickets(loadTickets());
    setDraft(null);
    setOpen(true);
    showToast(`Ticket saved · ${ticket.target.sourceLabel}`);
  }

  return (
    <>
      {/* Circular text-only FAB */}
      <motion.button
        type="button"
        data-qa-chrome
        aria-label={picking ? "Cancel pick mode" : "QA pick mode"}
        title="Tap to pick · hold for tools"
        onClick={toggleFab}
        onPointerDown={onFabPointerDown}
        onPointerUp={onFabPointerUp}
        onPointerLeave={onFabPointerUp}
        onPointerCancel={onFabPointerUp}
        className={cn(
          "fixed bottom-[5.75rem] left-3 z-[100] flex size-12 items-center justify-center rounded-full text-xs font-extrabold tracking-wide text-white shadow-card safe-bottom md:bottom-6",
          picking ? "bg-romance ring-2 ring-romance/40" : "bg-wing"
        )}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        QA
      </motion.button>

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

                {tickets.length > 0 && (
                  <section>
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                        Tickets ({tickets.length})
                      </p>
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
                    </div>
                    <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                      {tickets.map((t) => (
                        <li
                          key={t.id}
                          className="rounded-xl border border-border bg-elevated/50 px-3 py-2 text-left"
                        >
                          <p className="text-xs font-semibold">{t.note}</p>
                          <p className="mt-0.5 font-mono text-[10px] text-secondary">
                            {t.target.sourceLabel}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-subtle">
                            {t.target.selector}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

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
