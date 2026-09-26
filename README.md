# POVI — Proof of Vibe

Mobile-first Next.js app for co-op dating: Sharks vouch for friends, plan real dates in a 3-minute Deal Room, and show up IRL.

Visual direction: **light warm romantic** (Stories energy + a friend hyping you up). Dating-first IA — money stays off the main tabs.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS 4 + Framer Motion
- shadcn-style UI primitives (Radix)
- Mock data only (Supabase / Stripe / auth stubbed)

## Run locally

```bash
npm install
npm run dev:demo
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Demo surfaces

| Route | What you get |
|-------|----------------|
| `/` | Dual Card Feed — photo, vibe, Shark vouch, Skip / Vouch |
| `/deal-room` | Plan the date — countdown, chat, Lock the date |
| `/dates` | Upcoming locked dates |
| `/earnings` | Discreet Shark earnings (not in main nav) |

## Project layout

- `src/types/database.ts` — profiles, duos, matches, deal_rooms, escrow_transactions, post_date_reviews
- `src/lib/mock-data.ts` — demo feed / deal room / dates / earnings
- `src/lib/stubs.ts` — Supabase + Stripe stubs
- `src/app/globals.css` — light warm romantic design tokens

## Notes

No real credentials required. Wire Supabase and Stripe Connect when you leave the mock slice.
