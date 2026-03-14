# MintLedger Web Demo

MintLedger is a polished web demo for a personal finance product concept. This repository focuses on the web presentation layer and interactive demo flows rather than a full production backend.

## What is in this repo

- A landing page plus an in-browser phone-sized demo experience
- Mock, dev, and prod API modes
- Demo flows for transactions, budgets, family sharing, privacy unlock, and FX fallback handling
- Unit tests with Vitest and Testing Library
- Docker and GitHub Actions deployment support

## Tech stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Motion
- Vitest

## Package manager

This repository uses `pnpm`.

- Install dependencies with `pnpm install`
- Do not use `npm install`
- Treat `pnpm-lock.yaml` as the dependency source of truth

## Local development

### Prerequisites

- Node.js 24 or another version compatible with the current toolchain
- `pnpm`

### Environment

Copy `.env.example` to your local env file and adjust values as needed.

Key variables:

- `VITE_APP_MODE`
  - `mock`: UI demo mode with mock data
  - `dev`: real API mode with debug logging
  - `prod`: real API mode without debug logging
- `VITE_API_BASE_URL`
  - base URL for the backend API in `dev` or `prod`

### Start the app

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://0.0.0.0:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm test
pnpm coverage
```

## Demo behavior

- Default mode is `mock`
- The web app is intentionally a demo surface
- No real user login or production ledger sync is expected in mock mode
- Several interactions are simulated locally to showcase product intent

## Quality checks

Before merging dependency, config, or deployment changes, run:

```bash
pnpm lint
pnpm test
pnpm build
```

## Deployment notes

- Docker builds use `pnpm`
- Nginx serves the static build output
- GitHub Actions deploys the container workflow defined in `.github/workflows/deploy.yml`

## Repository guardrails

- Review `AGENTS.md` before letting an agent modify the repo
- Do not remove Google-related integrations casually
- Do not introduce `package-lock.json` into this `pnpm` repository
- Keep documentation aligned with the current MintLedger project, not old templates
