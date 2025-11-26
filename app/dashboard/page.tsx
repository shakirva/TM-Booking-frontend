"use client";
import { useEffect, useState } from 'react';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { getDashboardSummary, getRequests } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDateDMY } from '@/lib/date';


export default function DashboardPage() {
  type BookingDisplay = {
    id?: string | number;
    name?: string;
    customerName?: string;
    occasion_type?: string;
    occasion?: string;
  // utility_type removed
    payment_mode?: string;
    paymentMode?: string;
    advance_amount?: string;
    date?: string;
  };
  // Internal extended type used during upcoming events computation
  type BookingWithDateObj = BookingDisplay & { _dateObj: Date | null };
  const [summary, setSummary] = useState<Record<string, unknown>>({ total_bookings: 0, total_slots: 0 });
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [upcoming, setUpcoming] = useState<BookingDisplay[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const summaryData = await getDashboardSummary(token);
        setSummary(summaryData);
        const bookingsData = await getRequests(token);
        // Map camelCase fields to snake_case for dashboard display
        const mappedBookings: BookingDisplay[] = bookingsData.map((b: BookingDisplay) => ({
          ...b,
          occasion_type: b.occasion_type ?? b.occasion ?? '-',
          // utility_type removed
          payment_mode: b.payment_mode ?? b.paymentMode ?? '-',
          name: b.name ?? b.customerName ?? '-',
          advance_amount: b.advance_amount ?? '-',
        }));
        // Ensure recent bookings show the latest by id DESC
        const recentFive = [...mappedBookings]
          .sort((a, b) => (Number(b.id ?? 0) - Number(a.id ?? 0)))
          .slice(0, 5);
        setBookings(recentFive);
        // Upcoming events logic (improved): show up to 7 upcoming (today or future) events.
        // If fewer than 7 future/today events exist, backfill with recent past events, then placeholders.
        const today = new Date();
        today.setHours(0,0,0,0);
        const datedBookings: BookingWithDateObj[] = mappedBookings
          .filter((b: BookingDisplay) => !!b.date)
          .map((b: BookingDisplay) => ({ ...b, _dateObj: b.date ? new Date(b.date) : null }));
        const futureOrToday = datedBookings
          .filter((b: BookingWithDateObj) => b._dateObj && b._dateObj.getTime() >= today.getTime())
          .sort((a: BookingWithDateObj, b: BookingWithDateObj) => (a._dateObj!.getTime() - b._dateObj!.getTime())); // ascending
        let upcomingList: BookingDisplay[] = futureOrToday.slice(0,7);
        if (upcomingList.length < 7) {
          const past = datedBookings
            .filter((b: BookingWithDateObj) => b._dateObj && b._dateObj.getTime() < today.getTime())
            .sort((a: BookingWithDateObj, b: BookingWithDateObj) => (b._dateObj!.getTime() - a._dateObj!.getTime())); // most recent past first
          const needed = 7 - upcomingList.length;
            upcomingList = [...upcomingList, ...past.slice(0, needed)];
        }
        if (upcomingList.length < 7) {
          const placeholders: BookingDisplay[] = Array.from({ length: 7 - upcomingList.length }).map(() => ({
            id: `placeholder-${Math.random()}`,
            occasion_type: 'No Event',
            payment_mode: '',
            date: ''
          }));
          upcomingList = [...upcomingList, ...placeholders];
        }
        setUpcoming(upcomingList);
      } catch {
        setBookings([]);
        setUpcoming([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB]">
          <div className="flex items-end justify-between  w-full gap-2">
            <div>
              <span className="bg-blue-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <MdOutlineCalendarMonth className="h-7 w-7 text-blue-500"/>
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Bookings</div>
              <div className="text-2xl font-bold text-black">{String(summary.total_bookings ?? 0)}</div>
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
              <div className="text-2xl font-bold text-black">{String(summary.total_users ?? 0)}</div>
            </div>
          </div>
        </div>
        {/* Total Customers */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB]">
          <div className="flex items-end justify-between w-full gap-2">
            <div>
              <span className="bg-yellow-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                {/* You can use a different icon for customers if you want */}
                <FaRegUser className="h-7 w-7 text-yellow-500" />
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Customers</div>
              <div className="text-2xl font-bold text-black">{String(summary.total_customers ?? 0)}</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="font-semibold text-lg text-gray-800 p-4 border-b border-[#E5E7EB]">Recent Bookings</div>
          {/* Mobile cards */}
          <div className="p-4 space-y-3 md:hidden">
            {bookings.length === 0 && (
              <div className="text-gray-400 text-center">No recent bookings</div>
            )}
            {bookings.map((b) => (
              <div key={String(b.id)} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-black">#{String(b.id)}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{b.payment_mode ?? '-'}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{b.name ?? '-'}</div>
                <div className="text-sm text-gray-500">{b.occasion_type ?? '-'}</div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-500">Advance</span>
                  <span className="font-medium text-black">{b.advance_amount ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Date</span>
                  <span>{b.date ? new Date(b.date).toLocaleDateString() : '-'}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-100 rounded px-2 py-1"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!b.id) return;
                      if (!window.confirm('Delete this booking?')) return;
                      const token = getToken();
                      if (!token) return;
                      try {
                        await import('@/lib/api').then(mod => mod.deleteBooking(String(b.id), token));
                        setBookings(bookings.filter(x => x.id !== b.id));
                      } catch {
                        alert('Failed to delete booking.');
                      }
                    }}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8FAFF] text-gray-400 text-left">
                  <th className="py-3 px-4 font-medium rounded-tl-xl">Booking ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Occasion Type</th>
                  <th className="py-3 px-4 font-medium">Payment Mode</th>
                  <th className="py-3 px-4 font-medium">Advance Amount</th>
                  <th className="py-3 px-4 font-medium">Booked Date</th>
                  <th className="py-3 px-4 font-medium rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {bookings.map((booking) => (
                  <tr key={String((booking as BookingDisplay).id)} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{String((booking as BookingDisplay).id ?? '')}</td>
                    <td className="py-3 px-4 font-medium border-b border-[#E5E7EB]">{(booking as BookingDisplay).name ?? '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{(booking as BookingDisplay).occasion_type ?? '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{(booking as BookingDisplay).payment_mode ?? '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{(booking as BookingDisplay).advance_amount ?? '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{(booking as BookingDisplay).date ? formatDateDMY((booking as BookingDisplay).date as string) : '-'}</td>
                    <td className="py-3 px-4 text-xl border-b border-[#E5E7EB]">
                      <button
                        className="text-red-500 hover:text-red-700 font-bold text-sm border border-red-100 rounded px-2 py-1"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!booking.id) return;
                          if (!window.confirm('Are you sure you want to delete this booking?')) return;
                          const token = getToken();
                          if (!token) return;
                          try {
                            await import('@/lib/api').then(mod => mod.deleteBooking(String(booking.id), token));
                            setBookings(bookings.filter(b => b.id !== booking.id));
                          } catch {
                            alert('Failed to delete booking.');
                          }
                        }}
                      >Delete</button>
                    </td>
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
              const dateValue = (event as BookingDisplay).date ?? null;
              const dateObj = dateValue ? new Date(dateValue) : null;
              const month = dateObj ? dateObj.toLocaleString('default', { month: 'short' }) : '-';
              const day = dateObj ? dateObj.getDate() : '-';
              return (
                <div key={String((event as BookingDisplay).id)} className="flex items-center bg-[#F8FAFF] rounded-lg p-4 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-lg px-3 py-2 min-w-[48px]">
                    <span className="text-xs font-semibold">{month}</span>
                    <span className="text-lg font-bold leading-none">{day}</span>
                  </div>
                  <div>
                    <div className="font-medium text-black">{(event as BookingDisplay).occasion_type ?? 'Event'}</div>
                    <div className="text-xs text-gray-400 mt-1">{(event as BookingDisplay).date ? formatDateDMY((event as BookingDisplay).date!) : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 