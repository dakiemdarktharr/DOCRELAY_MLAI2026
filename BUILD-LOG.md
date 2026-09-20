# Build Log

## Initial generic scaffold

- Date: 2026-09-16
- Scope: reusable pre-sprint shell only.
- AI tools used: AI coding assistant (this session); team should add the exact tool/account details before submission.
- AI assistance: generated the initial Next.js/TypeScript structure, generic UI primitives, API response helpers, Zod validation pattern, Prisma Event model, LLM wrapper, generic Verify runner, and documentation templates.
- Human decisions: preserve LabPass as the future concept, keep the current code challenge-agnostic, use deterministic generic echo verification, keep the API key server-side, and use PostgreSQL/Prisma for production event persistence.
- Corrections/risks to review: dependency versions, Render configuration, database connectivity, and all generated code must be reviewed and explained directly by team members.
- Largest feature intentionally cut: challenge workflow, because it must be developed during Sprint 1 after the official brief is released.

## Update template

For every meaningful change, record:

1. Tool or assistant used.
2. What it generated or changed.
3. What failed or cost time.
4. What a team member reviewed and decided.
5. Test/evidence link.

## Authorship clarification

The team requirement is stricter than merely using an AI coding assistant: challenge-specific TypeScript/TSX core must be self-written by student members. AI-generated generic scaffold code is not evidence of student authorship for the challenge core. During Sprint 1, each member must own a vertical slice, make the commits, explain the code, and record any material AI assistance.
