# Product spec — testapp2

**Version**: 1.0
**Status**: Draft
**URL**: https://hatchai.fairwaterlabs.com/apps/testapp2
**Repo**: https://github.com/fwl-tech/testapp2

---

## Problem

Running billing and invoicing for a one-person LLC by hand — drafting invoices,
emailing them, tracking who's paid, and chasing overdue payments — is tedious
and easy to let slip. This app puts an AI agent in charge of that workflow.

## Users

The LLC's owner (single user, password-gated dashboard).

## Core actions

- Add/find a client (name, email, address)
- Draft an invoice for a client from line items (description, qty, unit price),
  with a due date and optional tax
- Send a draft invoice by email (via the owner's Gmail account)
- Detect overdue invoices and send payment reminders (max one every 3 days per
  invoice), on a daily schedule
- Mark an invoice paid
- All of the above is driven either through a natural-language chat box (an
  Anthropic Claude tool-use agent) or direct dashboard buttons for the
  send/mark-paid actions

## Data model

- `clients`: id, name, email, address, notes
- `invoices`: id, number, client_id, status (draft/sent/paid/void), issue_date,
  due_date, currency, subtotal, tax, total, notes, sent_at, last_reminder_at,
  paid_at
- `invoice_line_items`: id, invoice_id, description, quantity, unit_price, amount
- `activity_log`: audit trail of every action taken (by hand or by the agent)
- `agent_runs`: every agent invocation, its instruction, response, and tool calls

Stored in SQLite (`lib/db.ts`); see `docs/SETUP.md` for production persistence.

## Auth

Single shared password (`APP_PASSWORD`) gates the whole app via
`middleware.ts`. No per-user accounts — this is a personal tool, not
multi-tenant.

## Constraints

- Sending mail requires Gmail OAuth2 credentials scoped to `gmail.send` only.
- The agent never sends an invoice or reminder unless explicitly instructed to
  (see system prompt in `lib/agent/index.ts`).
- The daily reminder cron endpoint (`/api/agent/cron`) is protected by
  `CRON_SECRET` instead of the cookie session, since it's called by a
  scheduler, not a browser.

## Success metric

Every invoice for the LLC gets created and sent within the app, and overdue
invoices get a reminder within 1 day of becoming eligible — without the owner
manually drafting emails.
