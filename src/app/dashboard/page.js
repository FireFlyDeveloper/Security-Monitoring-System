'use client';
import { useState } from 'react';
import "../globals.css";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [devices, setDevices] = useState([
    { id: 1, name: 'Laptop-01', mac: '00:1A:2B:3C:4D:5E', lastUpdated: '2 mins ago', status: 'in-position', monitoring: true },
    { id: 2, name: 'Laptop-02', mac: '00:1A:2B:3C:4D:5F', lastUpdated: '5 mins ago', status: 'warning', monitoring: true },
    { id: 3, name: 'Laptop-03', mac: '00:1A:2B:3C:4D:5G', lastUpdated: '10 mins ago', status: 'critical', monitoring: true },
    { id: 4, name: 'Laptop-04', mac: '00:1A:2B:3C:4D:5H', lastUpdated: '1 min ago', status: 'resolved', monitoring: true },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(null);
  const [showConfirmCalibrate, setShowConfirmCalibrate] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({ name: '', mac: '' });

  const toggleMonitoring = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, monitoring: !device.monitoring } : device
    ));
  };

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
    setShowConfirmRemove(null);
  };

  const calibrateDevice = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, lastUpdated: 'Just now', status: 'in-position' } : device
    ));
    setShowConfirmCalibrate(null);
  };

  const saveEdit = () => {
    setDevices(devices.map(device => 
      device.id === editingDevice.id ? { ...device, name: editingDevice.name } : device
    ));
    setEditingDevice(null);
  };

  const addDevice = () => {
    const newId = devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1;
    setDevices([...devices, {
      id: newId,
      name: newDevice.name,
      mac: newDevice.mac,
      lastUpdated: 'Just added',
      status: 'in-position',
      monitoring: true
    }]);
    setNewDevice({ name: '', mac: '' });
    setShowAddModal(false);
  };

  const resolveDevice = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status: 'resolved' } : device
    ));
  };

  const statusConfig = {
    'in-position': {
      text: 'In Position',
      color: 'bg-green-900/50 text-green-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    'warning': {
      text: 'Warning: Not in Position',
      color: 'bg-amber-900/50 text-amber-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    'critical': {
      text: 'Critical: Not in Position',
      color: 'bg-red-900/50 text-red-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    'resolved': {
      text: 'Resolved: Back in Position',
      color: 'bg-blue-900/50 text-blue-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* University Header */}
      <header className="bg-[#b30000] py-3 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/batstateu-logo.png" 
              alt="Batangas State University Logo" 
              className="h-12 mr-4"
            />
            <div>
              <h2 className="font-bold text-white">Batangas State University</h2>
              <p className="text-sm text-red-100">Laptop Position Monitoring System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-red-100">Admin User</span>
            <button className="p-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-red-900/50 text-red-300' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'logs' ? 'bg-red-900/50 text-red-300' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Activity Logs
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-red-900/50 text-red-300' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              User Management
            </button>
          </div>
        </nav>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Laptop Position Monitoring</h1>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Laptop
              </button>
            </div>

            {/* Devices Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Laptop</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">MAC Address</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Update</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monitoring</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {devices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              {editingDevice?.id === device.id ? (
                                <input
                                  type="text"
                                  value={editingDevice.name}
                                  onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
                                />
                              ) : (
                                <div className="text-sm font-medium text-gray-100">{device.name}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{device.mac}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{device.lastUpdated}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[device.status].color}`}>
                            {statusConfig[device.status].icon}
                            <span className="ml-1">{statusConfig[device.status].text}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleMonitoring(device.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              device.monitoring ? 'bg-red-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                device.monitoring ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {editingDevice?.id === device.id ? (
                              <>
                                <button 
                                  onClick={saveEdit}
                                  className="text-green-400 hover:text-green-300"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingDevice(null)}
                                  className="text-gray-400 hover:text-gray-300"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => setEditingDevice(device)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  Edit
                                </button>
                                {device.status === 'warning' || device.status === 'critical' ? (
                                  <button 
                                    onClick={() => resolveDevice(device.id)}
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    Resolve
                                  </button>
                                ) : null}
                                <button 
                                  onClick={() => setShowConfirmCalibrate(device.id)}
                                  className="text-amber-400 hover:text-amber-300"
                                >
                                  Calibrate
                                </button>
                                <button 
                                  onClick={() => setShowConfirmRemove(device.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Laptop</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Laptop Name</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Laptop-05"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">MAC Address</label>
                <input
                  type="text"
                  value={newDevice.mac}
                  onChange={(e) => setNewDevice({...newDevice, mac: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., 00:1A:2B:3C:4D:5H"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={addDevice}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                disabled={!newDevice.name || !newDevice.mac}
              >
                Add Laptop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showConfirmRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-3 text-lg font-medium">Remove Laptop</h3>
              <p className="mt-2 text-gray-400">Are you sure you want to remove this laptop? This action cannot be undone.</p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setShowConfirmRemove(null)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => removeDevice(showConfirmRemove)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calibrate Confirmation Modal */}
      {showConfirmCalibrate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="mt-3 text-lg font-medium">Calibrate Laptop</h3>
              <p className="mt-2 text-gray-400">This will reset the laptop's position tracking. Make sure the laptop is in its correct position before calibrating.</p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setShowConfirmCalibrate(null)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => calibrateDevice(showConfirmCalibrate)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white"
              >
                Calibrate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}