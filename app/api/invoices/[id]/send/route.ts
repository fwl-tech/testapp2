import { NextResponse } from 'next/server'
import { getClient, getInvoice, getLineItems, markInvoiceSent } from '@/lib/models'
import { sendEmail } from '@/lib/gmail'
import { renderInvoiceEmail } from '@/lib/invoiceEmail'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = getInvoice(Number(id))
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const client = getClient(invoice.client_id)!
  const lineItems = getLineItems(invoice.id)
  const email = renderInvoiceEmail(invoice, client, lineItems)
  try {
    await sendEmail({ to: client.email, subject: email.subject, html: email.html, text: email.text })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
  markInvoiceSent(invoice.id)
  return NextResponse.json({ ok: true })
}
