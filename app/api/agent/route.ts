import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  const { instruction } = await req.json()
  if (!instruction || typeof instruction !== 'string') {
    return NextResponse.json({ error: 'instruction is required' }, { status: 400 })
  }

  try {
    const result = await runAgent(instruction)
    db.prepare(
      `INSERT INTO agent_runs (trigger, instruction, response, tool_calls) VALUES ('chat', ?, ?, ?)`
    ).run(instruction, result.response, JSON.stringify(result.toolCalls))
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
