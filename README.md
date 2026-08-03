# testapp2 — Billing Agent

Hatch AI app — https://hatchai.fairwaterlabs.com/apps/testapp2

An AI billing & invoicing assistant for a one-person LLC. A Claude tool-use
agent drafts invoices, emails them via Gmail, and chases overdue payments — all
through a chat box on a small dashboard.

## Quick start

```
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY at minimum
npm run dev
```

Open http://localhost:3000. Without `APP_PASSWORD` set, the dashboard is open;
without Gmail credentials configured, invoices can be drafted but sending will
error until you complete Gmail setup.

See [docs/SETUP.md](docs/SETUP.md) for Gmail OAuth, the app password, the
daily reminder cron, and production (Railway) persistence.

See [docs/spec-v1.md](docs/spec-v1.md) for the product spec.

## How it works

- `lib/agent/index.ts` — the Claude tool-use loop (system prompt + tool
  dispatch)
- `lib/agent/tools.ts` — the tools the agent can call (client/invoice CRUD,
  send email, send reminder)
- `lib/models.ts` / `lib/db.ts` — SQLite data layer
- `lib/gmail.ts` / `lib/invoiceEmail.ts` — Gmail sending + email templates
- `app/api/agent/route.ts` — chat endpoint used by the dashboard
- `app/api/agent/cron/route.ts` — daily overdue-invoice reminder sweep,
  called by `.github/workflows/daily-reminders.yml`
- `app/page.tsx` — dashboard (agent chat + clients/invoices tables)
