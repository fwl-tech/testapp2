export default function Hero() {
  return (
    <section style={{ padding: '96px 48px 64px', maxWidth: 900, fontFamily: 'var(--font-body)' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--text-secondary)',
          marginBottom: 20,
        }}
      >
        An AI company creation platform
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'var(--text-display-xl)',
          lineHeight: 'var(--leading-tight)',
          color: 'var(--ink-950)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        We ideate, build, fund, and launch AI-native companies ourselves.
      </h1>
      <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)', marginTop: 24, maxWidth: 640 }}>
        Partnering with founders early to accelerate time to value — AI runs the company before we ever hire.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <button
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 15,
            background: 'var(--ink-950)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '13px 26px',
            cursor: 'pointer',
          }}
        >
          See where we invest
        </button>
        <button
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 15,
            background: 'var(--lime-500)',
            color: 'var(--ink-950)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '13px 26px',
            cursor: 'pointer',
          }}
        >
          Read the thesis
        </button>
      </div>
    </section>
  )
}
