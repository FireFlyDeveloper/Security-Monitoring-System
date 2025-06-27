'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import "../globals.css";
import ActivityLogs from '../logs/page';
import UserSettings from '../user/page';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [devices, setDevices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(null);
  const [showConfirmCalibrate, setShowConfirmCalibrate] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({ name: '', mac: '' });
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const fetchDevices = async () => {
      try {
        const response = await fetch('/api/device/get');
        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setDevices(data.devices || []);
        } else {
          console.error('Failed to fetch devices:', response.statusText);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();

    const intervalId = setInterval(fetchDevices, 10000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/status`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, mac, timestamp } = message;
        setDevices(prevDevices =>
          prevDevices.map(device =>
            device.mac.toLowerCase() === mac.toLowerCase()
              ? { ...device, status: type, lastUpdated: timestamp }
              : device
          )
        );
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const toggleMonitoring = (id) => {
    setDevices(devices.map(device =>
      device.id === id ? { ...device, monitoring: !device.monitoring } : device
    ));
  };

  const removeDevice = (id) => {
    const removeDevice = async () => {
      try {
        const response = await fetch("/api/device/remove", {
          method: "POST",
          body: JSON.stringify({ ids: [id] }),
        });

        if (!response.ok) {
          alert("Failed to remove device. Please try again.");
        }

        setDevices(devices.filter(device => device.id !== id));
        setShowConfirmRemove(null);
      } catch (error) {
        console.error('Error removing device:', error);
      }
    }

    removeDevice();
  };

  const calibrateDevice = async (id) => {
    try {
      const deviceToCalibrate = devices.find((device) => device.id === id);

      if (!deviceToCalibrate) {
        return alert("Device not found.");
      }

      const response = await fetch("/api/device/calibrate", {
        method: "POST",
        body: JSON.stringify({ mac: deviceToCalibrate.mac }),
      });

      if (!response.ok) {
        return alert("Failed to calibrate device. Please try again.");
      }

      setDevices(devices.map(device =>
        device.id === id
          ? { ...device, lastUpdated: 'Just now', status: 'in-position' }
          : device
      ));
      setShowConfirmCalibrate(null);
    } catch (error) {
      console.error('Error calibrating device:', error);
    }
  };

  const saveEdit = () => {
    const updateDevice = async () => {
      try {
        const deviceToUpdate = devices.find((device) => device.id === editingDevice.id);

        const response = await fetch('/api/device/update', {
          method: 'POST',
          body: JSON.stringify({
            mac: deviceToUpdate.mac,
            name: editingDevice.name
          }),
        });

        if (!response.ok) {
          alert("Failed to edit device. Please try again.");
        }

        setDevices(devices.map(device =>
          device.id === editingDevice.id ? { ...device, name: editingDevice.name } : device
        ));
        setEditingDevice(null);
      } catch (error) {
        console.error('Error editing device:', error);
      }
    };

    updateDevice();
  };

  const addDevice = () => {
    const requestAddDevice = async () => {
      try {
        const response = await fetch('/api/device/add', {
          method: 'POST',
          body: JSON.stringify(newDevice),
        });

        if (!response.ok) {
          alert('Failed to add device. Please try again.');
        }

        const data = await response.json();
        for (const device of data.device.devices) {
          setDevices([...devices, {
            id: device.id,
            name: device.name,
            mac: device.mac,
            lastUpdated: device.lastUpdated,
            status: device.status,
            monitoring: device.monitoring
          }]);
          setNewDevice({ name: '', mac: '' });
          setShowAddModal(false);
        }

      } catch (error) {
        console.error('Error adding device:', error);
      }
    }

    requestAddDevice();
  };

  const resolveDevice = (id) => {
    setDevices(devices.map(device =>
      device.id === id ? { ...device, status: 'resolved' } : device
    ));
  };

  const statusConfig = {
    'in-position': {
      text: 'In Position',
      color: 'bg-green-500/20 border-green-500 text-green-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </motion.svg>
      )
    },
    'warning': {
      text: 'Warning: Not in Position',
      color: 'bg-amber-500/20 border-amber-500 text-amber-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </motion.svg>
      )
    },
    'critical': {
      text: 'Critical: Offline',
      color: 'bg-red-500/20 border-red-500 text-red-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </motion.svg>
      )
    },
    'training_progress': {
      text: 'Training in Progress',
      color: 'bg-purple-500/20 border-purple-500 text-purple-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </motion.svg>
      )
    },
    'training_initiated': {
      text: 'Training Initiated',
      color: 'bg-indigo-500/20 border-indigo-500 text-indigo-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </motion.svg>
      )
    },
    'devices_refreshed': {
      text: 'Devices Refreshed',
      color: 'bg-teal-500/20 border-teal-500 text-teal-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </motion.svg>
      )
    },
    'devices_updated': {
      text: 'Devices Updated',
      color: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </motion.svg>
      )
    },
    'train_error': {
      text: 'Training Error',
      color: 'bg-rose-500/20 border-rose-500 text-rose-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ x: [0, -3, 3, 0] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </motion.svg>
      )
    },
    'refresh_error': {
      text: 'Refresh Error',
      color: 'bg-orange-500/20 border-orange-500 text-orange-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </motion.svg>
      )
    },
    'not-configured': {
      text: 'Not Configured',
      color: 'bg-gray-500/20 border-gray-500 text-gray-400',
      icon: (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </motion.svg>
      )
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-gray-100 flex flex-col"
    >
      {/* University Header */}
      <motion.header
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-[#b30000] py-3 px-6 shadow-md"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/batstateu-logo.png"
              alt="Batangas State University Logo"
              className="h-12 mr-4"
              width={55}
              height={50}
            />
            <div>
              <h2 className="font-bold text-white">Batangas State University</h2>
              <p className="text-sm text-red-100">Laptop Position Monitoring System</p>
            </div>
          </div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm text-red-100">Admin Dashboard</span>
            <motion.button
              className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <motion.nav
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-64 bg-gray-900 border-r border-gray-800 p-6"
        >
          <div className="space-y-2">
            {['dashboard', 'logs', 'users'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === tab ? 'bg-red-900/50 text-red-300' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {tab === 'dashboard' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  )}
                  {tab === 'logs' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  )}
                  {tab === 'users' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  )}
                </svg>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold tracking-tight text-gray-100"
                >
                  Laptop Position Monitoring
                </motion.h1>
                <motion.button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center text-white font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Laptop
                </motion.button>
              </div>

              {/* Devices Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {devices.map((device) => (
                  <motion.div
                    key={device.id}
                    className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
                    variants={itemVariants}
                    layout
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Laptop visualization */}
                      <div className="w-full max-w-xs">
                        {/* Laptop base */}
                        <div className="mx-auto w-3/4 bg-gray-800 rounded-lg rounded-b-none h-32 border-2 border-gray-700 border-b-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            {/* Security status indicator */}
                            <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center border-4 animate-pulse ${statusConfig[device.status].color}`}>
                              {statusConfig[device.status].icon}
                            </div>
                            {editingDevice?.id === device.id ? (
                              <input
                                type="text"
                                value={editingDevice.name}
                                onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-center"
                              />
                            ) : (
                              <p className="text-lg font-medium text-gray-200">{device.name}</p>
                            )}
                            <p className="text-sm text-gray-400 mt-1">{statusConfig[device.status].text}</p>
                          </div>
                        </div>
                        {/* Laptop screen */}
                        <div className="mx-auto w-full bg-gray-700 rounded-t-lg h-6 border-2 border-gray-700 border-b-0"></div>
                        {/* Device info */}
                        <div className="mt-4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Device Details
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              MAC: {device.mac}
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Last Update: {new Date(device.lastUpdated).toLocaleString()}
                            </li>
                            <li className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Monitoring:
                              <motion.button
                                onClick={() => toggleMonitoring(device.id)}
                                className={`relative inline-flex h-5 w-9 ml-2 items-center rounded-full ${device.monitoring ? 'bg-red-600' : 'bg-gray-600'
                                  }`}
                                whileTap={{ scale: 0.9 }}
                              >
                                <motion.span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${device.monitoring ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  layout
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                              </motion.button>
                            </li>
                          </ul>
                        </div>
                        {/* Actions */}
                        <div className="mt-4 flex justify-center space-x-3">
                          {editingDevice?.id === device.id ? (
                            <>
                              <motion.button
                                onClick={saveEdit}
                                className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 rounded-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                Save
                              </motion.button>
                              <motion.button
                                onClick={() => setEditingDevice(null)}
                                className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300 rounded-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                Cancel
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                title="Edit"
                                onClick={() => setEditingDevice(device)}
                                className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </motion.button>
                              {(device.status === 'warning' || device.status === 'critical') && (
                                <motion.button
                                  title="Resolve"
                                  onClick={() => resolveDevice(device.id)}
                                  className="px-3 py-1 text-sm text-green-400 hover:text-green-300"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.button>
                              )}
                              <motion.button
                                title="Calibrate"
                                onClick={() => setShowConfirmCalibrate(device.id)}
                                className="px-3 py-1 text-sm text-amber-400 hover:text-amber-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m6 4v2m0-2V4" />
                                </svg>
                              </motion.button>
                              <motion.button
                                title="Remove"
                                onClick={() => setShowConfirmRemove(device.id)}
                                className="px-3 py-1 text-sm text-red-400 hover:text-red-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          { activeTab == 'logs' && <ActivityLogs /> }

          { activeTab == 'users' && <UserSettings /> }
        </main>
      </div>

      {/* Add Device Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-8 w-full max-w-md shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h3
                  className="text-xl font-bold text-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Add New Laptop
                </motion.h3>
                <motion.button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Laptop Name</label>
                  <motion.input
                    type="text"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Laptop-05"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">MAC Address</label>
                  <motion.input
                    type="text"
                    value={newDevice.mac}
                    onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 00:1A:2B:3C:4D:5H"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </motion.div>
              <motion.div
                className="mt-8 flex justify-end space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={addDevice}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                  disabled={!newDevice.name || !newDevice.mac}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Laptop
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {showConfirmRemove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-8 w-full max-w-md shadow-lg"
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </motion.svg>
                <motion.h3
                  className="mt-4 text-xl font-bold text-gray-100"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                >
                  Remove Laptop
                </motion.h3>
                <motion.p
                  className="mt-3 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Are you sure you want to remove this laptop? This action cannot be undone.
                </motion.p>
              </motion.div>
              <motion.div
                className="mt-8 flex justify-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowConfirmRemove(null)}
                  className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => removeDevice(showConfirmRemove)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibrate Confirmation Modal */}
      <AnimatePresence>
        {showConfirmCalibrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-8 w-full max-w-md shadow-lg"
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </motion.svg>
                <motion.h3
                  className="mt-4 text-xl font-bold text-gray-100"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                >
                  Calibrate Laptop
                </motion.h3>
                <motion.p
                  className="mt-3 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  This will reset the laptop&apos;s position tracking. Make sure the laptop is in its correct position before calibrating.
                </motion.p>
              </motion.div>
              <motion.div
                className="mt-8 flex justify-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowConfirmCalibrate(null)}
                  className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => calibrateDevice(showConfirmCalibrate)}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Calibrate
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}