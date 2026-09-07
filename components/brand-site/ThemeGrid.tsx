const themes = [
  {
    name: 'AI-Ready Structure for SMBs',
    desc: '$10M–$100M firms have tools but no structure. The "AI-Ready" consulting offering funds the platform and builds the deal flow.',
    venture: '→ Satellitic AI',
  },
  {
    name: 'AI Compliance & Governance',
    desc: 'Every company becomes an AI company. Every regulated sector needs audit trails for every AI decision.',
    venture: '→ AI Compliance',
  },
  {
    name: 'Physical-World Orchestration',
    desc: "Agents can generate text but can't move freight. Real-time sensor integration and logistics require structural moats FMs can't replicate.",
    venture: '→ TBD',
  },
  {
    name: 'Home Lifecycle Management',
    desc: 'Personal agents will manage energy, maintenance, insurance, contractors. Whoever owns this coordination layer owns the household.',
    venture: '→ Home Manager Agent',
  },
]

export default function ThemeGrid() {
  return (
    <section id="themes" style={{ padding: '64px 48px', fontFamily: 'var(--font-body)' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--text-secondary)',
          marginBottom: 16,
        }}
      >
        Where we invest
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, maxWidth: 1120 }}>
        {themes.map((t) => (
          <div
            key={t.name}
            style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--ink-950)', marginBottom: 10 }}>
              {t.name}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 'var(--leading-normal)', marginBottom: 16 }}>
              {t.desc}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--forest-600)' }}>{t.venture}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
