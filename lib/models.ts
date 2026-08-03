import db from './db'

export interface Client {
  id: number
  name: string
  email: string
  address: string | null
  notes: string | null
  created_at: string
}

export interface LineItemInput {
  description: string
  quantity: number
  unit_price: number
}

export interface LineItem extends LineItemInput {
  id: number
  invoice_id: number
  amount: number
}

export interface Invoice {
  id: number
  number: string
  client_id: number
  status: 'draft' | 'sent' | 'paid' | 'void'
  issue_date: string
  due_date: string
  currency: string
  subtotal: number
  tax: number
  total: number
  notes: string | null
  sent_at: string | null
  last_reminder_at: string | null
  paid_at: string | null
  created_at: string
}

export function logActivity(entity_type: string, entity_id: number | null, action: string, detail?: string) {
  db.prepare(
    `INSERT INTO activity_log (entity_type, entity_id, action, detail) VALUES (?, ?, ?, ?)`
  ).run(entity_type, entity_id, action, detail ?? null)
}

export function listClients(): Client[] {
  return db.prepare(`SELECT * FROM clients ORDER BY name`).all() as Client[]
}

export function getClient(id: number): Client | undefined {
  return db.prepare(`SELECT * FROM clients WHERE id = ?`).get(id) as Client | undefined
}

export function findClientByName(name: string): Client | undefined {
  return db
    .prepare(`SELECT * FROM clients WHERE name LIKE ? ORDER BY name LIMIT 1`)
    .get(`%${name}%`) as Client | undefined
}

export function createClient(input: { name: string; email: string; address?: string; notes?: string }): Client {
  const result = db
    .prepare(`INSERT INTO clients (name, email, address, notes) VALUES (?, ?, ?, ?)`)
    .run(input.name, input.email, input.address ?? null, input.notes ?? null)
  const client = getClient(result.lastInsertRowid as number)!
  logActivity('client', client.id, 'created', `Created client ${client.name}`)
  return client
}

function nextInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const row = db
    .prepare(`SELECT COUNT(*) as count FROM invoices WHERE number LIKE ?`)
    .get(`INV-${year}-%`) as { count: number }
  const seq = String(row.count + 1).padStart(3, '0')
  return `INV-${year}-${seq}`
}

export function listInvoices(status?: string): (Invoice & { client_name: string })[] {
  const query = status
    ? `SELECT i.*, c.name as client_name FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.status = ? ORDER BY i.created_at DESC`
    : `SELECT i.*, c.name as client_name FROM invoices i JOIN clients c ON c.id = i.client_id ORDER BY i.created_at DESC`
  return (status ? db.prepare(query).all(status) : db.prepare(query).all()) as (Invoice & {
    client_name: string
  })[]
}

export function getInvoice(id: number): Invoice | undefined {
  return db.prepare(`SELECT * FROM invoices WHERE id = ?`).get(id) as Invoice | undefined
}

export function getLineItems(invoiceId: number): LineItem[] {
  return db.prepare(`SELECT * FROM invoice_line_items WHERE invoice_id = ?`).all(invoiceId) as LineItem[]
}

export function createInvoice(input: {
  client_id: number
  due_date: string
  line_items: LineItemInput[]
  tax_rate?: number
  notes?: string
}): Invoice {
  const client = getClient(input.client_id)
  if (!client) throw new Error(`Client ${input.client_id} not found`)
  if (!input.line_items?.length) throw new Error('At least one line item is required')

  const subtotal = input.line_items.reduce((sum, li) => sum + li.quantity * li.unit_price, 0)
  const tax = subtotal * (input.tax_rate ?? 0)
  const total = subtotal + tax
  const number = nextInvoiceNumber()
  const issueDate = new Date().toISOString().slice(0, 10)

  const insert = db.transaction(() => {
    const result = db
      .prepare(
        `INSERT INTO invoices (number, client_id, status, issue_date, due_date, subtotal, tax, total, notes)
         VALUES (?, ?, 'draft', ?, ?, ?, ?, ?, ?)`
      )
      .run(number, input.client_id, issueDate, input.due_date, subtotal, tax, total, input.notes ?? null)
    const invoiceId = result.lastInsertRowid as number

    const stmt = db.prepare(
      `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?)`
    )
    for (const li of input.line_items) {
      stmt.run(invoiceId, li.description, li.quantity, li.unit_price, li.quantity * li.unit_price)
    }
    return invoiceId
  })

  const invoiceId = insert()
  const invoice = getInvoice(invoiceId)!
  logActivity('invoice', invoice.id, 'created', `Created ${invoice.number} for ${client.name} — ${total.toFixed(2)} ${invoice.currency}`)
  return invoice
}

export function markInvoiceSent(id: number) {
  db.prepare(`UPDATE invoices SET status = 'sent', sent_at = datetime('now') WHERE id = ?`).run(id)
  logActivity('invoice', id, 'sent', 'Invoice emailed to client')
}

export function markInvoiceReminded(id: number) {
  db.prepare(`UPDATE invoices SET last_reminder_at = datetime('now') WHERE id = ?`).run(id)
  logActivity('invoice', id, 'reminder_sent', 'Reminder emailed to client')
}

export function markInvoicePaid(id: number, paidDate?: string) {
  db.prepare(`UPDATE invoices SET status = 'paid', paid_at = ? WHERE id = ?`).run(
    paidDate ?? new Date().toISOString().slice(0, 10),
    id
  )
  logActivity('invoice', id, 'paid', 'Invoice marked paid')
}

export function getOverdueInvoices(): (Invoice & { client_name: string; client_email: string })[] {
  const today = new Date().toISOString().slice(0, 10)
  return db
    .prepare(
      `SELECT i.*, c.name as client_name, c.email as client_email
       FROM invoices i JOIN clients c ON c.id = i.client_id
       WHERE i.status = 'sent' AND i.due_date < ?
       ORDER BY i.due_date`
    )
    .all(today) as (Invoice & { client_name: string; client_email: string })[]
}

export function recentActivity(limit = 20) {
  return db.prepare(`SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?`).all(limit)
}
