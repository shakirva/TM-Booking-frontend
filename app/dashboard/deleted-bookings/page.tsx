"use client";
import { useEffect, useState } from 'react';
import { getDeletedBookings } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDateDMY } from '@/lib/date';

type DeletedBooking = {
  id: number;
  original_booking_id: number;
  name?: string;
  groom_name?: string;
  bride_name?: string;
  address?: string;
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
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState(''); // YYYY-MM-DD

  useEffect(() => {
    const fetchDeleted = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const data = await getDeletedBookings(token);
        setDeleted(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load deleted bookings:', err);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="font-semibold text-lg text-gray-800">Deleted Bookings Log</div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search (name, groom, bride, id, date)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-400"
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-black"
            />
            <button
              type="button"
              onClick={() => setSearch(search.trim())}
              className="px-4 py-2 rounded bg-black text-white text-sm font-medium hover:bg-gray-900"
            >Search</button>
          </div>
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
                  <th className="py-3 px-4 font-medium">Groom</th>
                  <th className="py-3 px-4 font-medium">Bride</th>
                  <th className="py-3 px-4 font-medium">Address</th>
                  <th className="py-3 px-4 font-medium">Occasion</th>
                  <th className="py-3 px-4 font-medium">Payment Mode</th>
                  <th className="py-3 px-4 font-medium">Advance</th>
                  <th className="py-3 px-4 font-medium">Event Date</th>
                  <th className="py-3 px-4 font-medium">Booked Date</th>
                  <th className="py-3 px-4 font-medium rounded-tr-xl">Deleted At</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {deleted.filter(d => {
                  if (!search.trim() && !searchDate) return true;
                  const q = search.toLowerCase();
                  const dateStrings = [d.date, d.created_at, d.deleted_at].filter(Boolean).map(dt => {
                    const ddmmyy = dt ? formatDateDMY(dt) : '';
                    return [dt, ddmmyy];
                  }).flat();
                  const textOk = (() => {
                    if (!q) return true;
                    return [d.name, d.occasion_type, d.payment_mode, String(d.original_booking_id), d.groom_name, d.bride_name, d.address, ...dateStrings]
                      .some(f => (f || '').toLowerCase().includes(q));
                  })();
                  const dateOk = searchDate ? (d.date ? d.date.startsWith(searchDate) : false) : true;
                  return textOk && dateOk;
                }).map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.id}</td>
                    <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.original_booking_id}</td>
                      <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.name || '-'}</td>
                      <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.groom_name || '-'}</td>
                      <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.bride_name || '-'}</td>
                      <td className="py-3 px-4 border-b border-[#E5E7EB]">{d.address || '-'}</td>
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