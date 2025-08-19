"use client";
import { useEffect, useState } from 'react';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { getDashboardSummary, getRequests } from '../../lib/api';
import { getToken } from '../../lib/auth';


export default function DashboardPage() {
  const [summary, setSummary] = useState<Record<string, unknown>>({ total_bookings: 0, total_slots: 0 });
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [upcoming, setUpcoming] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const summaryData = await getDashboardSummary(token);
        setSummary(summaryData);
        const bookingsData = await getRequests(token);
        setBookings(bookingsData.slice(-5).reverse()); // show 5 most recent
        // For upcoming events, filter bookings with status 'approved' and date in future
        const now = new Date();
        const upcomingEvents = bookingsData.filter(b => b.status === 'approved' && new Date(b.date) > now).slice(0, 3);
        setUpcoming(upcomingEvents);
  } catch {
        setBookings([]);
        setUpcoming([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB]">
          <div className="flex items-end justify-between  w-full gap-2">
            <div>
              <span className="bg-blue-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <MdOutlineCalendarMonth className="h-7 w-7 text-blue-500"/>
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Bookings</div>
              <div className="text-2xl font-bold text-black">{summary.total_bookings}</div>
            </div>
          </div>
        </div>
        {/* Total Users */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB]">
          <div className="flex items-end justify-between w-full gap-2">
            <div>
              <span className="bg-green-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <FaRegUser className="h-7 w-7 text-green-500" />
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Users</div>
              <div className="text-2xl font-bold text-black">{summary.total_users}</div>
            </div>
          </div>
        </div>
        {/* Customer Count */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB]">
          <div className="flex items-end justify-between w-full gap-2">
            <div>
              <span className="bg-purple-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <FaRegUser className="h-7 w-7 text-purple-500" />
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Customer Count</div>
              <div className="text-2xl font-bold text-black">{bookings.reduce((acc, b) => acc + (b.customer_count || 0), 0)}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {/* <div className="grid grid-cols-4 gap-6">
       
        <button className="bg-white rounded-xl p-6 flex items-center gap-4 border border-[#E5E7EB] hover:bg-blue-50 transition">
          <span className="bg-blue-50 rounded-lg p-2 flex items-center justify-center">
          
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span className="font-semibold text-black">New Booking</span>
        </button>
     
        <button className="bg-white rounded-xl p-6 flex items-center gap-4 border border-[#E5E7EB] hover:bg-blue-50 transition">
          <span className="bg-blue-50 rounded-lg p-2 flex items-center justify-center">
          
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <span className="font-semibold text-black">Add User</span>
        </button>
      
        <button className="bg-white rounded-xl p-6 flex items-center gap-4 border border-[#E5E7EB] hover:bg-blue-50 transition">
          <span className="bg-blue-50 rounded-lg p-2 flex items-center justify-center">
     
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M16 3v4M8 3v4M3 11h18" />
            </svg>
          </span>
          <span className="font-semibold text-black">View Calendar</span>
        </button>
      
        <button className="bg-white rounded-xl p-6 flex items-center gap-4 border border-[#E5E7EB] hover:bg-blue-50 transition">
          <span className="bg-blue-50 rounded-lg p-2 flex items-center justify-center">
          
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2M7 13v4M12 9v8M17 6v11" />
            </svg>
          </span>
          <span className="font-semibold text-black">Generate Report</span>
        </button>
      </div> */}
      {/* Main Content Grid */}
     
        {/* Recent Bookings Table */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm">
          <div className="font-semibold text-lg text-gray-800 p-4 border-b border-[#E5E7EB]">Recent Bookings</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8FAFF] text-gray-400 text-left">
                  <th className="py-3 px-4 font-medium rounded-tl-xl">Booking ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Occasion Type</th>
                  <th className="py-3 px-4 font-medium">Utility Type</th>
                  <th className="py-3 px-4 font-medium">Payment Mode</th>
                  <th className="py-3 px-4 font-medium">Customer Count</th>
                  <th className="py-3 px-4 font-medium rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.id}</td>
                    <td className="py-3 px-4 font-medium border-b border-[#E5E7EB]">{booking.name || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.occasion_type || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.utility_type || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.payment_mode || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.customer_count || '-'}</td>
                    <td className="py-3 px-4 text-xl text-gray-400 border-b border-[#E5E7EB]">⋮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="font-semibold text-lg mb-4 text-gray-800">Upcoming Events</div>
          <div className="flex flex-col gap-4">
            {upcoming.length === 0 && (
              <div className="text-gray-400 text-center">No upcoming events</div>
            )}
            {upcoming.map((event) => {
              const dateObj = new Date(event.date);
              const month = dateObj.toLocaleString('default', { month: 'short' });
              const day = dateObj.getDate();
              return (
                <div key={event.id} className="flex items-center bg-[#F8FAFF] rounded-lg p-4 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-lg px-3 py-2 min-w-[48px]">
                    <span className="text-xs font-semibold">{month}</span>
                    <span className="text-lg font-bold leading-none">{day}</span>
                  </div>
                  <div>
                    <div className="font-medium text-black">{event.occasion_type || 'Event'}</div>
                    <div className="text-xs text-gray-400 mt-1">{event.utility_type || '-'} | {event.payment_mode || '-'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
} 