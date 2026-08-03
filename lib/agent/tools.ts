import type Anthropic from '@anthropic-ai/sdk'
import {
  createClient,
  createInvoice,
  findClientByName,
  getClient,
  getInvoice,
  getLineItems,
  getOverdueInvoices,
  listClients,
  listInvoices,
  markInvoicePaid,
  markInvoiceReminded,
  markInvoiceSent,
} from '../models'
import { sendEmail } from '../gmail'
import { renderInvoiceEmail, renderReminderEmail } from '../invoiceEmail'

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: 'list_clients',
    description: 'List all clients on file with their id, name, and email.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'find_or_create_client',
    description:
      'Find a client by name (fuzzy match). If none exists and an email is provided, create one. Use this before creating an invoice for a client that may not exist yet.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client or company name' },
        email: { type: 'string', description: 'Client billing email, required if creating a new client' },
        address: { type: 'string' },
      },
      required: ['name'],
    },
  },
  {
    name: 'create_invoice',
    description:
      'Create a draft invoice for a client with one or more line items. Does not send it — call send_invoice separately.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'integer' },
        due_date: { type: 'string', description: 'YYYY-MM-DD' },
        tax_rate: { type: 'number', description: 'e.g. 0.08 for 8%. Omit if no tax.' },
        notes: { type: 'string' },
        line_items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              quantity: { type: 'number' },
              unit_price: { type: 'number' },
            },
            required: ['description', 'quantity', 'unit_price'],
          },
        },
      },
      required: ['client_id', 'due_date', 'line_items'],
    },
  },
  {
    name: 'send_invoice',
    description: "Email a draft invoice to the client via Gmail and mark it as sent.",
    input_schema: {
      type: 'object',
      properties: { invoice_id: { type: 'integer' } },
      required: ['invoice_id'],
    },
  },
  {
    name: 'list_invoices',
    description: 'List invoices, optionally filtered by status (draft, sent, paid, void).',
    input_schema: {
      type: 'object',
      properties: { status: { type: 'string' } },
    },
  },
  {
    name: 'get_overdue_invoices',
    description: 'List invoices that are past their due date and still unpaid (status = sent).',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'send_reminder',
    description: 'Email a payment reminder for an overdue invoice via Gmail.',
    input_schema: {
      type: 'object',
      properties: { invoice_id: { type: 'integer' } },
      required: ['invoice_id'],
    },
  },
  {
    name: 'mark_invoice_paid',
    description: 'Mark an invoice as paid.',
    input_schema: {
      type: 'object',
      properties: { invoice_id: { type: 'integer' }, paid_date: { type: 'string', description: 'YYYY-MM-DD' } },
      required: ['invoice_id'],
    },
  },
]

export async function runTool(name: string, input: any): Promise<string> {
  switch (name) {
    case 'list_clients': {
      return JSON.stringify(listClients())
    }
    case 'find_or_create_client': {
      const existing = findClientByName(input.name)
      if (existing) return JSON.stringify(existing)
      if (!input.email) {
        return JSON.stringify({ error: 'No matching client found. Provide an email to create one.' })
      }
      const client = createClient({ name: input.name, email: input.email, address: input.address })
      return JSON.stringify(client)
    }
    case 'create_invoice': {
      const invoice = createInvoice({
        client_id: input.client_id,
        due_date: input.due_date,
        line_items: input.line_items,
        tax_rate: input.tax_rate,
        notes: input.notes,
      })
      return JSON.stringify(invoice)
    }
    case 'send_invoice': {
      const invoice = getInvoice(input.invoice_id)
      if (!invoice) return JSON.stringify({ error: 'Invoice not found' })
      const client = getClient(invoice.client_id)
      if (!client) return JSON.stringify({ error: 'Client not found' })
      const lineItems = getLineItems(invoice.id)
      const email = renderInvoiceEmail(invoice, client, lineItems)
      await sendEmail({ to: client.email, subject: email.subject, html: email.html, text: email.text })
      markInvoiceSent(invoice.id)
      return JSON.stringify({ ok: true, sent_to: client.email })
    }
    case 'list_invoices': {
      return JSON.stringify(listInvoices(input.status))
    }
    case 'get_overdue_invoices': {
      return JSON.stringify(getOverdueInvoices())
    }
    case 'send_reminder': {
      const invoice = getInvoice(input.invoice_id)
      if (!invoice) return JSON.stringify({ error: 'Invoice not found' })
      const client = getClient(invoice.client_id)
      if (!client) return JSON.stringify({ error: 'Client not found' })
      const email = renderReminderEmail(invoice, client)
      await sendEmail({ to: client.email, subject: email.subject, html: email.html, text: email.text })
      markInvoiceReminded(invoice.id)
      return JSON.stringify({ ok: true, sent_to: client.email })
    }
    case 'mark_invoice_paid': {
      markInvoicePaid(input.invoice_id, input.paid_date)
      return JSON.stringify({ ok: true })
    }
    default:
      return JSON.stringify({ error: `Unknown tool ${name}` })
  }
}
