export default function PowerCard({ power, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(power)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '13px 15px',
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        borderRadius: '14px',
        cursor: 'pointer',
        textAlign: 'left',
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ color: 'var(--c-text-bright)', fontWeight: 600, fontSize: '16px', lineHeight: 1.25 }}>
          {power.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
          <span className={`rank-badge rank-${power.rank}`}>{power.rank}</span>
          {power.alias.length > 0 && (
            <span style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--c-text-dim)' }}>
              aka {power.alias.join(', ')}
            </span>
          )}
        </div>
      </div>
      <span style={{ color: 'var(--c-border)', fontSize: '22px', fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>›</span>
    </button>
  )
}
