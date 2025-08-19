"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRequests } from '../../../lib/api';
import { getToken } from '../../../lib/auth';

type Booking = {
  id: number;
  name: string;
  occasion_type?: string;
  utility_type?: string;
  payment_mode?: string;
  customer_count?: number;
  slot_id: number;
  date?: string;
  time?: string;
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const fetchBookings = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const data = await getRequests(token);
        setBookings(data);
      } catch {
        setBookings([]);
      }
    };
    fetchBookings();
  }, []);
  return (
    <div className="space-y-6">
     
      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-gray-800">Bookings</div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg>
            Download
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8FAFF] text-gray-400 text-left">
                <th className="py-3 px-4 font-medium rounded-tl-xl">Booking ID</th>
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Occasion Type</th>
                <th className="py-3 px-4 font-medium">Utility Type</th>
                <th className="py-3 px-4 font-medium">Payment Mode</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Customer Count</th>
                <th className="py-3 px-4 font-medium rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.id}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.name}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.occasion_type || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.utility_type || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.payment_mode || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.date && booking.time ? `${new Date(booking.date).toLocaleDateString()} ${booking.time}` : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.customer_count || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">
                    <button
                      className="text-red-500 hover:text-red-700 font-bold"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const token = getToken();
                        if (!token) return;
                        await fetch(`http://localhost:4000/api/bookings/requests/${booking.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setBookings(bookings.filter(b => b.id !== booking.id));
                      }}
                    >Delete</button>
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