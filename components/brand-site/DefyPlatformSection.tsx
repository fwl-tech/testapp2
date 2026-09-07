import scottBolick from './assets/scott-bolick.jpeg'

export default function DefyPlatformSection() {
  return (
    <section id="defy" style={{ padding: '64px 48px', fontFamily: 'var(--font-body)', borderTop: '1px solid var(--border-subtle)' }}>
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
        A Defy platform
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 28,
          color: 'var(--ink-950)',
          maxWidth: 760,
          lineHeight: 1.25,
          marginBottom: 40,
        }}
      >
        A refined approach to company creation platforms already proven by Defy.vc.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1120, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <a
            href="https://fairwaterlabs.com"
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              background: '#fff',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 32,
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              justifyContent: 'center',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink-950)' }}>Fairwater Labs</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Dual-use company creation</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--forest-600)', marginTop: 8 }}>fairwaterlabs.com →</div>
          </a>
          <a
            href="https://gravity-labs.xyz"
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              background: '#fff',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 32,
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              justifyContent: 'center',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink-950)' }}>Gravity Labs</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Crypto company creation</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--forest-600)', marginTop: 8 }}>gravity-labs.xyz →</div>
          </a>
        </div>
        <div style={{ background: 'var(--ink-950)', borderRadius: 'var(--radius-lg)', padding: 32, display: 'flex', gap: 20, alignItems: 'center' }}>
          <img
            src={scottBolick.src}
            alt="Scott Bolick"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flex: 'none' }}
          />
          <div>
            <div style={{ color: '#fff', fontSize: 15, lineHeight: 1.5, fontStyle: 'normal' }}>
              &quot;At Fairwater Labs, we have proven the ability to accelerate the time from ideation to putting technology in
              the hands of our warfighters. That process is our IP. We are replicating this success for outcome driven AI
              companies.&quot;
            </div>
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: 'var(--lime-500)' }}>Scott Bolick</div>
            <div style={{ fontSize: 12, color: 'var(--ink-300)' }}>Fairwater Labs</div>
          </div>
        </div>
      </div>
    </section>
  )
}
