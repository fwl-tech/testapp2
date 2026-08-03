import { NextRequest, NextResponse } from 'next/server'
import { createClient, listClients } from '@/lib/models'

export async function GET() {
  return NextResponse.json(listClients())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
  }
  const client = createClient(body)
  return NextResponse.json(client, { status: 201 })
}
