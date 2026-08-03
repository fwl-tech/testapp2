'use client'

import { useState } from 'react'
import { API_BASE } from '@/lib/apiBase'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      window.location.href = `${API_BASE}/`
    } else {
      setError('Wrong password')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 360, paddingTop: 120 }}>
      <div className="card">
        <h2>Billing Agent</h2>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          <button className="primary" type="submit" disabled={loading} style={{ marginTop: 12, width: '100%' }}>
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
