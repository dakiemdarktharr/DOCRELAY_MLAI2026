# Repository collaboration

Read README.md, STATUS.md, mlai26_new/PROJECT-MEMORY.md and mlai26_new/AGENTS.md before changes.

On 2026-09-20 the user explicitly authorized merging the complete Support v3 migration, including src, into main. Main now includes the implementation from migration commit 89d62c4. The previous source-free main restriction is superseded. Preserve existing policy/workflow, compatibility APIs, tests and fixtures.

Do not skip tests, change Ground Truth to hide failures, expose secrets, or rewrite provenance/history/timestamps. Record reused UI and AI assistance accurately. Follow the user's latest explicit scope; publishing a Git commit does not itself authorize changing deployment configuration or production data.
