# POVI — Proof of Vibe

Mobile-first Next.js app for co-op matchmaking: Sharks vouch for Bachelors, lock real-world dates in a 3-minute Deal Room, and earn via escrowed Date Passes.

Visual direction: calm dark UI (late-night café × fintech) — soft coral primary, muted teal for Shark/trust, no neon glow chrome. See `docs/art-direction-v2` in the project brief store.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS 4 + Framer Motion
- shadcn-style UI primitives (Radix)
- Mock data only (Supabase / Stripe / auth stubbed)

## Run locally

```bash
npm install
npm run dev -- -p 4317
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

Or use the npm script:

```bash
npm run dev:demo
```

## Demo surfaces

| Route | What you get |
|-------|----------------|
| `/` | Dual Card Feed — 60% Bachelor media / 40% Shark vouch, physics swipe |
| `/deal-room` | Neon 3-minute countdown + interactive Shark chat (mock realtime) |
| `/wallet` | Pending vs Available balances + escrow transaction timeline |

## Project layout

- `src/types/database.ts` — profiles, duos, matches, deal_rooms, escrow_transactions, post_date_reviews
- `src/lib/mock-data.ts` — demo feed / deal room / wallet data
- `src/lib/stubs.ts` — Supabase + Stripe Connect stubs
- `src/app/globals.css` — dopamine dark neon design tokens

## Notes

No real credentials required. Wire Supabase and Stripe Connect when you leave the mock slice.
