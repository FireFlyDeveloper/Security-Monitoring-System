'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/logs');
        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
        } else {
          console.error('Failed to fetch logs:', response.statusText);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
    const intervalId = setInterval(fetchLogs, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold tracking-tight text-gray-100 mb-8">
        Activity Logs
      </h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs available.</p>
        ) : (
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3">Timestamp</th>
                <th className="py-3">Device</th>
                <th className="py-3">Event</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-800"
                >
                  <td className="py-3">{log.timestamp}</td>
                  <td className="py-3">{log.deviceName}</td>
                  <td className="py-3">{log.event}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}