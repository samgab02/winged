# Supabase free tier — Winged setup

## 1. Create project (free)
1. Open **[https://supabase.com/dashboard/new](https://supabase.com/dashboard/new)**
2. Create organization → New project (Free) → wait for DB
3. **Project Settings → API**
   - copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (optional) **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (server only)

## 2. CLI token (for agents / `supabase link`)
1. **[https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)**
2. Generate token → set `SUPABASE_ACCESS_TOKEN` in the Cloud Agent / shell
3. Then:
   ```bash
   npx supabase login --token "$SUPABASE_ACCESS_TOKEN"
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```

## 3. Apply schema
Paste or push `supabase/migrations/20260927050000_winged_core.sql`  
(SQL Editor → New query → Run)

Creates: `profiles`, `duo_links`, `matches`, `deal_rooms`, `escrow_transactions`, `post_date_reviews`, `qa_tickets` + RLS + auth trigger.

## 4. Auth providers (free)
| Provider | Action |
|----------|--------|
| **Email** | Authentication → Providers → Email → Enable (auto-confirm OK for dev) |
| **Google** | Enable Google; paste Google Cloud OAuth Client ID/Secret; redirect `{SITE}/auth/callback` |
| **Apple** | Optional — needs Apple Services ID |
| **Phone** | Optional — Twilio |

Redirect allowlist: `{NEXT_PUBLIC_SITE_URL}/auth/callback` and `http://127.0.0.1:4317/auth/callback`

## 5. Env
Local `.env.local` + Vercel project env:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://winged-app.vercel.app
```

## 6. App behavior
- Email/password uses Supabase Auth when env is set (`src/lib/auth.ts`)
- `SupabaseSessionBridge` keeps local session + `profiles` row in sync
- QA Studio **Sync DB** pulls/pushes `qa_tickets`
- Without env, localStorage auth + tickets still work
