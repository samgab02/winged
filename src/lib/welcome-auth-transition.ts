/**
 * Welcome → Sign in / Create account escort transition.
 * Module store so the flying wing portal survives the route change.
 */

export const WELCOME_AUTH_MS = 900;
export const WELCOME_AUTH_EASE = [0.22, 1, 0.36, 1] as const;
export const WELCOME_AUTH_FLAG = "winged-welcome-auth-v1";

type Listener = () => void;

type State = {
  active: boolean;
  href: string | null;
  /** true while ambient welcome wings should fade */
  fadeAmbient: boolean;
};

let state: State = {
  active: false,
  href: null,
  fadeAmbient: false,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function getWelcomeAuthTransition(): State {
  return state;
}

export function subscribeWelcomeAuthTransition(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startWelcomeAuthTransition(href: string) {
  state = { active: true, href, fadeAmbient: true };
  try {
    sessionStorage.setItem(
      WELCOME_AUTH_FLAG,
      JSON.stringify({ href, t: Date.now() })
    );
  } catch {
    /* ignore */
  }
  emit();
}

export function finishWelcomeAuthTransition() {
  state = { active: false, href: null, fadeAmbient: false };
  try {
    sessionStorage.removeItem(WELCOME_AUTH_FLAG);
  } catch {
    /* ignore */
  }
  emit();
}

export function consumeWelcomeAuthEnter(): boolean {
  try {
    const raw = sessionStorage.getItem(WELCOME_AUTH_FLAG);
    if (!raw) return false;
    const data = JSON.parse(raw) as { t?: number };
    // Only honor if started recently (same transition)
    if (data.t && Date.now() - data.t > WELCOME_AUTH_MS + 400) {
      sessionStorage.removeItem(WELCOME_AUTH_FLAG);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
