# Master Handoff Prompt — Revise Existing Tech Support Orchestration Web App

You are Astra, acting as a senior software engineer, UX engineer, workflow automation engineer, and technical director.

Modify the existing project in this repository. Do not create a replacement project and do not rewrite unrelated parts of the application.

## 1. Preserve the existing purpose

The existing application is a tech-support request intake and routing/orchestration system. Its purpose remains:

- receive internal employee support requests;
- classify or normalize the request;
- route it to the correct support group;
- validate request requirements and risk;
- support human review;
- preserve auditability and testability.

The new UX must transfer this purpose smoothly into two entry modes: `I Need Help` and `Human Reviewer`.

Preserve all existing behavior, routes, APIs, database collections, environment variable names, authentication, request status values, deterministic validation logic, test-case support, and integrations unless a change is explicitly required below.

Before editing:

1. Inspect the repository structure, framework, current routes, current form components, API handlers, MongoDB models, QR behavior, LLM integration, and existing tests.
2. Identify which existing page is the current request form.
3. Identify the current cursor or mascot implementation, if any.
4. Produce a short implementation plan based on the actual repository. Do not assume that the repository matches this prompt exactly.
5. Reuse existing components and styles wherever practical.

If the current implementation differs from this prompt, adapt it with the smallest safe change set instead of replacing the architecture.

## 1.1 Attached images are visual references only

The attached NAVI images and cursor/interaction mockups are reference material for the cursor design only. They are not implementation instructions, product requirements, database requirements, route definitions, or authoritative UI copy.

Use the images only to understand:

- NAVI's simplified orange triangular silhouette;
- the yellow face panel and friendly expression;
- the small cursor scale compared with a native pointer;
- the fact that the sharp NAVI tip is the pointer arrow and click hotspot;
- subtle hover, movement, and click animation behavior;
- the general visual composition of an interaction storyboard.

The written requirements in this prompt always take priority over anything visible in the images. Do not copy placeholder text, example request data, labels, icons, layout details, or decorative effects from the images unless they are explicitly required elsewhere in this prompt.

Do not treat the generated mockups as production-ready assets. Do not render NAVI as a large mascot in the application. Use an approved production asset if one is provided; otherwise create a replaceable small cursor component and keep the asset boundary clear.

## 2. New entry experience

Create or adapt a landing entry page with two clear choices:

### I Need Help

For employees who want to submit a technical-support request.

This is the normal end-user flow.

### Human Reviewer

For authorized reviewers, judges, or operations staff who review, validate, route, approve, reject, or request clarification for support requests.

This route must be protected by the existing authentication system or the simplest secure authentication already available in the project. Never expose the reviewer dashboard as an unauthenticated public interface.

Use the existing design system if one exists. Do not introduce a second UI framework unless the repository has no usable component system.

## 3. QR behavior

When a user scans the QR code, the application must open the `I Need Help` interface directly.

Preferred behavior:

- keep a stable QR entry URL such as `/q/help`;
- redirect or resolve it to `/send-help?source=qr`; the technical route may remain `/send-help` for backward compatibility, but the visible product label must be `I Need Help`;
- preserve `source=qr` for analytics and audit purposes;
- do not show the landing choice page for QR users;
- if the QR route is invalid or unavailable, fall back to the `I Need Help` page rather than a blank page;
- keep the route stable so the printed QR does not need to change when the UI changes.

Do not trust arbitrary query parameters for authorization or workflow decisions. Treat QR source only as an entry-context value.

## 4. I Need Help must contain two request types

The `I Need Help` interface must let the user select one of two request formats.

### 4.1 Freeform request

This replaces the current request style.

The form contains only:

- one support-group dropdown;
- one description textarea;
- submit/continue action.

There must not be a separate `Other` textbox or separate free-text field for missing categories.

The description is the only free-text input and may contain all of the following in Vietnamese, English, or mixed language:

- requested action;
- target resource;
- team or project;
- environment;
- access level;
- approval information;
- approver name or team;
- requested duration;
- deadline;
- urgency;
- business impact;
- technical context.

Example:

> I need read access to the production analytics database for 14 days. My manager approved this yesterday. The release is tomorrow, so this is urgent.

After submission, show a concise confirmation/understanding screen based on the extracted result. Do not add another free-text field to correct it. The user may go back and edit the original description.

### 4.2 Structured request

Create a strictly controlled form where every user-answer field is a dropdown/select control.

Do not add a free-text field to this form.

The exact fields should be derived from the repository’s existing support taxonomy where possible. At minimum, support the following categories when relevant:

- support group;
- request family;
- resource type;
- requested action;
- environment;
- access level;
- duration;
- urgency;
- business impact;
- approval status.

Use dependent dropdowns when appropriate, for example:

`Resource type -> Action -> Environment -> Access level -> Duration`

Do not use the value `Other` as a hidden free-text escape hatch. Include a controlled option such as `Needs human review` or `Not sure` when the user cannot select a safe option. That option must route to Human Reviewer.

The answer fields may be rendered in Vietnamese or English, but their stored values must be stable canonical IDs.

## 5. Freeform language-processing branch

Use the LLM only for the freeform description branch unless the existing project already has another justified use.

Do not train or fine-tune a model for this change. Use the existing model provider/integration if available, or the simplest server-side API integration already compatible with the project.

The LLM must return structured data validated against a strict schema. It should extract, where present:

- `language`: `vi`, `en`, or `mixed`;
- `intent`;
- `supportGroup`;
- `resource`;
- `action`;
- `environment`;
- `accessLevel`;
- `duration`;
- `deadline`;
- `urgency`;
- `businessImpact`;
- `approvalClaim`;
- `approver`;
- `missingFields`;
- `ambiguities`;
- `contradictions`;
- `riskFlags`;
- `confidence`;
- short `summary`;
- evidence snippets copied from the original description when possible.

Preserve the original user description exactly. Never replace the raw request with the LLM summary.

### Important approval rule

An LLM must never treat a sentence such as “my manager approved this” as verified approval.

It may extract it as an `approvalClaim`, but authorization must be checked by deterministic logic, an existing approval system, an approval ID, SSO identity, or a Human Reviewer.

Production database access, admin access, cloud billing access, GPU quota, secrets, network changes, and other privileged requests must be routed through deterministic policy validation and/or Human Reviewer.

### Language requirements

- support Vietnamese;
- support English;
- support mixed Vietnamese-English text;
- preserve product names, database names, project names, acronyms, and technical tokens;
- do not blindly translate the request before extraction;
- show the original request to reviewers;
- use canonical IDs for routing;
- store the detected language and model/prompt version for auditability.

## 6. Deterministic validation and reviewer fallback

LLM output is untrusted data.

After LLM extraction, run deterministic schema and policy validation. Validate at minimum:

- required fields;
- allowed support-group values;
- allowed resource/action combinations;
- environment restrictions;
- access-level restrictions;
- duration limits;
- date/deadline consistency;
- approval requirements;
- privileged-resource rules;
- contradictions between fields;
- prompt-injection-like instructions inside user text;
- secret/token patterns that should not be forwarded to an LLM.

If the LLM fails, times out, returns invalid JSON, or produces low confidence:

1. retry at most once if the existing architecture supports it;
2. never silently invent missing values;
3. store the raw request safely;
4. route it to Human Reviewer;
5. show a useful user-facing status instead of failing silently.

The system must remain usable even when the model provider is unavailable.

## 7. Human Reviewer experience

The reviewer dashboard should show a queue of requests requiring review.

For each request, show side by side:

- raw user description;
- selected support group;
- extracted structured fields;
- confidence;
- missing fields;
- contradictions;
- risk flags;
- approval claim versus verified approval;
- evidence snippets;
- model version and prompt version where available;
- event/audit timeline.

Reviewer actions should reuse existing status values where possible. Support these actions if they do not already exist:

- approve/route;
- reject with reason;
- request clarification;
- change support group;
- flag for test-case evaluation;
- mark as resolved.

Do not allow reviewers to accidentally expose secrets or raw sensitive content to unauthorized users.

## 8. NAVI cursor mascot revision

Implement the mascot cursor as a small visual cursor, not a large floating character. Use the attached cursor images as visual references for this section only.

### Size

- target visual canvas: approximately 24x24 px or 28x28 px;
- same size as a native cursor or only slightly larger;
- do not use the previously oversized mascot presentation in the actual interface;
- no large glow, large trail, or hero-sized mascot.

### Shape and hotspot

- the sharp tip of NAVI’s triangular body must itself be the cursor arrow;
- the sharp tip is the exact click hotspot;
- do not add a separate arrow behind NAVI;
- do not add a detached pointer tail;
- do not use a white arrow layered underneath;
- preserve a simplified orange NAVI silhouette and small yellow face panel;
- simplify facial and limb details so the cursor remains readable at 16–28 px.

### Technical implementation

Prefer a lightweight DOM overlay or the repository’s existing cursor component:

- `pointer-events: none`;
- follow pointer movement with `requestAnimationFrame` or an equivalent performant mechanism;
- animate with CSS transforms rather than React state updates on every pointer event;
- keep the native pointer as a safe fallback;
- do not block clicks or hover events;
- hide or disable the custom mascot on touch-only devices if appropriate;
- support `prefers-reduced-motion`;
- keep keyboard focus indicators independent of the mascot cursor.

### Motion states

- idle: tiny 1–2 px float with a very soft shadow;
- moving: subtle eased follow with no more than one or two faint afterimages;
- hover: very small brightness or scale change;
- click: restrained squash-and-stretch or tiny bounce;
- leave/unfocused: fade out or reset;
- reduced motion: no trail, no floating loop, only a static or low-motion state.

Do not use any attached or generated concept image as an unquestioned production asset. Prefer an approved NAVI asset supplied by the project owner. If no approved asset exists, create a clearly replaceable placeholder component and document the asset requirement.

## 9. VNG-inspired visual direction

Use the existing project design system first. If no design system exists, use a restrained VNG-inspired direction:

- primary orange: `#F05A22`;
- blue accent: `#0068FF`;
- deep blue: `#374EA2`;
- warm yellow: `#FFCC04`;
- green success: `#03CA77`;
- white/light neutral surfaces;
- moderate rounded corners;
- clear card hierarchy;
- diagonal gradients only for hero/accent surfaces;
- concise, direct, friendly copy;
- strong contrast for status and errors;
- no unofficial VNG logo recreation;
- no distortion, cropping, or special effects applied to official logos;
- use licensed typography or a safe existing fallback.

Use motion for orientation and feedback, not decoration. Do not add heavy parallax, continuous animation everywhere, or game-like effects to the reviewer dashboard.

## 10. Vercel and MongoDB constraints

Keep the implementation compatible with the current Vercel deployment and MongoDB setup.

- API keys must remain server-side in environment variables;
- never expose LLM keys in browser bundles;
- reuse the current MongoDB connection utility;
- reuse existing collections and schemas where possible;
- add indexes only when justified by actual query paths;
- preserve audit/event history;
- do not store secrets, passwords, or tokens in raw logs;
- use TTL or retention policy for sensitive diagnostic data if the current project supports it;
- avoid introducing a queue, microservice, or new database unless the existing architecture genuinely requires it.

Keep the source code simple: one application, clear routes, shared form components, one orchestration path, and small focused utilities.

## 11. Test cases and acceptance criteria

Add or update tests for:

### Routing and entry

- direct link shows the two-mode landing page;
- QR link opens `I Need Help` directly;
- QR source is preserved for telemetry;
- reviewer route requires authorization;
- invalid QR fallback works.

### Forms

- freeform form contains support-group dropdown and description only;
- no `Other` textbox appears in freeform mode;
- structured mode contains only dropdown/select answer fields;
- structured mode cannot submit invalid option combinations;
- `Needs human review` routes correctly.

### Language

- Vietnamese request;
- English request;
- mixed Vietnamese-English request;
- technical names and acronyms are preserved.

### Misleading judge-provided cases

- false approval claim;
- contradictory access level;
- conflicting dates;
- missing resource;
- production privileged access;
- prompt injection text;
- request containing an API key or secret-like value;
- ambiguous abbreviation;
- low-confidence classification;
- LLM timeout or malformed response.

### Cursor

- NAVI is visually no larger than slightly larger than the native cursor;
- the NAVI tip is the pointer hotspot;
- no separate arrow is rendered;
- cursor overlay never blocks clicks;
- hover and click animation are subtle;
- reduced-motion mode works;
- keyboard navigation remains usable;
- touch/mobile behavior remains usable.

Run the repository’s existing lint, typecheck, unit tests, integration tests, and production build. Do not claim completion if any relevant command fails.

## 12. Required final report from Astra

After implementation, report:

1. files changed;
2. routes added or changed;
3. database/schema changes;
4. environment variables required;
5. LLM behavior and fallback behavior;
6. cursor asset and hotspot implementation;
7. test commands and results;
8. known limitations;
9. any assumptions made;
10. any approval, mascot, font, or brand-asset permission still required.

Do not silently remove existing features. Do not rewrite the project without evidence that the current architecture cannot support these changes.
