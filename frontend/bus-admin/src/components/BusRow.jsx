/* ─────────────────────────────────────────────────────────
   BusRow — single compact row in the Bus List
   Displays: Bus {busId} ({route}) · Status badge
───────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  Active: { color: '#2d9e5f', bg: '#f0fff4', label: 'Active' },
  Inactive: { color: '#e53e3e', bg: '#fff5f5', label: 'Inactive' },
  Maintenance: { color: '#d97706', bg: '#fff7ed', label: 'Maintenance' },
};

export default function BusRow({ bus, isSelected, onClick }) {
  const normalizedStatus = String(bus.status || '').toLowerCase();
  const cfg = normalizedStatus.includes('active')
    ? STATUS_CONFIG.Active
    : normalizedStatus.includes('maintenance')
      ? STATUS_CONFIG.Maintenance
      : STATUS_CONFIG.Inactive;

  return (
    <div
      className={`bus-row${isSelected ? ' bus-row--selected' : ''}`}
      onClick={() => onClick(bus.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(bus.id)}
      aria-pressed={isSelected}
    >
      <span className="bus-row__number">
        {bus.busId}
        <span className="bus-row__route"> ({bus.route})</span>
      </span>
      <span
        className="bus-row__status"
        style={{ color: cfg.color, background: cfg.bg }}
      >
        {cfg.label}
      </span>
    </div>
  );
}
