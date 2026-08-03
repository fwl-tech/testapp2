import type { Client, Invoice, LineItem } from './models'

function money(n: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

export function renderInvoiceEmail(invoice: Invoice, client: Client, lineItems: LineItem[]) {
  const rows = lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${li.description}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${li.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${money(li.unit_price, invoice.currency)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${money(li.amount, invoice.currency)}</td>
      </tr>`
    )
    .join('')

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
    <h2 style="margin-bottom:0">Invoice ${invoice.number}</h2>
    <p style="color:#666;margin-top:4px">Issued ${invoice.issue_date} &middot; Due ${invoice.due_date}</p>
    <p>Hi ${client.name},</p>
    <p>Please find the details of this invoice below.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Description</th>
          <th style="padding:8px;text-align:right">Qty</th>
          <th style="padding:8px;text-align:right">Rate</th>
          <th style="padding:8px;text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <table style="width:100%;margin-top:8px">
      <tr><td style="text-align:right;padding:2px 8px">Subtotal</td><td style="text-align:right;padding:2px 8px;width:120px">${money(invoice.subtotal, invoice.currency)}</td></tr>
      <tr><td style="text-align:right;padding:2px 8px">Tax</td><td style="text-align:right;padding:2px 8px">${money(invoice.tax, invoice.currency)}</td></tr>
      <tr><td style="text-align:right;padding:2px 8px;font-weight:bold">Total Due</td><td style="text-align:right;padding:2px 8px;font-weight:bold">${money(invoice.total, invoice.currency)}</td></tr>
    </table>
    ${invoice.notes ? `<p style="color:#666">${invoice.notes}</p>` : ''}
    <p>Thank you for your business!</p>
  </div>`

  const text = [
    `Invoice ${invoice.number}`,
    `Issued ${invoice.issue_date} / Due ${invoice.due_date}`,
    '',
    `Hi ${client.name},`,
    '',
    ...lineItems.map((li) => `${li.description} x${li.quantity} @ ${money(li.unit_price, invoice.currency)} = ${money(li.amount, invoice.currency)}`),
    '',
    `Subtotal: ${money(invoice.subtotal, invoice.currency)}`,
    `Tax: ${money(invoice.tax, invoice.currency)}`,
    `Total Due: ${money(invoice.total, invoice.currency)}`,
    invoice.notes ?? '',
    '',
    'Thank you for your business!',
  ].join('\n')

  return { html, text, subject: `Invoice ${invoice.number} — ${money(invoice.total, invoice.currency)} due ${invoice.due_date}` }
}

export function renderReminderEmail(invoice: Invoice, client: Client) {
  const daysOverdue = Math.max(
    0,
    Math.floor((Date.now() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24))
  )
  const subject = `Reminder: Invoice ${invoice.number} is ${daysOverdue} day(s) overdue`
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
    <p>Hi ${client.name},</p>
    <p>This is a friendly reminder that invoice <strong>${invoice.number}</strong> for
    <strong>${money(invoice.total, invoice.currency)}</strong> was due on ${invoice.due_date}
    and is currently ${daysOverdue} day(s) overdue.</p>
    <p>If you've already sent payment, please disregard this message. Otherwise, we'd
    appreciate it if you could take care of it at your earliest convenience.</p>
    <p>Thank you!</p>
  </div>`
  const text = `Hi ${client.name},\n\nFriendly reminder that invoice ${invoice.number} for ${money(invoice.total, invoice.currency)} was due on ${invoice.due_date} and is ${daysOverdue} day(s) overdue.\n\nIf you've already paid, please disregard. Thank you!`
  return { html, text, subject }
}
