import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function MapView({ buses = [] }) {
  const normalizedBuses = Array.isArray(buses) ? buses : [];

  const getMarkerColor = (status) => {
    const normalizedStatus = String(status || '').toLowerCase();
    switch (normalizedStatus) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
      case 'pending (gps)':
      default:
        return '#f44336';
    }
  };

  const createIcon = (color) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚌</div>`,
      iconSize: [30, 30],
      className: 'custom-marker',
    });
  };

  const defaultCenter = [12.9165, 79.1325];
  const initialCenter = normalizedBuses.length > 0 && Number.isFinite(normalizedBuses[0].latitude) && Number.isFinite(normalizedBuses[0].longitude)
    ? [normalizedBuses[0].latitude, normalizedBuses[0].longitude]
    : defaultCenter;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer center={initialCenter} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {normalizedBuses.map((bus) => {
          const latitude = Number(bus.latitude);
          const longitude = Number(bus.longitude);

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
          }

          return (
            <Marker
              key={bus.id}
              position={[latitude, longitude]}
              icon={createIcon(getMarkerColor(bus.status))}
            >
              <Popup>
                <div style={{ fontSize: '13px', color: '#2d3748', minWidth: '200px', fontFamily: 'Inter, Arial, sans-serif', padding: '2px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', borderBottom: '1px solid #edf2f7', paddingBottom: '6px', color: '#2c3e50', fontWeight: 'bold' }}>
                    {bus.busId} - {bus.route}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
                    <div><span style={{ color: '#718096', fontWeight: '500' }}>Bus Number:</span> <span style={{ fontWeight: '600' }}>{bus.busNo}</span></div>
                    <div><span style={{ color: '#718096', fontWeight: '500' }}>Driver:</span> <span style={{ fontWeight: '600' }}>{bus.driver}</span></div>
                    <div><span style={{ color: '#718096', fontWeight: '500' }}>Route:</span> <span style={{ fontWeight: '600' }}>{bus.route}</span></div>
                    <div>
                      <span style={{ color: '#718096', fontWeight: '500' }}>Status:</span>{' '}
                      <span style={{ color: getMarkerColor(bus.status), fontWeight: 'bold' }}>
                        {String(bus.status || '').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
