'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE } from '@/lib/apiBase'

export default function InvoiceActions({ id, status }: { id: number; status: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function act(action: 'send' | 'paid') {
    setLoading(action)
    const res = await fetch(`${API_BASE}/api/invoices/${id}/${action}`, { method: 'POST' })
    setLoading(null)
    if (res.ok) router.refresh()
    else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || `Failed to ${action}`)
    }
  }

  return (
    <div className="row">
      {status === 'draft' && (
        <button onClick={() => act('send')} disabled={loading !== null}>
          {loading === 'send' ? 'Sending…' : 'Send'}
        </button>
      )}
      {status === 'sent' && (
        <button onClick={() => act('paid')} disabled={loading !== null}>
          {loading === 'paid' ? 'Saving…' : 'Mark paid'}
        </button>
      )}
    </div>
  )
}
