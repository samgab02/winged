/**
 * Welcome → Sign in / Create account escort transition.
 * Sequenced: fade ambient → bird-fly left wing (grows) → page slide.
 */

/** Total choreography (~1.7s) */
export const WELCOME_AUTH_MS = 1700;
/** Phase 1: other wings fade */
export const WELCOME_AUTH_FADE_MS = 520;
/** Phase 2: escort wing begins bird flight (after fade) */
export const WELCOME_AUTH_FLY_AT_MS = 500;
/** Phase 3: navigate / page slide begins (wing already flying) */
export const WELCOME_AUTH_NAV_AT_MS = 920;
/** Auth page slide duration (overlaps remaining flight) */
export const WELCOME_AUTH_SLIDE_MS = 780;
/** Escort flight duration once it starts */
export const WELCOME_AUTH_FLY_MS = 1200;

export const WELCOME_AUTH_EASE = [0.22, 1, 0.36, 1] as const;
export const WELCOME_AUTH_FLAG = "winged-welcome-auth-v1";

export type WelcomeAuthPhase = "idle" | "fade" | "fly";

type Listener = () => void;

export type WelcomeAuthState = {
  active: boolean;
  href: string | null;
  phase: WelcomeAuthPhase;
  /** Fade non-escort ambient wings */
  fadeAmbient: boolean;
  /** Hide welcome escort flyer — portal owns it */
  hideEscort: boolean;
  /** Welcome chrome starts sliding away */
  slideAway: boolean;
  /** Portal escort wing visible (survives route remounts) */
  escortOn: boolean;
  /** Choreography timers already armed for this run */
  choreographyArmed: boolean;
};

const IDLE_STATE: WelcomeAuthState = {
  active: false,
  href: null,
  phase: "idle",
  fadeAmbient: false,
  hideEscort: false,
  slideAway: false,
  escortOn: false,
  choreographyArmed: false,
};

/** Stable server snapshot — must be referentially equal across calls */
export function getWelcomeAuthServerSnapshot(): WelcomeAuthState {
  return IDLE_STATE;
}

let state: WelcomeAuthState = IDLE_STATE;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function getWelcomeAuthTransition(): WelcomeAuthState {
  return state;
}

export function subscribeWelcomeAuthTransition(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startWelcomeAuthTransition(href: string) {
  state = {
    active: true,
    href,
    phase: "fade",
    fadeAmbient: true,
    hideEscort: false,
    slideAway: false,
    escortOn: false,
    choreographyArmed: false,
  };
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

export function setWelcomeAuthPhase(
  phase: Exclude<WelcomeAuthPhase, "idle">,
  patch?: Partial<
    Pick<WelcomeAuthState, "hideEscort" | "slideAway" | "escortOn">
  >
) {
  if (!state.active) return;
  state = {
    ...state,
    phase,
    fadeAmbient: true,
    hideEscort: patch?.hideEscort ?? state.hideEscort,
    slideAway: patch?.slideAway ?? state.slideAway,
    escortOn: patch?.escortOn ?? state.escortOn,
  };
  emit();
}

export function markWelcomeAuthChoreographyArmed() {
  if (!state.active) return;
  state = { ...state, choreographyArmed: true };
  emit();
}

export function finishWelcomeAuthTransition() {
  state = IDLE_STATE;
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
    if (data.t && Date.now() - data.t > WELCOME_AUTH_MS + 600) {
      sessionStorage.removeItem(WELCOME_AUTH_FLAG);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
