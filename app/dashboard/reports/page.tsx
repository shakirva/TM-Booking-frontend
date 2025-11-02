"use client";
import React, { useEffect, useState } from "react";
import { getRequests } from '@/lib/api';
import { getToken } from '@/lib/auth';

import { Line, Doughnut } from 'react-chartjs-2';



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
  , ArcElement
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
  , ArcElement
);

export default function ReportsPage() {
  // Removed unused 'summary' state
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const token = getToken();
        if (!token) return;
        try {
          // Removed summary fetching and setting
          const bookingsData = await getRequests(token);
          setBookings(bookingsData);
        } catch {
          setBookings([]);
        }
      };
      fetchData();
    }, []);

  // Removed unused variable: recentReports

    // Dynamic chart data generation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bookingsPerMonth = Array(12).fill(0);
    const revenuePerMonth = Array(12).fill(0);
    if (Array.isArray(bookings)) {
      bookings.forEach(b => {
        if (b.date && (typeof b.date === 'string' || typeof b.date === 'number' || b.date instanceof Date)) {
          const d = new Date(b.date);
          if (!isNaN(d.getTime())) {
            const m = d.getMonth();
            bookingsPerMonth[m] += 1;
            if (typeof b.advance_amount === 'number') {
              revenuePerMonth[m] += b.advance_amount;
            } else if (typeof b.amount === 'number') {
              revenuePerMonth[m] += b.amount;
            }
          }
        }
      });
    }

    // Calculate bookings by payment mode for doughnut chart
    const paymentModes = ['bank', 'cash', 'upi'];
    const paymentModeCounts = paymentModes.map(mode =>
      Array.isArray(bookings) ? bookings.filter(b => b.payment_mode === mode).length : 0
    );
    const doughnutData = {
      labels: ['Bank', 'Cash', 'UPI'],
      datasets: [
        {
          data: paymentModeCounts,
          backgroundColor: ['#2563eb', '#22c55e', '#f59e42'],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
    const doughnutOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
          labels: {
            color: '#333',
            font: { size: 14, weight: 'bold' as const },
          },
        },
        tooltip: {
          callbacks: {
            label: function(context: { label?: string; parsed?: number }) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value} bookings`;
            },
          },
        },
      },
      cutout: '70%',
    };

    // Removed unused variables: revenueData, revenueOptions

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center items-center">
          <div className="font-semibold text-lg mb-4 text-gray-800">Booking Overview</div>
          <Line data={bookingData} options={bookingOptions} height={200} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center items-center">
          <div className="font-semibold text-lg mb-4 text-gray-800">Bookings by Payment Mode</div>
          <Doughnut data={doughnutData} options={doughnutOptions} style={{ maxWidth: 320 }} />
        </div>
      </div>
    </div>
  );
}