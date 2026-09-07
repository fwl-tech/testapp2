export default function Footer() {
  return (
    <footer
      style={{
        padding: '32px 48px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--text-tertiary)',
      }}
    >
      <div>© 2026 agens field · VC-funded by Defy.vc</div>
      <div style={{ display: 'flex', gap: 20 }}>
        <span>Fairwater Labs</span>
        <span>Gravity Labs</span>
      </div>
    </footer>
  )
}
