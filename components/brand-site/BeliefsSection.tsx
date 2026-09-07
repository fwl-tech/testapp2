const beliefs = [
  {
    text: '2nd-order effects become standalone ventures',
    sub: "Agentic AI isn't just about being faster and more accurate. Enduring AI innovations will challenge the status quo.",
  },
  { text: 'Invest above the infrastructure layer', sub: 'They will rethink, rework, and reinvent everything.' },
  { text: 'Outcomes over SaaS productivity', sub: 'That includes the world of venture.' },
  {
    text: 'Dispassionate evaluation with human & agent analysis',
    sub: 'Our initial founders will almost always be our AI agents.',
  },
  {
    text: 'AI runs the company before we ever hire',
    sub: 'Then human founders will take the reins and provide the judgment required to rapidly scale.',
  },
]

export default function BeliefsSection() {
  return (
    <section id="thesis" style={{ padding: '64px 48px', background: 'var(--ink-950)', fontFamily: 'var(--font-body)' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--lime-500)',
          marginBottom: 16,
        }}
      >
        What we believe
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24, maxWidth: 1120 }}>
        {beliefs.map((b) => (
          <div key={b.text} style={{ borderTop: '1px solid var(--ink-700)', paddingTop: 16 }}>
            <div style={{ color: '#fff', fontSize: 16, lineHeight: 'var(--leading-normal)', fontWeight: 500 }}>{b.text}</div>
            <div style={{ color: 'var(--ink-300)', fontSize: 12, lineHeight: 'var(--leading-normal)', marginTop: 8 }}>{b.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
