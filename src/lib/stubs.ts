/**
 * Legacy stub removed — use real clients:
 * - Auth: `@/lib/supabase/*` + `@/lib/auth/oauth`
 * - Stripe: `/api/stripe/checkout` (503 lists missing env)
 * - Places: `/api/places/search` (Nominatim / Mapbox)
 */

export {
  isSupabaseConfigured,
  missingAuthEnv,
  AUTH_ENV_REQUIRED,
  AUTH_ENV_OPTIONAL,
} from "@/lib/supabase/config";
