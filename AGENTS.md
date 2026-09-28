# Repository collaboration

The user's current standing preference is to commit and push completed, checked work directly to GitHub `main`, unless a later request explicitly limits the work to local-only or another branch. Preserve dirty checkouts by integrating in a clean checkout; reconcile newer remote commits and never force-push. Do not create a topic branch by default. This preference does not authorize production-data changes or manual deployment/configuration changes.

The user removed the mandatory two-owner/two-package workflow. Implement and commit locally when requested; no package split or fixed commit count is required. Record the base, scope, diff and check results. Preserve uncommitted work in other checkouts. An explicit local-only request does not authorize publishing; otherwise use the standing main preference above. Manual deployment and production-data changes still require their own scope. Record AI assistance without inferring human review from Git identity. Older package prompts are historical instructions, not current repository policy.

Read README.md, RUNBOOK.md, mlai26_new/PROJECT-MEMORY.md and mlai26_new/AGENTS.md before changes.

On 2026-09-20 the user explicitly authorized merging the complete Support v3 migration, including src, into main. Main now includes the implementation from migration commit 89d62c4. The previous source-free main restriction is superseded. Preserve existing policy/workflow, compatibility APIs, tests and fixtures.

Do not skip tests, change Ground Truth to hide failures, expose secrets, or rewrite provenance/history/timestamps. Record reused UI and AI assistance accurately. Follow the user's latest explicit scope; publishing a Git commit does not itself authorize changing deployment configuration or production data.
