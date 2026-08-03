import { NextRequest, NextResponse } from 'next/server'
import { createInvoice, listInvoices } from '@/lib/models'

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') || undefined
  return NextResponse.json(listInvoices(status))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const invoice = createInvoice(body)
    return NextResponse.json(invoice, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
