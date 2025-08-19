
"use client";
import React, { useEffect, useState } from "react";
import { getDashboardSummary, getRequests } from '../../../lib/api';
import { getToken } from '../../../lib/auth';

import { Bar, Line } from 'react-chartjs-2';



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const token = getToken();
        if (!token) return;
        try {
          const summaryData = await getDashboardSummary(token);
          setSummary(summaryData);
          const bookingsData = await getRequests(token);
          setBookings(bookingsData);
        } catch {
          setSummary(null);
          setBookings([]);
        }
      };
      fetchData();
    }, []);

    // Dynamic recent reports: show 5 most recent bookings
    const recentReports = bookings.slice(-5).reverse();

    // Dynamic chart data generation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bookingsPerMonth = Array(12).fill(0);
    const revenuePerMonth = Array(12).fill(0);
    bookings.forEach(b => {
      if (b.date && (typeof b.date === 'string' || typeof b.date === 'number' || b.date instanceof Date)) {
        const d = new Date(b.date);
        if (!isNaN(d.getTime())) {
          const m = d.getMonth();
          bookingsPerMonth[m] += 1;
          if (typeof b.amount === 'number') revenuePerMonth[m] += b.amount;
        }
      }
    });

    const revenueData = {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          data: revenuePerMonth,
          backgroundColor: '#2563eb',
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.6,
        },
      ],
    };
    const revenueOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#888' },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#E5E7EB' },
          ticks: { color: '#888', stepSize: 15000 },
          max: Math.max(...revenuePerMonth, 60000),
        },
      },
    };

    const bookingData = {
      labels: months,
      datasets: [
        {
          label: 'Bookings',
          data: bookingsPerMonth,
          borderColor: '#2563eb',
          backgroundColor: '#2563eb',
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#2563eb',
          fill: false,
        },
      ],
    };
    const bookingOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#888' },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#E5E7EB' },
          ticks: { color: '#888', stepSize: 1 },
          max: Math.max(...bookingsPerMonth, 10),
        },
      },
    };
        // end of chart config
      // removed duplicate/stray block

  return (
    <div className="space-y-6">
      <div className="font-semibold text-2xl text-gray-800">Reports</div>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <div className="text-gray-400 text-sm mb-1">Total Bookings</div>
          <div className="text-2xl font-bold text-black mb-1">{summary && typeof summary.total_bookings === 'number' ? summary.total_bookings : '-'}</div>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <div className="text-gray-400 text-sm mb-1">Total Slots</div>
          <div className="text-2xl font-bold text-black mb-1">{summary && typeof summary.total_slots === 'number' ? summary.total_slots : '-'}</div>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <div className="text-gray-400 text-sm mb-1">Pending Bookings</div>
          <div className="text-2xl font-bold text-black mb-1">{summary && typeof summary.pending === 'number' ? summary.pending : '-'}</div>
        </div>
        {/* Add more cards for other analytics if backend supports */}
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-gray-700 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>
          Jan 1, 2024 - Jan 31, 2024
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg>
          Export
        </button>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Trend (Bar Chart) */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="font-semibold text-lg mb-4 text-gray-800">Revenue Trend</div>
          <Bar data={revenueData} options={revenueOptions} height={200} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-lg text-gray-800">Booking Overview</div>
            <div className="text-xs text-green-500 font-semibold text-right">
              {/* Example: Growth +17.5% */}
              Growth<br />+17.5%
            </div>
          </div>
          <Line data={bookingData} options={bookingOptions} height={200} />
        </div>
      </div>
      {/* Recent Reports Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="font-semibold text-lg mb-4 text-gray-800">Recent Reports</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8FAFF] text-gray-400 text-left">
                <th className="py-3 px-4 font-medium rounded-tl-xl">Date</th>
                <th className="py-3 px-4 font-medium">Event Type</th>
                <th className="py-3 px-4 font-medium">Venue</th>
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Revenue</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {recentReports.map((report, idx) => (
                <tr key={typeof report.id === 'string' || typeof report.id === 'number' ? report.id : idx} className="hover:bg-gray-100 cursor-pointer">
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{typeof report.date === 'string' ? new Date(report.date).toLocaleDateString() : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{typeof report.details === 'string' ? report.details : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{typeof report.slot_id === 'string' || typeof report.slot_id === 'number' ? report.slot_id : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{typeof report.name === 'string' ? report.name : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{typeof report.amount === 'number' ? `₹${report.amount}` : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      report.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {typeof report.status === 'string' ? report.status : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}