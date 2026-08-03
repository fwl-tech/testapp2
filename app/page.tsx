import { listClients, listInvoices, recentActivity } from '@/lib/models'
import AgentChat from '@/components/AgentChat'
import InvoiceActions from '@/components/InvoiceActions'

export const dynamic = 'force-dynamic'

function statusBadgeClass(invoice: { status: string; due_date: string }) {
  if (invoice.status === 'sent' && invoice.due_date < new Date().toISOString().slice(0, 10)) {
    return 'overdue'
  }
  return invoice.status
}

export default async function DashboardPage() {
  const clients = listClients()
  const invoices = listInvoices()
  const activity = recentActivity(10) as { id: number; action: string; detail: string; created_at: string }[]

  const outstanding = invoices
    .filter((i) => i.status === 'sent')
    .reduce((sum, i) => sum + i.total, 0)

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Billing Agent</h1>
          <p>AI invoicing assistant for your LLC</p>
        </div>
        <div className="muted">Outstanding: ${outstanding.toFixed(2)}</div>
      </div>

      <AgentChat />

      <div className="card">
        <h2>Invoices</h2>
        {invoices.length === 0 ? (
          <p className="muted">No invoices yet — ask the agent to create one.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Client</th>
                <th>Due</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.number}</td>
                  <td>{inv.client_name}</td>
                  <td>{inv.due_date}</td>
                  <td>${inv.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(inv)}`}>{statusBadgeClass(inv)}</span>
                  </td>
                  <td>
                    <InvoiceActions id={inv.id} status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Clients</h2>
        {clients.length === 0 ? (
          <p className="muted">No clients yet — ask the agent to add one.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Recent activity</h2>
        {activity.length === 0 ? (
          <p className="muted">Nothing yet.</p>
        ) : (
          <table>
            <tbody>
              {activity.map((a) => (
                <tr key={a.id}>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                    {a.created_at}
                  </td>
                  <td>{a.detail || a.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
