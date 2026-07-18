/* ─────────────────────────────────────────────────────────
   BusInfoCard — "Bus Details" card below the Bus List
   Shows: Bus ID · Registration Number · Route · Driver Name ·
          Driver Contact · Status · Capacity
───────────────────────────────────────────────────────── */
import { Bus } from 'lucide-react';

function InfoRow({ label, value }) {
  return (
    <div className="bus-info__row">
      <span className="bus-info__label">{label}</span>
      <span className="bus-info__value">{value}</span>
    </div>
  );
}

export default function BusInfoCard({ bus }) {
  return (
    <div className="bus-info-card">
      <div className="bus-info-card__header">
        <div className="bus-info-card__title">
          <div className="bus-info-card__title-icon">
            <Bus size={15} color="#ffffff" strokeWidth={2} />
          </div>
          <h2>Bus Details</h2>
        </div>
        {bus && <span className="bus-info-card__badge">{bus.busId}</span>}
      </div>

      <div className="bus-info-card__body">
        {bus ? (
          <div className="bus-info__grid">
            <InfoRow label="Bus ID" value={bus.busId} />
            <InfoRow label="Registration Number" value={bus.busNo || bus.registrationNumber || 'N/A'} />
            <InfoRow label="Route" value={bus.route} />
            <InfoRow label="Driver Name" value={bus.driver} />
            <InfoRow label="Driver Contact" value={bus.contact || bus.driverPhone || 'N/A'} />
            <InfoRow label="Status" value={bus.status} />
            <InfoRow label="Capacity" value={`${bus.capacity} seats`} />
          </div>
        ) : (
          <div className="bus-info__empty">
            <div className="bus-info__empty-icon">
              <Bus size={28} color="#cbd5e0" strokeWidth={1.5} />
            </div>
            <p className="bus-info__empty-text">
              Select a bus from the Bus List to view its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
