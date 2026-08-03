# Setup

## 1. Anthropic API key

Create a key at https://console.anthropic.com and set `ANTHROPIC_API_KEY`.

## 2. Gmail (send invoices & reminders)

The agent sends mail via the Gmail API under your own account (no third-party mail
relay). One-time setup:

1. In [Google Cloud Console](https://console.cloud.google.com), create a project and
   enable the **Gmail API**.
2. Configure the OAuth consent screen (External is fine for personal use; add your
   own Gmail address as a test user).
3. Create an **OAuth client ID** of type "Desktop app". Note the client ID and secret.
4. Locally, run:
   ```
   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy npm run gmail:token
   ```
   This opens a consent URL — sign in with the Gmail account that should send
   invoices, approve the `gmail.send` scope, and the script prints a
   `GOOGLE_REFRESH_TOKEN`.
5. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and
   `GMAIL_SENDER_EMAIL` in your `.env` (local) or Railway service variables
   (production).

The agent never gets broader Gmail access than "send mail" — it can't read your
inbox.

## 3. App password

Set `APP_PASSWORD` to gate the dashboard behind a single shared password (this is a
personal, single-user app — no need for full multi-user auth). Leave it unset for
open access during local development.

## 4. Daily reminder check

`POST /api/agent/cron` runs the agent's daily sweep: find overdue invoices, send
reminders (skipping any invoice reminded in the last 3 days). Protect it with
`CRON_SECRET` and call it once a day, e.g. from the GitHub Actions workflow in
`.github/workflows/daily-reminders.yml`, or any external scheduler, with:

```
curl -X POST https://<your-app-url>/api/agent/cron -H "x-cron-secret: $CRON_SECRET"
```

## 5. Database persistence on Railway

Invoices are stored in a SQLite file at `DB_PATH` (default `./data/app.db`). Railway
containers are ephemeral across deploys, so attach a
[volume](https://docs.railway.app/reference/volumes) mounted at `/app/data` (and set
`DB_PATH=/app/data/app.db`) so billing data survives redeploys.
