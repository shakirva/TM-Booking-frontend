"use client";
import { useEffect, useState } from 'react';
import { getDeletedBookings } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDateDMY } from '@/lib/date';

type DeletedBooking = {
  id: number;
  original_booking_id: number;
  name?: string;
  occasion_type?: string;
  payment_mode?: string;
  advance_amount?: string;
  date?: string;
  time?: string;
  deleted_at?: string;
  created_at?: string; // original created date
};

export default function DeletedBookingsPage() {
  const [deleted, setDeleted] = useState<DeletedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeleted = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const data = await getDeletedBookings(token);
        setDeleted(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load deleted bookings');
        setDeleted([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeleted();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-gray-800">Deleted Bookings Log</div>
        </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && !loading && <div className="text-red-500 text-sm">{error}</div>}
        {!loading && deleted.length === 0 && !error && (
          <div className="text-gray-400">No deletions logged yet.</div>
        )}
        {deleted.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8FAFF] text-gray-400 text-left">
                  <th className="py-3 px-4 font-medium rounded-tl-xl">Log ID</th>
                  <th className="py-3 px-4 font-medium">Booking ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Occasion</th>
                  <th className="py-3 px-4 font-medium">Payment Mode</th>
                  <th className="py-3 px-4 font-medium">Advance</th>
                  <th className="py-3 px-4 font-medium">Event Date</th>
                  <th className="py-3 px-4 font-medium">Booked Date</th>
                  <th className="py-3 px-4 font-medium rounded-tr-xl">Deleted At</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {deleted.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.id}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.original_booking_id}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.name || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.occasion_type || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.payment_mode || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.advance_amount || '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.date ? formatDateDMY(d.date) : '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.created_at ? formatDateDMY(d.created_at) : '-'}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.deleted_at ? formatDateDMY(d.deleted_at) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}