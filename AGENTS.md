# Repository collaboration

Read README.md, STATUS.md, mlai26_new/PROJECT-MEMORY.md and mlai26_new/AGENTS.md before changes.

Main contains the Support v3 implementation and its current policy/workflow. Preserve compatibility APIs, tests, fixtures and provenance. The release surface intentionally excludes old tutoring, handoff and planning prompts; do not reintroduce them into release commits.

Do not skip tests, change Ground Truth to hide failures, expose secrets, or rewrite provenance/history/timestamps. Record reused UI and AI assistance accurately. Follow the user's latest explicit scope; publishing a Git commit does not itself authorize changing deployment configuration or production data.
