'use client'

import { useState } from 'react'
import logo from './assets/agens-field-logo.png'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={logo.src} alt="agens field" style={{ height: 44 }} />
      </div>
      <nav style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        <a href="#thesis" style={{ color: 'inherit', textDecoration: 'none' }}>
          What we believe
        </a>
        <a href="#themes" style={{ color: 'inherit', textDecoration: 'none' }}>
          Where we invest
        </a>
        <a href="#portfolio" style={{ color: 'inherit', textDecoration: 'none' }}>
          Portfolio
        </a>
      </nav>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 14,
          background: 'var(--ink-950)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Partner with us
      </button>
    </header>
  )
}
