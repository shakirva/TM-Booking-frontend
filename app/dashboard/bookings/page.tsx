"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRequests, deleteBooking } from '../../../lib/api';
import { getToken } from '../../../lib/auth';

type Booking = {
  id: number;
  name: string;
  occasion_type?: string;
  utility_type?: string;
  payment_mode?: string;
  advance_amount?: string;
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
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
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
          <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            {/* Download button removed */}
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
                <th className="py-3 px-4 font-medium rounded-tr-xl">Advance Amount</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                  {/* <th className="py-3 px-4 font-medium"></th> */}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {Array.isArray(bookings) && bookings.map((booking) => (
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
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.advance_amount}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB] flex gap-2">
                      <button
                        className="text-red-500 hover:text-red-700 font-bold text-sm border border-red-100 rounded px-2 py-1"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const token = getToken();
                          if (!token) return;
                          await deleteBooking(String(booking.id), token);
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