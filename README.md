# POVI — Proof of Vibe

Mobile dating app where **Sharks** (friends / matchmakers) vouch for **Bachelors** and lock real-world dates in a 3-minute Deal Room.

## Run locally

From the repo root:

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

Requires **Node.js 18+**. No `.env` required for the local mock session.

## Product shells

On launch, choose **Bachelor** or **Shark** (persisted in the browser).

- **Bachelor:** Discover · Matches · Dates · Profile  
- **Shark:** Swipe · Deal Room · My singles · Me → Earnings  

## Deploy

This is a standard Next.js 15 App Router app. Connect the repo to [Vercel](https://vercel.com) (Framework Preset: Next.js). `vercel.json` is included.

```bash
npx vercel --prod
```

## Stack

Next.js 15 · React 19 · Tailwind CSS 4 · Framer Motion · Zustand
