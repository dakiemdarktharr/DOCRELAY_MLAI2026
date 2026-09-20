# Policy source of truth

Version: `policy-v2`  
Status: **synthetic/proposed challenge policy**. This is not an official VNG policy.

These files define the business rules that the deterministic decision engine must implement. They are intentionally separate from the TypeScript engine, datasets, and UI.

## Safety invariants

- A sentence such as “lead approved” is an `approval_claim`, never a verified approval.
- Only a server-side approval verifier or a synthetic approval registry may set `approval_verification_status=VERIFIED`.
- An approval must match the approver role, named resource, scope, permission/action, duration, and expiry.
- A secret is redacted before it is sent to an LLM, stored, logged, or displayed. Audit records retain only redacted evidence and a redaction marker.
- A ticket containing multiple requests is decomposed; the final ticket decision takes the highest-risk subrequest.
- Conflicting structured fields and free text are never silently normalized. They escalate.
- `AUTO_APPROVE` approves only a safe, simulated workflow outcome. It never means the system may directly provision privileged access or disclose data.
- `OTHER` is a canonical fallback for unknown classification. It is not a required free-text UI option.

## Files

| File | Purpose |
|---|---|
| `service-catalog.csv` | Canonical service IDs, UI visibility, routing team, and approval gate. |
| `required-fields.md` | Required facts and validation behavior per service. |
| `approval-authority-matrix.csv` | Who may approve which scope and whether an automatic decision is eligible. |
| `decision-rules.md` | Rule precedence, deterministic outcomes, targeted questions, and examples. |
| `routing-matrix.csv` | Explicit route outcomes for complete, incomplete, and risky requests. |
| `glossary.md` | Vietnamese/English canonicalization without discarding risky raw evidence. |

## Responsibility boundary

Policy authoring owns the meaning of rules, required facts, authority, and expected outcomes. The decision-engine owner converts this policy into typed TypeScript and tests it without changing rule meaning. If implementation reveals ambiguity, it must be returned to policy authoring rather than guessed in code.
