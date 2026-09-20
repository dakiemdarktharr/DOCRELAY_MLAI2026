# Student-authored source workflow

Read `LUNA-SRC-TUTOR-PROMPT.md`, `STATUS.md`, `mlai26_new/PROJECT-MEMORY.md` and `mlai26_new/AGENTS.md` before assisting.

The user explicitly reserves `src/` for their own implementation. `main` intentionally receives configuration, tests, fixtures and documentation without the generated source. Act as a tutor/reviewer by default: explain the contract, give a small exercise, wait for the user's implementation, then review and test it. Do not generate, restore, copy, cherry-pick or edit source on the user's behalf unless they explicitly change that scope.

The reference implementation remains on `codex/support-v3-migration` at `69b16493143b1fd48d41487012ff0db77999a042`. Do not automatically consult it as an answer key. Existing screenshots/test reports describe that reference, not the student's new implementation. Preserve provenance; do not rewrite history or dates.

Do not delete/skip tests or modify Ground Truth to disguise missing source or failures. Do not automatically deploy the source-free preparation branch. Follow the user's latest explicit instructions when older master prompts ask for autonomous implementation.
