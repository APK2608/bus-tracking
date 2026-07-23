/* ─────────────────────────────────────────────────────────
   TrackLocationView — Full-screen map overlay focused on a
   single selected bus.

   Props:
     bus      — the selected bus object (required)
     buses    — full bus array (needed to derive position by index)
     onClose  — callback to return to the dashboard
───────────────────────────────────────────────────────── */
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { X, Navigation } from 'lucide-react';

// ── Same constants used by MapView ───────────────────────
const BASE_LAT = 12.9165;
const BASE_LNG = 79.1325;

function getBusPosition(index) {
  const cols = 5;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const latStep = 0.018;
  const lngStep = 0.022;
  const latOffset = (row - 1) * latStep;
  const lngOffset = (col - 2) * lngStep;
  return {
    lat: BASE_LAT + latOffset,
    lng: BASE_LNG + lngOffset,
  };
}

const getMarkerColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active') return '#4CAF50';
  return '#f44336';
};

/** Inner component: centers + zooms the map to the target position */
function getBusPositionOrFallback(index, bus) {
  if (bus.latitude != null && bus.longitude != null) {
    return { lat: Number(bus.latitude), lng: Number(bus.longitude) };
  }
  return getBusPosition(index);
}

/** Status badge colors */
const STATUS_STYLES = {
  active: { bg: '#f0fff4', color: '#2d9e5f', border: '#c6f6d5' },
  inactive: { bg: '#fff5f5', color: '#c53030', border: '#fed7d7' },
  maintenance: { bg: '#fffaf0', color: '#c05621', border: '#feebc8' },
};

function getStatusStyle(status = '') {
  return STATUS_STYLES[(status || '').toLowerCase()] || STATUS_STYLES.inactive;
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */
export default function TrackLocationView({ bus, buses = [], onClose }) {
  if (!bus) return null;

  const busIndex = buses.findIndex((b) => b.id === bus.id);
  const { lat, lng } = getBusPosition(busIndex >= 0 ? busIndex : 0);
  const color = getMarkerColor(bus.status);
  const statusStyle = getStatusStyle(bus.status);

  const busLabel = bus.busId
    ? `Bus ${String(bus.busId).padStart(2, '0')}`
    : bus.busNo || bus.route || 'Bus';

  const busIdDisplay =
    bus.busId ||
    (bus.route && /^\d+-/.test(bus.route) ? bus.route.split('-')[0] : null) ||
    (bus.id && String(bus.id).length < 5 ? bus.id : bus.busNo);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = getBusPositionOrFallback(busIndex, bus);
  const markerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: 12,
    strokeColor: '#ffffff',
    strokeWeight: 3,
  };

  if (loadError) {
    return <div style={{ padding: 24 }}>Unable to load Google Maps</div>;
  }

  if (!isLoaded) {
    return <div style={{ padding: 24 }}>Loading map...</div>;
  }

  return (
    <div className="track-overlay">
      {/* Keyframes for pulse animation */}
      <style>{`
        @keyframes trackPulse {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div className="track-inner" onClick={(e) => e.stopPropagation()}>

        {/* ── Top header strip ── */}
        <div className="track-header">
          <div className="track-header__left">
            <div className="track-header__title">
              <div className="track-header__icon">
                <Navigation size={14} color="#ffffff" strokeWidth={2} />
              </div>
              <h2>Tracking &#8212; {busLabel}</h2>
            </div>
          </div>

          {/* Status badge */}
          <span
            className="track-status-badge"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {(bus.status || 'Unknown').toUpperCase()}
          </span>

          {/* Close X */}
          <button className="track-close-btn" onClick={onClose} title="Close">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="track-body">
          <div className="track-map-area">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={13}
              options={{ disableDefaultUI: true, clickableIcons: false }}
            >
              <MarkerF position={center} icon={markerIcon} />
            </GoogleMap>
          </div>

          {/* ── Side info panel ── */}
          <div className="track-info-panel">

            {/* Bus avatar + number */}
            <div className="track-info__hero">
              <div
                className="track-info__avatar"
                style={{ background: color }}
              >
                &#x1F68C;
              </div>
              <div>
                <div className="track-info__buslabel">{busLabel}</div>
                <div className="track-info__subroute">{bus.route || '&#8212;'}</div>
              </div>
            </div>

            {/* Info rows */}
            <div className="track-info__rows">
              {[
                { label: 'Bus ID', value: busIdDisplay },
                { label: 'Reg Number', value: bus.number || bus.busNo },
                { label: 'Route', value: bus.route },
                { label: 'Driver', value: bus.driver },
                { label: 'Contact', value: bus.driverPhone || bus.contact },
                { label: 'License', value: bus.license },
                { label: 'Capacity', value: bus.capacity ? `${bus.capacity} seats` : '—' },
              ].map(({ label, value }) => (
                <div className="track-info__row" key={label}>
                  <span className="track-info__label">{label}</span>
                  <span className="track-info__value">{value || '—'}</span>
                </div>
              ))}
            </div>

            {/* Coordinates */}
            <div className="track-info__coords">
              <div className="track-info__coords-header">
                <Navigation size={11} strokeWidth={2} />
                GPS Coordinates
              </div>
              <div className="track-info__coords-body">
                <span>Lat: <strong>{lat.toFixed(5)}</strong></span>
                <span>Lng: <strong>{lng.toFixed(5)}</strong></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
