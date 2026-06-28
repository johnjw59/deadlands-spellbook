import { useState, useEffect } from 'react'
import Markdown from './Markdown'

function formatCost(costArray) {
  return costArray.map(c => (c === 0 ? 'Free' : `+${c} PP`)).join(' / ')
}

export default function PowerModal({ power, onClose }) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Reset expanded state when a different power is opened
  useEffect(() => { setExpanded(false) }, [power.id])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `max(env(safe-area-inset-top), 16px) 16px max(env(safe-area-inset-bottom), 16px)`,
      background: 'rgba(8, 2, 0, 0.78)',
    }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} aria-hidden="true" />

      {/* Modal panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--c-elevated)',
        borderRadius: '18px',
        overflow: 'hidden',
        animation: 'modalIn 0.22s cubic-bezier(0.34, 1.2, 0.64, 1)',
        boxShadow: '0 12px 60px rgba(0,0,0,0.7)',
        border: '1px solid var(--c-border)',
      }}>

        {/* ── Fixed header (hidden when expanded) ── */}
        {!expanded && (
          <div style={{ flexShrink: 0, padding: '18px 18px 14px', borderBottom: '1px solid var(--c-separator)' }}>
            {/* Name row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
              <div>
                <h2 style={{ margin: '0 0 7px', color: 'var(--c-text-bright)', fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>
                  {power.name}
                </h2>
                <span className={`rank-badge rank-${power.rank}`}>{power.rank}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                  flexShrink: 0, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--c-surface)',
                  border: '1px solid var(--c-border)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--c-text-dim)',
                  fontSize: '14px', fontWeight: 700,
                  touchAction: 'manipulation',
                }}
              >✕</button>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              background: 'var(--c-surface)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid var(--c-separator)',
              marginBottom: power.trappings ? '12px' : 0,
            }}>
              {[
                { label: 'PP',       value: power.power_points },
                { label: 'Range',    value: power.range },
                { label: 'Duration', value: power.duration },
              ].map(({ label, value }, i, arr) => (
                <div key={label} style={{
                  flex: 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  padding: '9px 4px',
                  borderRight: i < arr.length - 1 ? '1px solid var(--c-separator)' : 'none',
                }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--c-text-dim)', fontWeight: 600 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--c-gold)', textAlign: 'center', lineHeight: 1.3 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Trappings */}
            {power.trappings && (
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: 'var(--c-text-dim)' }}>
                <span style={{ fontWeight: 600, color: 'var(--c-text)' }}>Trappings: </span>
                {power.trappings}
              </p>
            )}
          </div>
        )}

        {/* ── Expand / collapse toggle ── */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'space-between' : 'center',
            gap: '6px',
            padding: expanded ? '10px 14px' : '7px 18px',
            background: 'var(--c-elevated)',
            border: 'none',
            borderBottom: '1px solid var(--c-separator)',
            cursor: 'pointer',
            touchAction: 'manipulation',
            color: 'var(--c-text-dim)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.3px',
          }}
        >
          {expanded ? (
            <>
              <div style={{ width: 28 }} />
              <span style={{ fontSize: '18px', lineHeight: 1 }}>▼</span>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onClose() }}
                style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--c-surface)',
                  border: '1px solid var(--c-border)',
                  borderRadius: '50%',
                  color: 'var(--c-text-dim)',
                  fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer',
                }}
              >✕</span>
            </>
          ) : (
            <span style={{ fontSize: '18px', lineHeight: 1 }}>▲</span>
          )}
        </button>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 18px 20px' }}>

          <div className="power-description" style={{ fontSize: '15px', color: 'var(--c-text)' }}>
            <Markdown>{power.description}</Markdown>
          </div>

          {power.modifiers.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ margin: '0 0 10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--c-text-dim)', fontWeight: 700 }}>
                Modifiers
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {power.modifiers.map((mod, i) => (
                  <div key={i} style={{
                    background: 'var(--c-surface)',
                    border: '1px solid var(--c-separator)',
                    borderRadius: '10px',
                    padding: '11px 13px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--c-text-bright)' }}>
                        {mod.name}
                      </span>
                      <span style={{
                        fontSize: '11px', color: 'var(--c-gold)',
                        background: 'rgba(212, 160, 42, 0.12)',
                        padding: '2px 8px', borderRadius: '20px', fontWeight: 700,
                      }}>
                        {formatCost(mod.cost)}
                      </span>
                    </div>
                    <div className="power-description" style={{ fontSize: '13px' }}>
                      <Markdown>{mod.effect}</Markdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {power.alias.length > 0 && (
            <p style={{ marginTop: '16px', marginBottom: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--c-text-dim)', textAlign: 'center' }}>
              Also known as: {power.alias.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
