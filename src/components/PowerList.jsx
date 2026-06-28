import { useState, useMemo } from 'react'
import powersData from '../data/powers.json'
import arcaneBackgrounds from '../data/arcane-backgrounds.json'
import PowerCard from './PowerCard'
import PowerModal from './PowerModal'

const RANKS = ['Novice', 'Seasoned', 'Veteran', 'Heroic']

const abPowerSets = Object.fromEntries(
  arcaneBackgrounds.map(ab => [ab.id, new Set(ab.powers)])
)

const sortedPowers = [...powersData].sort((a, b) => a.name.localeCompare(b.name))

export default function PowerList() {
  const [search, setSearch]               = useState('')
  const [selectedRank, setSelectedRank]   = useState(null)
  const [selectedAb, setSelectedAb]       = useState(null)
  const [selectedPower, setSelectedPower] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sortedPowers.filter(power => {
      if (selectedRank && power.rank !== selectedRank) return false
      if (selectedAb && !abPowerSets[selectedAb]?.has(power.id)) return false
      if (q) {
        const nameMatch  = power.name.toLowerCase().includes(q)
        const aliasMatch = power.alias.some(a => a.toLowerCase().includes(q))
        if (!nameMatch && !aliasMatch) return false
      }
      return true
    })
  }, [search, selectedRank, selectedAb])

  const toggleRank = (rank) => setSelectedRank(prev => prev === rank ? null : rank)
  const toggleAb   = (abId) => setSelectedAb(prev => prev === abId ? null : abId)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100svh',
      overflow: 'hidden',
      background: 'var(--c-bg)',
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        paddingTop:    'max(env(safe-area-inset-top), 14px)',
        paddingLeft:   'max(env(safe-area-inset-left), 16px)',
        paddingRight:  'max(env(safe-area-inset-right), 16px)',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--c-separator)',
      }}>
        <h1 style={{
          margin: '0 0 12px',
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '-0.4px',
          lineHeight: 1.2,
        }}>
          <span style={{ color: 'var(--c-copper)' }}>☽</span>{' '}
          <span style={{ color: 'var(--c-text-bright)' }}>Weird West</span>{' '}
          <span style={{ color: 'var(--c-gold)', fontWeight: 500 }}>Spellbook</span>
        </h1>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <span style={{
            position: 'absolute', left: '11px', top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '14px', color: 'var(--c-text-dim)', pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search powers…"
            style={{
              display: 'block', width: '100%',
              padding: '9px 12px 9px 30px',
              borderRadius: '10px',
              border: '1px solid var(--c-separator)',
              background: 'var(--c-surface)',
              color: 'var(--c-text-bright)',
              fontSize: '16px',
              outline: 'none',
              WebkitAppearance: 'none',
            }}
          />
        </div>

        {/* Rank pills */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {RANKS.map(rank => {
            const active = selectedRank === rank
            return (
              <button
                key={rank}
                type="button"
                onClick={() => toggleRank(rank)}
                className={`rank-badge rank-${rank}`}
                style={{
                  flexShrink: 0, minHeight: '28px', cursor: 'pointer', touchAction: 'manipulation',
                  opacity: selectedRank && !active ? 0.4 : 1,
                  outline: active ? '2px solid currentColor' : 'none',
                  outlineOffset: '2px',
                  transition: 'opacity 0.15s',
                }}
              >
                {rank}
              </button>
            )
          })}
        </div>

        {/* Arcane background pills */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '7px' }}>
          {arcaneBackgrounds.map(ab => {
            const active = selectedAb === ab.id
            return (
              <button
                key={ab.id}
                type="button"
                onClick={() => toggleAb(ab.id)}
                style={{
                  flexShrink: 0, minHeight: '28px',
                  padding: '3px 12px',
                  borderRadius: '20px',
                  border: `1.5px solid ${active ? 'var(--c-gold)' : 'var(--c-border)'}`,
                  background: active ? 'var(--c-gold)' : 'var(--c-surface)',
                  color: active ? 'var(--c-bg)' : 'var(--c-text-dim)',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  opacity: selectedAb && !active ? 0.4 : 1,
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.15s',
                }}
              >
                {ab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      <div style={{
        flexShrink: 0,
        padding: '6px 16px',
        fontSize: '12px',
        color: 'var(--c-text-dim)',
        fontWeight: 500,
      }}>
        {filtered.length} {filtered.length === 1 ? 'power' : 'powers'}
      </div>

      {/* Power list */}
      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 16px',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {filtered.length > 0
          ? filtered.map(power => (
              <PowerCard key={power.id} power={power} onClick={setSelectedPower} />
            ))
          : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '120px', fontSize: '15px', color: 'var(--c-text-dim)',
              fontStyle: 'italic',
            }}>
              No powers match your filters
            </div>
          )
        }
      </div>

      {selectedPower && (
        <PowerModal power={selectedPower} onClose={() => setSelectedPower(null)} />
      )}
    </div>
  )
}
