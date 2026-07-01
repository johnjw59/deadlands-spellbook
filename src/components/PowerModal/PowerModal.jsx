import { useState, useEffect } from 'react'
import Markdown from '../Markdown'
import './PowerModal.css'

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
    <div className="power-modal">
      {/* Backdrop */}
      <div className="power-modal__backdrop" onClick={onClose} aria-hidden="true" />

      {/* Modal panel */}
      <div className="power-modal__panel">

        {/* ── Fixed header (hidden when expanded) ── */}
        {!expanded && (
          <div className="power-modal__header">
            {/* Name row */}
            <div className="power-modal__title-row">
              <div>
                <h2 className="power-modal__title">{power.name}</h2>
                <span className={`rank-badge rank-${power.rank}`}>{power.rank}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="power-modal__close"
              >✕</button>
            </div>

            {/* Stats row */}
            <div className={`power-modal__stats${power.trappings ? ' power-modal__stats--spaced' : ''}`}>
              {[
                { label: 'PP',       value: power.power_points },
                { label: 'Range',    value: power.range },
                { label: 'Duration', value: power.duration },
              ].map(({ label, value }) => (
                <div key={label} className="power-modal__stat">
                  <span className="power-modal__stat-label">{label}</span>
                  <span className="power-modal__stat-value">{value}</span>
                </div>
              ))}
            </div>

            {/* Trappings */}
            {power.trappings && (
              <p className="power-modal__trappings">
                <span className="power-modal__trappings-label">Trappings: </span>
                {power.trappings}
              </p>
            )}
          </div>
        )}

        {/* ── Expand / collapse toggle ── */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className={`power-modal__toggle${expanded ? ' power-modal__toggle--expanded' : ''}`}
        >
          {expanded ? (
            <>
              <div className="power-modal__toggle-spacer" />
              <span className="power-modal__toggle-icon">▼</span>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onClose() }}
                className="power-modal__toggle-close"
              >✕</span>
            </>
          ) : (
            <span className="power-modal__toggle-icon">▲</span>
          )}
        </button>

        {/* ── Scrollable body ── */}
        <div className="power-modal__body no-scrollbar">

          <Markdown>{power.description}</Markdown>

          {power.modifiers.length > 0 && (
            <div className="power-modal__modifiers">
              <p className="power-modal__modifiers-heading">Modifiers</p>
              <div className="power-modal__modifier-list">
                {power.modifiers.map((mod, i) => (
                  <div key={i} className="power-modal__modifier">
                    <div className="power-modal__modifier-header">
                      <span className="power-modal__modifier-name">{mod.name}</span>
                      <span className="power-modal__modifier-cost">{formatCost(mod.cost)}</span>
                    </div>
                    <Markdown>{mod.effect}</Markdown>
                  </div>
                ))}
              </div>
            </div>
          )}

          {power.alias.length > 0 && (
            <p className="power-modal__alias">
              Also known as: {power.alias.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
