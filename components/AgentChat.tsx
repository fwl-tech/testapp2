'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE } from '@/lib/apiBase'

interface ChatEntry {
  role: 'user' | 'agent'
  text: string
  tools?: { name: string; input: any }[]
}

export default function AgentChat() {
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!instruction.trim() || loading) return
    const text = instruction
    setInstruction('')
    setEntries((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Agent failed')
      setEntries((prev) => [...prev, { role: 'agent', text: data.response, tools: data.toolCalls }])
      router.refresh()
    } catch (err: any) {
      setEntries((prev) => [...prev, { role: 'agent', text: `Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Ask the billing agent</h2>
      <div className="chat-log">
        {entries.length === 0 && (
          <p className="muted">
            Try: &ldquo;Create an invoice for Acme Corp (acme@example.com) for 10 hours of consulting at
            $150/hr, due in 30 days&rdquo; or &ldquo;send it&rdquo; or &ldquo;check overdue invoices and send
            reminders&rdquo;.
          </p>
        )}
        {entries.map((e, i) => (
          <div key={i} className={`chat-msg ${e.role}`}>
            {e.text}
            {!!e.tools?.length && (
              <div className="tools">actions: {e.tools.map((t) => t.name).join(', ')}</div>
            )}
          </div>
        ))}
        {loading && <div className="chat-msg agent muted">Working…</div>}
      </div>
      <form onSubmit={submit} className="row">
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Tell the agent what to do…"
          disabled={loading}
        />
        <button className="primary" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  )
}
