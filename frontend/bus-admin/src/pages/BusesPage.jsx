import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { createBus, deleteBus as deleteBusRequest, updateBus } from '../services/busService';

const BusesPage = ({ buses = [], setBuses, refreshBuses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [feedback, setFeedback] = useState('');

  const emptyForm = { busId: '', route: '', busNo: '', driver: '', contact: '', license: '', capacity: '' };
  const [formData, setFormData] = useState(emptyForm);

  const handleSave = async () => {
    setFeedback('');
    const normalizedData = {
      ...formData,
      busId: formData.busId || formData.bus_number || '',
      route: formData.route || formData.route_name || '',
      busNo: formData.busNo || formData.registration_number || '',
      driver: formData.driver || formData.driver_name || '',
      contact: formData.contact || formData.driver_phone || '',
      license: formData.license || formData.license_number || '',
      capacity: formData.capacity || formData.capacity || '',
      status: editingBus?.status || 'Pending (GPS)',
    };

    try {
      let savedBus;
      if (editingBus) {
        savedBus = await updateBus(editingBus.id, normalizedData);
      } else {
        savedBus = await createBus(normalizedData);
      }

      if (setBuses) {
        setBuses((prevBuses) => {
          if (editingBus) {
            return prevBuses.map((bus) => (bus.id === editingBus.id ? savedBus : bus));
          }
          return [...prevBuses, savedBus];
        });
      }

      if (refreshBuses) {
        await refreshBuses();
      }
      setIsModalOpen(false);
      setEditingBus(null);
      setFormData({ ...emptyForm });
    } catch (error) {
      console.error('Error saving bus:', error);
      setFeedback(error?.response?.data?.message || 'Unable to save the bus right now.');
    }
  };

  const deleteBus = async (id) => {
    setFeedback('');
    try {
      await deleteBusRequest(id);
      if (setBuses) {
        setBuses((prevBuses) => prevBuses.filter((bus) => bus.id !== id));
      }

      if (refreshBuses) {
        await refreshBuses();
      }
    } catch (error) {
      console.error('Error deleting bus:', error);
      setFeedback(error?.response?.data?.message || 'Unable to delete the bus right now.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buses</h1>
        <button
          onClick={() => {
            setFormData({ ...emptyForm });
            setEditingBus(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
        >
          <Plus size={18} /> Add Bus
        </button>
      </div>

      {feedback && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {feedback}
        </div>
      )}

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-center table-fixed border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
            <tr>
              {['Bus ID', 'Route', 'Bus No', 'Driver', 'Contact', 'License', 'Status', 'Capacity', 'Action'].map((header) => (
                <th key={header} className="p-3 border">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-50">
                <td className="p-3 border font-semibold text-gray-700">{bus.busId}</td>
                <td className="p-3 border">{bus.route}</td>
                <td className="p-3 border">{bus.busNo}</td>
                <td className="p-3 border">{bus.driver}</td>
                <td className="p-3 border">{bus.contact}</td>
                <td className="p-3 border">{bus.license}</td>
                <td className="p-3 border font-medium text-gray-600">{bus.status}</td>
                <td className="p-3 border">{bus.capacity}</td>
                <td className="p-3 border">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setEditingBus(bus);
                        setFormData(bus);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:scale-115 transition-transform"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteBus(bus.id)}
                      className="text-red-500 hover:scale-115 transition-transform"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingBus ? 'Edit Bus' : 'Add Bus'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Bus ID" onChange={(e) => setFormData({ ...formData, busId: e.target.value })} value={formData.busId} />
              <input className="border p-2 rounded" placeholder="Route" onChange={(e) => setFormData({ ...formData, route: e.target.value })} value={formData.route} />
              <input className="border p-2 rounded" placeholder="Bus No" onChange={(e) => setFormData({ ...formData, busNo: e.target.value })} value={formData.busNo} />
              <input className="border p-2 rounded" placeholder="Driver" onChange={(e) => setFormData({ ...formData, driver: e.target.value })} value={formData.driver} />
              <input className="border p-2 rounded" placeholder="Contact" onChange={(e) => setFormData({ ...formData, contact: e.target.value })} value={formData.contact} />
              <input className="border p-2 rounded" placeholder="License" onChange={(e) => setFormData({ ...formData, license: e.target.value })} value={formData.license} />
              <input className="border p-2 rounded col-span-2" placeholder="Capacity" type="number" onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} value={formData.capacity} />
            </div>
            <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 mt-4 rounded font-bold transition-colors">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusesPage;