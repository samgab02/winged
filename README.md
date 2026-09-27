# Winged — Friends plan it. You show up.

Dating app where **Wings** negotiate a live **Deal Room** (venue + time in ~3 minutes) for **Bachelors**. Distinctive flows: Pro Wings network, Date Pass escrow, Proof of Stay, dual Keep/Skip flash — not profile-writing-as-a-service.

> Winged is not affiliated with Wingman App or Wingman Group, Inc. Brand stays **Winged**; matchmakers stay **Wings**. See `docs/trademark-wingman-note.md`.

## Run locally

```bash
npm install
npm run dev
```

Open **[http://localhost:4317](http://localhost:4317)**.

- **Desktop (≥1024px):** side nav + multi-column Discover / Wings grids (not a centered phone column)
- **Phone simulator:** **[/ios](http://localhost:4317/ios)** — iPhone + Galaxy frames with full in-app navigation. Production: [winged-app.vercel.app/ios](https://winged-app.vercel.app/ios)

| Script | What it does |
|--------|----------------|
| `npm run dev` | Dev server on port **4317** (all interfaces, `0.0.0.0`) |
| `npm run build` | Production build |
| `npm run start` | Serve production build on **4317** |

Requires **Node.js 18+**. No `.env` required — accounts and sessions persist in the browser (`localStorage`). See `.env.example` for optional future Supabase keys.

## Default logins (local development)

On first visit, ready accounts are seeded. Use them from **Sign in → Local defaults**, or type:

| Role | Email | Password |
|------|--------|----------|
| Bachelor (woman · warm auto) | `bachelor@winged.app` | `winged123` |
| Bachelor (man · cool auto) | `man@winged.app` | `winged123` |
| Wing | `wing@winged.app` | `winged123` |

They skip onboarding and land in the matching shell. You can still create new accounts normally.

## Appearance

Theme presets follow profile gender by default:

- **Woman** → warm blush atmosphere  
- **Man** → cool slate / indigo  
- **Non-binary / unset** → neutral dating  

Override anytime under **Profile / Me → Appearance**: Auto · Neutral · Warm · Cool.

## Accounts & onboarding

1. Splash → Welcome → **Create account** or **Sign in** (email + password)
2. Choose **Bachelor** or **Wing** (“I’m a Wing”)
3. Complete required onboarding (gender, profile, photos — Bachelors need **at least 3**)
4. Land in the matching shell

Sign out, delete account, and **Reset local data** live in Profile / Me. Reset re-seeds the default logins on the next visit.

## Seed catalog (data only)

`src/lib/seed-catalog.ts` ships rich seed people and photos so Discover / Swipe are populated after onboarding. Default logins live in `src/lib/dev-logins.ts`. Auth is structured in `src/lib/auth.ts` for a later Supabase Auth swap.

## Product shells

- **Bachelor:** Discover · Matches · Dates · My Wing · Profile  
- **Wing:** Swipe · Deal Room · Wings hub / network · Me → Earnings  
- **Layouts:** mobile bottom dock; desktop left rail + wider content; `/ios` for phone chrome

## Deploy

- **GitHub:** [github.com/samgab02/winged](https://github.com/samgab02/winged)
- **Production:** [https://winged-app.vercel.app](https://winged-app.vercel.app) (Vercel project `winged-app`)

> `winged.vercel.app` is already taken by an unrelated project — do not overwrite. Use a custom domain later if you want that hostname.

```bash
npx vercel --prod
```

## Stack

Next.js 15 · React 19 · Tailwind CSS 4 · Framer Motion · Zustand
