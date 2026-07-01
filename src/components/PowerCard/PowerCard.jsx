import './PowerCard.css'

export default function PowerCard({ power, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(power)}
      className="power-card"
    >
      <div className="power-card__body">
        <span className="power-card__name">{power.name}</span>
        <div className="power-card__meta">
          <span className={`rank-badge rank-${power.rank}`}>{power.rank}</span>
          {power.alias.length > 0 && (
            <span className="power-card__alias">
              aka {power.alias.join(', ')}
            </span>
          )}
        </div>
      </div>
      <span className="power-card__chevron">›</span>
    </button>
  )
}
