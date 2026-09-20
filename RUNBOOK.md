# Runbook

## 1. Clone

```bash
git clone <public-repository-url>
cd <repository-directory>
```

## 2. Install dependencies

```bash
npm ci
```

## 3. Configure environment

Copy `.env.example` to `.env.local`. For persistence, set a reachable PostgreSQL `DATABASE_URL`. Never commit `.env.local` or any API key.

## 4. Run locally

```bash
npm run db:generate
npm run dev
```

## 5. Run Verify

Open `/verify` and click **Run All Tests**. All four cases should pass when the app is running.

## 6. Open the live URL

Use the single Render URL recorded in the submission checklist. The app requires no account or installation.

## 7. Test a normal request

Open `/workspace`, enter `hello`, and click **Process**. The result should be a standardized success response containing the trimmed text.

## 8. Test a validation error

Submit an empty workspace input. The UI should show a `VALIDATION_ERROR` response.

## 9. View the audit log

Open `/audit`, refresh, and click an event row. The detail dialog should show timestamp, actor, event type, ID, and metadata.

## 10. Override

There is no challenge-specific human override in this generic pre-sprint shell. Add and document it only during Sprint 1 after the official workflow is known.

## Database reset check

Against a disposable empty PostgreSQL database:

```bash
npm run db:deploy
npm run build
```

## Render checks

Verify `/`, `/api/health`, `/audit`, and `/api/events` from an incognito browser window after each deployment.
