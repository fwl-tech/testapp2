import agentsAndBoard from './assets/agents-and-board.png'

const ventures = [
  {
    name: 'AI-Ready Structure for SMBs',
    goal: 'AI innovation must work for small business, which historically provide the majority of our jobs. They must be a growth engine.',
  },
  {
    name: 'AI Compliance & Governance',
    goal: 'AI will drive so much positivity and yet create the potential for negative outcomes. Regulation will be required and is coming to ensure AI adoption is for the betterment of all.',
  },
  {
    name: 'Physical-World Orchestration',
    goal: 'Successful companies will need tooling to coordinate a diverse workforce of AI agents, robots, and humans.',
  },
  {
    name: 'Home Lifecycle Management',
    goal: 'Housing shortage is a crisis. We are paying too much for ever aging homes. There is a better way to extend life and maximize home enjoyment.',
  },
]

export default function PortfolioList() {
  return (
    <section id="portfolio" style={{ padding: '64px 48px 96px', fontFamily: 'var(--font-body)' }}>
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
        Our goals
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 1120,
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {ventures.map((v) => (
          <div
            key={v.name}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '20px 24px', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lime-500)', flex: 'none', marginTop: 6 }} />
            <div style={{ width: 260, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink-950)' }}>
              {v.name}
            </div>
            <div style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{v.goal}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1120, marginTop: 40 }}>
        <img
          src={agentsAndBoard.src}
          alt="Human board working with AI agents"
          style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }}
        />
      </div>
      <div style={{ maxWidth: 720, marginTop: 28, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--ink-950)', lineHeight: 1.4 }}>
        We are working with our agents on three ideas. We are excited to share with you in the upcoming months.
      </div>
    </section>
  )
}
