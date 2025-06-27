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
    'in-position': { 
      label: 'In Position', 
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-300',
      dotColor: 'bg-emerald-500'
    },
    warning: { 
      label: 'Not in Position', 
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
      dotColor: 'bg-amber-500'
    },
    critical: { 
      label: 'Offline', 
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      dotColor: 'bg-red-500'
    },
    training_progress: { 
      label: 'Training Progress', 
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      dotColor: 'bg-blue-500'
    },
    training_initiated: { 
      label: 'Training Initiated', 
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-800',
      borderColor: 'border-cyan-300',
      dotColor: 'bg-cyan-500'
    },
    devices_refreshed: { 
      label: 'Devices Refreshed', 
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
      dotColor: 'bg-purple-500'
    },
    'not-configured': { 
      label: 'Not Configured', 
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      dotColor: 'bg-gray-500'
    },
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
      <h2 className="text-2xl font-bold text-white mb-6 p-4 rounded-lg">
        Activity Logs
      </h2>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</label>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Alerts Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
        <table className="min-w-full text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Timestamp</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Message</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Event</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                  No alerts found.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const alertType = alertTypeDisplay[alert.type] || {
                  bgColor: 'bg-gray-100',
                  textColor: 'text-gray-800',
                  borderColor: 'border-gray-300',
                  dotColor: 'bg-gray-500',
                  label: alert.type
                };
                
                return (
                  <motion.tr
                    key={alert.id}
                    variants={itemVariants}
                    className="hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${alertType.dotColor}`}></div>
                        <span className="text-gray-200">
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-200">{alert.message || 'No message'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${alertType.bgColor} ${alertType.textColor} border ${alertType.borderColor}`}
                      >
                        {alertType.label}
                      </span>
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {total > itemsPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-2 sm:mb-0">
            Showing <span className="font-medium text-white">{(page - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium text-white">{Math.min(page * itemsPerPage, total)}</span> of{' '}
            <span className="font-medium text-white">{total}</span> alerts
          </p>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg flex items-center ${
                page === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              whileHover={{ scale: page === 1 ? 1 : 1.05 }}
              whileTap={{ scale: page === 1 ? 1 : 0.95 }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </motion.button>
            <motion.button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * itemsPerPage >= total}
              className={`px-4 py-2 rounded-lg flex items-center ${
                page * itemsPerPage >= total
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              whileHover={{ scale: page * itemsPerPage >= total ? 1 : 1.05 }}
              whileTap={{ scale: page * itemsPerPage >= total ? 1 : 0.95 }}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}