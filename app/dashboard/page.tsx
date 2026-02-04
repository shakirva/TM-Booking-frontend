"use client";
import { useEffect, useState } from 'react';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegUser, FaPhoneAlt } from "react-icons/fa";
import { FiCalendar, FiMessageSquare } from "react-icons/fi";
import { getDashboardSummary, getUpcomingEvents } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDateDMY } from '@/lib/date';

interface UpcomingEvent {
  id: string | number;
  event_date: string;
  customer_name: string;
  primary_phone: string;
  remarks: string;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Record<string, unknown>>({ total_bookings: 0, total_slots: 0, total_users: 0, total_customers: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const [summaryData, eventsData] = await Promise.all([
          getDashboardSummary(token),
          getUpcomingEvents(token)
        ]);
        setSummary(summaryData);
        setUpcomingEvents(eventsData || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB] hover:shadow-lg transition-shadow">
          <div className="flex items-end justify-between w-full gap-2">
            <div>
              <span className="bg-blue-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <MdOutlineCalendarMonth className="h-7 w-7 text-blue-500"/>
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Bookings</div>
              <div className="text-3xl font-bold text-black">{String(summary.total_bookings ?? 0)}</div>
            </div>
          </div>
        </div>
        {/* Total Users */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB] hover:shadow-lg transition-shadow">
          <div className="flex items-end justify-between w-full gap-2">
            <div>
              <span className="bg-green-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <FaRegUser className="h-7 w-7 text-green-500" />
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Users</div>
              <div className="text-3xl font-bold text-black">{String(summary.total_users ?? 0)}</div>
            </div>
          </div>
        </div>
        {/* Total Customers */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-start border border-[#E5E7EB] hover:shadow-lg transition-shadow">
          <div className="flex items-end justify-between w-full gap-2">
            <div>
              <span className="bg-amber-50 rounded-lg w-12 h-12 p-3 mb-4 flex items-center justify-center">
                <FaRegUser className="h-7 w-7 text-amber-500" />
              </span>
              <div className="text-gray-500 text-base font-medium mb-2">Total Customers</div>
              <div className="text-3xl font-bold text-black">{String(summary.total_customers ?? 0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <FiCalendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-900">Upcoming Events</h2>
              <p className="text-sm text-gray-500">Sorted by event date (ascending)</p>
            </div>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Event Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Primary Phone</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No upcoming events scheduled
                  </td>
                </tr>
              ) : (
                upcomingEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm">
                          {event.event_date ? new Date(event.event_date).getDate() : '-'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {event.event_date ? formatDateDMY(event.event_date) : '-'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short' }) : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{event.customer_name || '-'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaPhoneAlt className="h-3 w-3 text-gray-400" />
                        {event.primary_phone || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600 max-w-[200px]">
                        {event.remarks ? (
                          <>
                            <FiMessageSquare className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate" title={event.remarks}>{event.remarks}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No upcoming events scheduled
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-lg px-3 py-2 min-w-[50px]">
                    <span className="text-xs font-semibold uppercase">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }) : '-'}
                    </span>
                    <span className="text-xl font-bold leading-none">
                      {event.event_date ? new Date(event.event_date).getDate() : '-'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{event.customer_name || '-'}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <FaPhoneAlt className="h-3 w-3 text-gray-400" />
                      {event.primary_phone || '-'}
                    </div>
                    {event.remarks && (
                      <div className="text-sm text-gray-500 mt-2 flex items-start gap-1">
                        <FiMessageSquare className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{event.remarks}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 