'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ActivityLogs() {
  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const url = `/api/logs?page=${page}&filter=${filterType}&date=${filterDate}`;
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch alerts:', response.statusText);
          setAlerts([]);
          setTotal(0);
          return;
        }

        const data = await response.json();
        setAlerts(data.devices.alerts || []);
        setTotal(data.devices.total || 0);
        setItemsPerPage(data.devices.itemsPerPage || 20);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
        setTotal(0);
      }
    };

    fetchAlerts();
  }, [page, filterType, filterDate]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / itemsPerPage)) {
      setPage(newPage);
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleFilterTypeChange = (e) => {
    const newFilter = e.target.value;
    setFilterType(newFilter);
    setPage(1); // Reset to first page on filter change
    const params = new URLSearchParams(searchParams);
    params.set('filter', newFilter);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleFilterDateChange = (e) => {
    const newDate = e.target.value;
    setFilterDate(newDate);
    setPage(1); // Reset to first page on filter change
    const params = new URLSearchParams(searchParams);
    params.set('date', newDate);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const alertTypeDisplay = {
    'in-position': { label: 'In Position', color: 'bg-green-500 text-green-900' },
    warning: { label: 'Not in Position', color: 'bg-yellow-500 text-yellow-900' },
    critical: { label: 'Offline', color: 'bg-red-500 text-red-900' },
    training_progress: { label: 'Training Progress', color: 'bg-blue-500 text-blue-900' },
    training_initiated: { label: 'Training Initiated', color: 'bg-cyan-500 text-cyan-900' },
    devices_refreshed: { label: 'Devices Refreshed', color: 'bg-purple-500 text-purple-900' },
    'not-configured': { label: 'Not Configured', color: 'bg-gray-500 text-gray-900' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Activity Logs</h2>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</label>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Types</option>
            <option value="in-position">In Position</option>
            <option value="warning">Not in Position</option>
            <option value="critical">Offline</option>
            <option value="training_progress">Training Progress</option>
            <option value="training_initiated">Training Initiated</option>
            <option value="devices_refreshed">Devices Refreshed</option>
            <option value="not-configured">Not Configured</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleFilterDateChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Alerts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Event</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-400">
                  No alerts found.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <motion.tr
                  key={alert.id}
                  variants={itemVariants}
                  className="border-t border-gray-800"
                >
                  <td className="px-4 py-2">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">{alert.message || 'No message'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        alertTypeDisplay[alert.type]?.color || 'bg-gray-500 text-gray-900'
                      }`}
                    >
                      {alertTypeDisplay[alert.type]?.label || alert.type}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {total > itemsPerPage && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, total)} of {total} alerts
          </p>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              whileHover={{ scale: page === 1 ? 1 : 1.05 }}
              whileTap={{ scale: page === 1 ? 1 : 0.95 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * itemsPerPage >= total}
              className={`px-4 py-2 rounded-lg ${
                page * itemsPerPage >= total
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              whileHover={{ scale: page * itemsPerPage >= total ? 1 : 1.05 }}
              whileTap={{ scale: page * itemsPerPage >= total ? 1 : 0.95 }}
            >
              Next
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}