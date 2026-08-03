import { NextResponse } from 'next/server'
import { getInvoice, markInvoicePaid } from '@/lib/models'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = getInvoice(Number(id))
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  markInvoicePaid(invoice.id)
  return NextResponse.json({ ok: true })
}
