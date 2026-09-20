# MLAI VNG — Generic Sprint Skeleton

This repository contains the reusable pre-sprint shell for the MLAI Hackathon 2026 VNG track. It deliberately does **not** contain challenge-specific policy, escalation, authority, uncertainty classification, official prompts, or official test cases.

## Architecture

Browser → Next.js App Router UI → Next.js route handlers → Prisma/PostgreSQL (when configured). The generic LLM sandbox is server-side only and is isolated behind `src/lib/ai/`.

Routes:

- `/` — one-click entry points.
- `/workspace` — harmless text echo through `POST /api/echo`.
- `/verify` — four generic cases calling the production echo API.
- `/audit` — generic event log with detail dialog.

API:

- `GET /api/health` — standardized success response containing `{ status: "ok" }`.
- `POST /api/echo` — Zod-validated `{ text }` echo.
- `GET /api/events` — recent generic events.
- `POST /api/llm-test` — optional structured-output sandbox; requires `LLM_API_KEY`.

## Setup

```bash
npm ci
cp .env.example .env.local
npm run db:generate
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example`. `DATABASE_URL` enables persistent Prisma events. Without it, local development uses an in-memory fallback so the UI remains runnable; production deployment must provide PostgreSQL. `LLM_API_KEY` is only needed for `/api/llm-test`.

## Running Locally

```bash
npm test
npm run build
```

With PostgreSQL available:

```bash
npm run db:migrate
npm run dev
```

## Deployment

`render.yaml` describes one Render web service backed by a managed PostgreSQL database. Set the LLM secret in the Render dashboard; no secret belongs in Git.

## Verification

Use `/verify` and select **Run All Tests**. The runner sends each case to `/api/echo`, compares the actual API response with the expected value, and records a timestamp. This is intentionally generic; the official challenge cases must be created during Sprint 1 after the official brief is available.

## Pre-existing Components

The generic shell is being prepared before the challenge sprint. It must be publicly available and disclosed by the team before the relevant cutoff if it is reused. Challenge-specific logic remains intentionally absent.

## AI Tools Used

Initial scaffold was produced with an AI coding assistant and is subject to human review. The team must update this section with the actual tool names, prompts/workflows, corrections, and decisions made by team members before submission.

## Limitations

- No authentication or multi-role workflow.
- No challenge-specific decision engine.
- No official dataset or official Verify cases.
- In-memory events are a development fallback only; configure PostgreSQL for persistence.
- LLM calls are opt-in and require a server-side key.

See [RUNBOOK.md](RUNBOOK.md), [BUILD-LOG.md](BUILD-LOG.md), and [QA-CHECKLIST.md](QA-CHECKLIST.md).

## Team authorship and ownership

See [TEAM-PLAN.md](TEAM-PLAN.md). The generic pre-sprint shell is infrastructure only. The challenge-specific TypeScript/TSX core must be implemented, explained, tested, reviewed, and committed by the three student members during Sprint 1. AI assistance is not counted as implementation authorship.

Lịch làm việc song song của nhóm: [PARALLEL-WORK-PLAN.md](PARALLEL-WORK-PLAN.md).
