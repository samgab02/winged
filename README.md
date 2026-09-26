# POVI — Proof of Vibe

Complete role-split dating demo: **Bachelor** and **Shark** get separate shells, multi-photo profiles, and full mock flows (onboarding → discover/swipe → Deal Room → date lock → flash → dates).

Visual direction: light warm romantic (Art Direction v3). Money only inside **Shark → Me → Earnings**.

## Run

```bash
npm install
npm run dev:demo
```

Open [http://localhost:4317](http://localhost:4317).

Requires Node 18+. No env vars.

## Roles

On launch, pick **Bachelor** or **Shark** (saved in `localStorage`).

| Bachelor nav | Shark nav |
|---|---|
| Discover · Matches · Dates · Profile | Swipe · Deal Room · My singles · Me |

Switch roles anytime from Profile / Me → **Switch role (demo)** or **Reset demo**.

## Key routes

- `/` — welcome / role pick  
- `/onboarding/bachelor` · `/onboarding/shark`  
- `/bachelor/discover` · `/bachelor/matches` · `/bachelor/dates` · `/bachelor/profile`  
- `/bachelor/deal-room/[id]` — observe + earpiece whisper  
- `/shark/swipe` · `/shark/deal-room` · `/shark/singles` · `/shark/me` · `/shark/me/earnings`  
- `/bachelor/flash/[id]` · `/shark/flash/[id]` — 180s Keep/Skip stub  

## Stack

Next.js 15 · React 19 · Tailwind 4 · Framer Motion · Zustand · mock data only
