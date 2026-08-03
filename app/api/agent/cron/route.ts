import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import db from '@/lib/db'

const DAILY_INSTRUCTION = `Run the daily billing check: call get_overdue_invoices. For each overdue invoice,
send a reminder via send_reminder UNLESS its last_reminder_at is within the last 3 days (skip those).
Finish with a short summary of which invoices got reminders and which were skipped and why.`

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const provided = req.headers.get('x-cron-secret')
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const result = await runAgent(DAILY_INSTRUCTION)
    db.prepare(
      `INSERT INTO agent_runs (trigger, instruction, response, tool_calls) VALUES ('cron', ?, ?, ?)`
    ).run(DAILY_INSTRUCTION, result.response, JSON.stringify(result.toolCalls))
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
