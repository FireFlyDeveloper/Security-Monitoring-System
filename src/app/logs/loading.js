'use client';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div
      className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 p-4 rounded-lg">
        Activity Logs
      </h2>

      {/* Skeleton for Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex-1">
          <div className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</div>
          <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1">
          <div className="block text-sm font-medium text-gray-300 mb-2">Filter by Date</div>
          <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton for Alerts Table */}
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
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-600 mr-2"></div>
                    <div className="w-32 h-4 bg-gray-600 rounded"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-48 h-4 bg-gray-600 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-4 bg-gray-600 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Skeleton for Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="w-40 h-4 bg-gray-600 rounded mb-2 sm:mb-0"></div>
        <div className="flex space-x-2">
          <div className="w-24 h-10 bg-gray-600 rounded-lg"></div>
          <div className="w-24 h-10 bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    </motion.div>
  );
}