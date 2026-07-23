import { useMemo, useRef, useState } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

// Base coordinates for Vellore, Tamil Nadu
const BASE_LAT = 12.9165;
const BASE_LNG = 79.1325;

/**
 * Generates a deterministic lat/lng position for a bus based on its index.
 * Uses a 5-column grid so buses don't overlap across the Vellore area.
 */
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

const getBusLabel = (bus, index) => {
  if (!bus) return `Bus ${index + 1}`;
  if (bus.busId) return `Bus ${String(bus.busId).padStart(2, '0')}`;
  if (bus.busNo) return bus.busNo;
  return bus.route || `Bus ${index + 1}`;
};

/** Closes the info panel when the map background is clicked */
function BusInfoPanel({ bus, label, onClose }) {
  if (!bus) return null;
  const color = getMarkerColor(bus.status);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
        padding: '14px 16px 12px',
        minWidth: '260px',
        maxWidth: '320px',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        border: '1px solid #e2e8f0',
        pointerEvents: 'auto',
        animation: 'busInfoFadeIn 0.18s ease',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', color: '#fff',
            border: '2px solid #fff',
            boxShadow: `0 0 0 2px ${color}40`,
            flexShrink: 0,
          }}>🚌</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a202c', lineHeight: 1.2 }}>{label}</div>
            <div style={{ fontSize: '10px', color: '#718096', marginTop: '1px' }}>{bus.route || '—'}</div>
          </div>
        </div>
        {/* Close button */}
        <button
          onClick={onClose}
          title="Close"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#a0aec0', fontSize: '18px', lineHeight: 1,
            padding: '2px 4px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#4a5568'}
          onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}
        >
          ×
        </button>
      </div>

      {/* Status badge */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{
          display: 'inline-block',
          background: color + '1a',
          color: color,
          border: `1px solid ${color}55`,
          borderRadius: '999px',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 10px',
          letterSpacing: '0.04em',
        }}>
          {(bus.status || 'Unknown').toUpperCase()}
        </span>
      </div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
        {[
          { label: 'Reg No', value: bus.number || bus.busNo || '—' },
          { label: 'Driver', value: bus.driver || '—' },
          { label: 'License', value: bus.license || '—' },
          { label: 'Capacity', value: bus.capacity || '—' },
        ].map(({ label: lbl, value }) => (
          <div key={lbl}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>{lbl}</div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#2d3748' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const mapContainerStyle = { width: '100%', height: '100%' };
const googleMapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
};

const getBusPositionOrFallback = (bus, index) => {
  if (bus.latitude != null && bus.longitude != null) {
    return { lat: Number(bus.latitude), lng: Number(bus.longitude) };
  }
  return getBusPosition(index);
};

export default function MapView({ buses = [] }) {
  const [selectedBusId, setSelectedBusId] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const selectedBus = buses.find((b) => b.id === selectedBusId) ?? null;
  const selectedIndex = buses.findIndex((b) => b.id === selectedBusId);

  const busMarkers = useMemo(
    () => buses.map((bus, index) => ({ bus, index, position: getBusPositionOrFallback(bus, index) })),
    [buses]
  );

  const center = selectedBus
    ? getBusPositionOrFallback(selectedBus, selectedIndex)
    : { lat: BASE_LAT, lng: BASE_LNG };

  const handleMarkerClick = (busId) => {
    setSelectedBusId((prev) => (prev === busId ? null : busId));
  };

  const handleMapClick = () => {
    setSelectedBusId(null);
  };

  const onLoad = (map) => {
    mapRef.current = map;
    if (busMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      busMarkers.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds, 50);
    }
  };

  if (loadError) {
    return <div style={{ padding: 20 }}>Unable to load Google Maps.</div>;
  }

  if (!isLoaded) {
    return <div style={{ padding: 20 }}>Loading map...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={googleMapOptions}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        {busMarkers.map(({ bus, index, position }) => {
          const color = getMarkerColor(bus.status);
          const label = getBusLabel(bus, index);
          const isSelected = bus.id === selectedBusId;
          const icon = {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            scale: isSelected ? 12 : 8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          };

          return (
            <MarkerF
              key={bus.id}
              position={position}
              icon={icon}
              label={{
                text: label,
                color: '#1d1d1d',
                fontSize: '12px',
                fontWeight: '600',
              }}
              onClick={() => handleMarkerClick(bus.id)}
            />
          );
        })}
      </GoogleMap>

      {selectedBus && (
        <BusInfoPanel
          bus={selectedBus}
          label={getBusLabel(selectedBus, selectedIndex)}
          onClose={() => setSelectedBusId(null)}
        />
      )}
    </div>
  );
}
