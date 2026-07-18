import { useState } from 'react';
import { Bus, Radio, GraduationCap, Map, TrendingUp, AlertTriangle, X, Maximize2 } from 'lucide-react';
import MapView from '../components/MapView';
import BusList from '../components/BusList';
import BusInfoCard from '../components/BusInfoCard';
import './Dashboard.css';

function KpiCard({ variant, icon: Icon, iconColor, label, value, sub, trend, trendType }) {
  return (
    <div className={`kpi-card kpi-card--${variant}`}>
      <div className="kpi-card__top">
        <span className="kpi-card__label">{label}</span>
        <div className="kpi-card__icon">
          <Icon size={18} color={iconColor} strokeWidth={2} />
        </div>
      </div>
      <div className="kpi-card__value">{value}</div>
      <div className="kpi-card__sub">
        {trend && (
          <span className={`kpi-card__trend kpi-card__trend--${trendType}`}>
            {trendType === 'up'
              ? <TrendingUp size={11} />
              : <AlertTriangle size={11} />}
            {' '}{trend}
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard page
───────────────────────────────────────── */
export default function Dashboard({ buses = [] }) {
  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => String(b.status || '').toLowerCase() === 'active').length;
  const offline = buses.filter((b) => {
    const status = String(b.status || '').toLowerCase();
    return status === 'inactive' || status === 'pending (gps)';
  }).length;
  const idle = buses.filter((b) => String(b.status || '').toLowerCase() === 'maintenance').length;

  const [stats] = useState({
    totalStudents: 2184,
  });

  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Lifted from BusList — shared with BusInfoCard.
  const [selectedId, setSelectedId] = useState(null);
  const handleSelect = (id) => setSelectedId((prev) => (prev === id ? null : id));
  const selectedBus = buses.find((b) => b.id === selectedId) ?? null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="dashboard-content">
      <div className="dash-header">
        <p className="dash-title">
          Overview of fleet activity for <strong style={{ color: '#4a5568' }}>{today}</strong>
        </p>
      </div>

      <div className="dash-grid">
        <div className="dash-left">
          <div className="kpi-row">
            <KpiCard
              variant="total"
              icon={Bus}
              iconColor="#3498db"
              label="Total Buses"
              value={totalBuses}
              trend="+2 this month"
              trendType="up"
              sub="Fleet registered"
            />
            <KpiCard
              variant="active"
              icon={Radio}
              iconColor="#2d9e5f"
              label="Active Now"
              value={activeBuses}
              sub={`${idle} idle · ${offline} offline`}
            />
            <KpiCard
              variant="students"
              icon={GraduationCap}
              iconColor="#6d28d9"
              label="Total Students"
              value={stats.totalStudents.toLocaleString()}
              trend="Across 12 routes"
              trendType="up"
              sub=""
            />
          </div>

          <div className="map-card">
            <div className="map-card__header">
              <div className="map-card__title">
                <div className="map-card__title-icon">
                  <Map size={15} color="#ffffff" strokeWidth={2} />
                </div>
                <h2>Live Fleet Map</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="map-legend">
                  <div className="map-legend__item">
                    <div className="map-legend__dot" style={{ background: '#4CAF50' }} />
                    Active
                  </div>
                  <div className="map-legend__item">
                    <div className="map-legend__dot" style={{ background: '#f44336' }} />
                    Inactive
                  </div>
                </div>
                <button
                  className="map-expand-btn"
                  title="Expand map"
                  onClick={() => setIsMapFullscreen(true)}
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
            <div
              className="map-card__body map-card__body--clickable"
              onClick={() => setIsMapFullscreen(true)}
              title="Click to expand map"
            >
              <MapView buses={buses} />
              <div className="map-card__expand-hint">Click to expand</div>
            </div>
          </div>

          {isMapFullscreen && (
            <div className="map-fullscreen-overlay" onClick={() => setIsMapFullscreen(false)}>
              <div className="map-fullscreen-inner" onClick={(e) => e.stopPropagation()}>
                <button
                  className="map-fullscreen-close"
                  onClick={() => setIsMapFullscreen(false)}
                  title="Close fullscreen"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
                <div className="map-fullscreen-header">
                  <div className="map-card__title">
                    <div className="map-card__title-icon">
                      <Map size={15} color="#ffffff" strokeWidth={2} />
                    </div>
                    <h2>Live Fleet Map</h2>
                  </div>
                  <div className="map-legend">
                    <div className="map-legend__item">
                      <div className="map-legend__dot" style={{ background: '#4CAF50' }} />
                      Active
                    </div>
                    <div className="map-legend__item">
                      <div className="map-legend__dot" style={{ background: '#f44336' }} />
                      Inactive
                    </div>
                  </div>
                </div>
                <div className="map-fullscreen-body">
                  <MapView buses={buses} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dash-right">
          <BusList buses={buses} selectedId={selectedId} onSelect={handleSelect} />
          <BusInfoCard bus={selectedBus} />
        </div>
      </div>
    </div>
  );
}
