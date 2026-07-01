import { useState, useMemo } from 'react'
import powersData from '../../data/powers.json'
import arcaneBackgrounds from '../../data/arcane-backgrounds.json'
import PowerCard from '../PowerCard'
import PowerModal from '../PowerModal'
import './PowerList.css'

const RANKS = ['Novice', 'Seasoned', 'Veteran', 'Heroic']

const abPowerSets = Object.fromEntries(
  arcaneBackgrounds.map(ab => [ab.id, new Set(ab.powers)])
)

const sortedPowers = [...powersData].sort((a, b) => a.name.localeCompare(b.name))

export default function PowerList() {
  const [search, setSearch] = useState('')
  const [selectedRank, setSelectedRank] = useState(null)
  const [selectedAb, setSelectedAb] = useState(null)
  const [selectedPower, setSelectedPower] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sortedPowers.filter(power => {
      if (selectedRank && power.rank !== selectedRank) return false
      if (selectedAb && !abPowerSets[selectedAb]?.has(power.id)) return false
      if (q) {
        const nameMatch = power.name.toLowerCase().includes(q)
        const aliasMatch = power.alias.some(a => a.toLowerCase().includes(q))
        if (!nameMatch && !aliasMatch) return false
      }
      return true
    })
  }, [search, selectedRank, selectedAb])

  const toggleRank = (rank) => setSelectedRank(prev => prev === rank ? null : rank)
  const toggleAb = (abId) => setSelectedAb(prev => prev === abId ? null : abId)

  return (
    <div className="power-list">
      {/* Header */}
      <div className="power-list__header pt-safe">
        <h1 className="power-list__title">
          <span className="power-list__title-icon">🌵</span>{' '}
          <span className="power-list__title-main">Deadlands</span>{' '}
          <span className="power-list__title-sub">Spellbook</span>
        </h1>

        {/* Search */}
        <div className="power-list__search">
          <span className="power-list__search-icon">⌕</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search powers…"
            className="power-list__search-input"
          />
        </div>

        {/* Rank pills */}
        <div className="power-list__filter-row no-scrollbar">
          {RANKS.map(rank => {
            const active = selectedRank === rank
            return (
              <button
                key={rank}
                type="button"
                onClick={() => toggleRank(rank)}
                className={[
                  'rank-badge',
                  `rank-${rank}`,
                  'power-list__rank-btn',
                  selectedRank && !active ? 'power-list__rank-btn--inactive' : '',
                  active ? 'power-list__rank-btn--active' : '',
                ].filter(Boolean).join(' ')}
              >
                {rank}
              </button>
            )
          })}
        </div>

        {/* Arcane background pills */}
        <div className="power-list__filter-row power-list__filter-row--ab no-scrollbar">
          {arcaneBackgrounds.map(ab => {
            const active = selectedAb === ab.id
            return (
              <button
                key={ab.id}
                type="button"
                onClick={() => toggleAb(ab.id)}
                className={[
                  'power-list__ab-btn',
                  active ? 'power-list__ab-btn--active' : '',
                  selectedAb && !active ? 'power-list__ab-btn--inactive' : '',
                ].filter(Boolean).join(' ')}
              >
                {ab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Power list */}
      <div className="power-list__scroll no-scrollbar pt-safe">
        {filtered.length > 0
          ? filtered.map(power => (
              <PowerCard key={power.id} power={power} onClick={setSelectedPower} />
            ))
          : (
            <div className="power-list__empty">
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
