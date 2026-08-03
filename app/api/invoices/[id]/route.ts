import { NextRequest, NextResponse } from 'next/server'
import { getClient, getInvoice, getLineItems } from '@/lib/models'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = getInvoice(Number(id))
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const client = getClient(invoice.client_id)
  const lineItems = getLineItems(invoice.id)
  return NextResponse.json({ ...invoice, client, line_items: lineItems })
}
