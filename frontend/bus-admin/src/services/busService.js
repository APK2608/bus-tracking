import API from './api';

const formatStatus = (status) => {
  const normalizedStatus = String(status || '').trim().toLowerCase();

  if (!normalizedStatus) return 'Inactive';
  if (normalizedStatus === 'active') return 'Active';
  if (normalizedStatus === 'inactive') return 'Inactive';
  if (normalizedStatus.includes('maintenance')) return 'Maintenance';
  if (normalizedStatus.includes('pending')) return 'Pending (GPS)';

  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
};

const mapBus = (bus) => ({
  id: bus.id,
  busId: bus.bus_number || `BUS-${bus.id}`,
  route: bus.route_name || 'N/A',
  routeName: bus.route_name || 'N/A',
  busNo: bus.registration_number || 'N/A',
  registrationNumber: bus.registration_number || 'N/A',
  driver: bus.driver_name || 'N/A',
  contact: bus.driver_phone || 'N/A',
  driverPhone: bus.driver_phone || 'N/A',
  license: bus.license_number || 'N/A',
  capacity: bus.capacity ?? 52,
  status: formatStatus(bus.status),
  latitude: Number(bus.latitude),
  longitude: Number(bus.longitude),
});

const mapToBackend = (bus) => ({
  bus_number: bus.busId || bus.bus_number || null,
  registration_number: bus.busNo || bus.registration_number || null,
  driver_name: bus.driver || bus.driver_name || null,
  driver_phone: bus.contact || bus.driver_phone || null,
  route_name: bus.route || bus.route_name || null,
  status: String(bus.status || 'active').toLowerCase(),
  latitude: bus.latitude ?? null,
  longitude: bus.longitude ?? null,
  license_number: bus.license || bus.license_number || null,
  capacity: bus.capacity ?? null,
});

export const getBuses = async () => {
  const response = await API.get('/buses');
  return response.data.map(mapBus);
};

export const createBus = async (bus) => {
  const response = await API.post('/buses', mapToBackend(bus));
  return mapBus(response.data.data ?? response.data);
};

export const updateBus = async (id, bus) => {
  const response = await API.put(`/buses/${id}`, mapToBackend(bus));
  return mapBus(response.data.data ?? response.data);
};

export const deleteBus = async (id) => {
  const response = await API.delete(`/buses/${id}`);
  return response.data;
};