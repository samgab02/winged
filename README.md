# POVI — Proof of Vibe

Mobile dating app where **Sharks** (friends / matchmakers) vouch for **Bachelors** and lock real-world dates in a 3-minute Deal Room.

## Run locally

```bash
npm install
npm run dev
```

Open **[http://localhost:4317](http://localhost:4317)**.

| Script | What it does |
|--------|----------------|
| `npm run dev` | Dev server on port **4317** (all interfaces) |
| `npm run build` | Production build |
| `npm run start` | Serve production build on **4317** |

Requires **Node.js 18+**. No `.env` required — accounts and sessions persist in the browser (`localStorage`).

## Default logins (local development)

On first visit, two ready accounts are seeded. Use them from **Sign in → Local defaults**, or type:

| Role | Email | Password |
|------|--------|----------|
| Bachelor | `bachelor@povi.app` | `povi123` |
| Shark | `shark@povi.app` | `povi123` |

Both skip onboarding and land in the matching shell. You can still create new accounts normally.

## Accounts & onboarding

1. Splash → Welcome → **Create account** or **Sign in** (email + password)
2. Choose **Bachelor** or **Shark**
3. Complete required onboarding (gender, profile, photos — Bachelors need **at least 3**)
4. Land in the matching shell

Sign out, delete account, and **Reset local data** live in Profile / Me (developer wipe — not a product “demo mode”). Reset re-seeds the default logins on the next visit.

## Seed catalog (data only)

`src/lib/seed-catalog.ts` ships rich seed people and photos so Discover / Swipe are populated after onboarding. They are catalog data for development — never labeled as demo mode in the UI.

Default logins live in `src/lib/dev-logins.ts`. Auth is structured in `src/lib/auth.ts` for a later Supabase Auth swap.

## Product shells

- **Bachelor:** Discover · Matches · Dates · Profile  
- **Shark:** Swipe · Deal Room · My singles · Me → Earnings  

## Deploy

Standard Next.js 15 App Router. Connect the repo to [Vercel](https://vercel.com) (Framework Preset: Next.js). `vercel.json` is included.

```bash
npx vercel --prod
```

## Stack

Next.js 15 · React 19 · Tailwind CSS 4 · Framer Motion · Zustand
