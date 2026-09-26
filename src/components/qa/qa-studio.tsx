"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FlaskConical, X } from "lucide-react";
import { signIn } from "@/lib/auth";
import { DEV_LOGINS, DEV_PASSWORD } from "@/lib/dev-logins";
import { APPEARANCE_OPTIONS, type AppearancePref } from "@/lib/theme";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

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

export function QaStudio() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
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
  }, [bootstrapDevLogins]);

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

  // Sit above mobile tab bars (~5.5rem)
  return (
    <>
      <motion.button
        type="button"
        aria-label="Open QA Studio"
        onClick={() => setOpen(true)}
        className="fixed bottom-[5.75rem] left-3 z-[80] flex h-11 items-center gap-1.5 rounded-full bg-wing px-3.5 text-xs font-bold tracking-wide text-white shadow-card safe-bottom md:bottom-6"
        whileTap={reduced ? undefined : { scale: 0.96 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FlaskConical className="size-3.5" strokeWidth={2.25} />
        QA
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close QA Studio"
              className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
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
                    Local tools · {pathname}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full bg-elevated"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </header>

              <div className="space-y-4 overflow-y-auto px-4 py-3 pb-5">
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
