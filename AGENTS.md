# Repository collaboration

The user removed the mandatory two-owner/two-package workflow. Implement and commit locally when requested; no package split or fixed commit count is required. Record the base, scope, diff and check results. Preserve uncommitted work in other checkouts. Local commit permission does not authorize push, merge or deployment. Record AI assistance without inferring human review from Git identity. Older package prompts are historical instructions, not current repository policy.

Read README.md, STATUS.md, mlai26_new/PROJECT-MEMORY.md and mlai26_new/AGENTS.md before changes.

On 2026-09-20 the user explicitly authorized merging the complete Support v3 migration, including src, into main. Main now includes the implementation from migration commit 89d62c4. The previous source-free main restriction is superseded. Preserve existing policy/workflow, compatibility APIs, tests and fixtures.

Do not skip tests, change Ground Truth to hide failures, expose secrets, or rewrite provenance/history/timestamps. Record reused UI and AI assistance accurately. Follow the user's latest explicit scope; publishing a Git commit does not itself authorize changing deployment configuration or production data.
