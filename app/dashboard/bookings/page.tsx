"use client";

import React, { useEffect, useState } from "react";
import { formatDateDMY } from '@/lib/date';
import BookingDetailsModal from '../../booking/BookingDetailsModal';
import Modal from 'react-modal';
import { Booking as FrontendBooking } from '../../../components/booking/BookingDataProvider';
import { useRouter } from "next/navigation";
import { getRequests, deleteBooking, updateBooking as apiUpdateBooking } from '@/lib/api';
import { getToken } from '@/lib/auth';

type Booking = {
  id: number;
  name: string;
  occasion_type?: string;
  // utility_type removed
  payment_mode?: string;
  advance_amount?: string;
  slot_id: number;
  date?: string;
  time?: string;
  created_at?: string;
  total_amount?: string;
  phone?: string;
  payment_type?: string;
};

export default function BookingsPage() {
  // Set react-modal app element for accessibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appRoot = document.getElementById('__next');
      if (appRoot) {
        Modal.setAppElement(appRoot);
      }
    }
  }, []);
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // Editing functionality is currently disabled; keep state value only to avoid unused setter lint error
  const [editingBooking] = useState<FrontendBooking | null>(null);
  // Local state for form fields
  const [editOccasion, setEditOccasion] = useState('');
  const [editUtility, setEditUtility] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerPhone2, setEditCustomerPhone2] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAdvanceAmount, setEditAdvanceAmount] = useState('');
  const [editPaymentType, setEditPaymentType] = useState<'advance' | 'full'>('advance');
  const [editPaymentMode, setEditPaymentMode] = useState<'bank' | 'cash' | 'upi'>('cash');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<FrontendBooking | null>(null);
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState(''); // YYYY-MM-DD

  // Helper to map backend booking to frontend booking type
  function mapToFrontendBooking(booking: Booking): FrontendBooking {
    return {
      id: String(booking.id),
      date: booking.date || '',
      customerName: booking.name || '',
      customerPhone: booking.phone || '',
      customerPhone2: '',
      groomName: '',
      brideName: '',
      address: '',
      occasion: booking.occasion_type || '',
    // utility removed
      timeSlot: '',
      slotTime: booking.time || '',
      notes: '',
      paymentType: (booking.payment_type as ('advance'|'full')) || (booking.advance_amount ? 'advance' : 'full'),
      advanceAmount: booking.advance_amount || '',
      paymentMode: (['bank', 'cash', 'upi'].includes((booking.payment_mode || '') as string)
        ? (booking.payment_mode as 'bank' | 'cash' | 'upi')
        : 'cash'),
      createdAt: booking.created_at || '',
      updatedAt: '',
      price: booking.total_amount ? Number(booking.total_amount) : 0,
  };
}

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
  // When opening modal, sync local state with booking
  React.useEffect(() => {
    if (editModalOpen && editingBooking) {
      setEditOccasion(editingBooking.occasion || '');
  // setEditUtility removed (utility no longer exists)
      setEditNotes(editingBooking.notes || '');
      setEditCustomerName(editingBooking.customerName || '');
      setEditCustomerPhone(editingBooking.customerPhone || '');
      setEditCustomerPhone2(editingBooking.customerPhone2 || '');
      setEditAddress(editingBooking.address || '');
      setEditAdvanceAmount(editingBooking.advanceAmount || '');
      setEditPaymentType(editingBooking.paymentType || 'advance');
      setEditPaymentMode(editingBooking.paymentMode || 'cash');
    }
  }, [editModalOpen, editingBooking]);

  // Handle update submit
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBooking) return;
    const token = getToken();
    if (!token) return;
    // Prepare update payload (add more fields as needed)
    const updates = {
      occasion_type: editOccasion,
       // utility_type removed
      notes: editNotes,
      customerName: editCustomerName,
      customerPhone: editCustomerPhone,
      customerPhone2: editCustomerPhone2,
      address: editAddress,
      advance_amount: editAdvanceAmount,
      payment_type: editPaymentType,
      payment_mode: editPaymentMode,
    };
    try {
      await apiUpdateBooking(editingBooking.id, updates, token);
      // Refresh bookings
      const data = await getRequests(token);
      setBookings(Array.isArray(data) ? data : []);
      setEditModalOpen(false);
    } catch {
      alert('Failed to update booking.');
    }
  }

  return (
  <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Edit Booking Modal */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        contentLabel="Edit Booking"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
          {/* View button removed from modal as per request */}
          {editingBooking && (
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editCustomerName}
                  onChange={e => setEditCustomerName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label>
                <input
                  type="text"
                  value={editCustomerPhone}
                  onChange={e => setEditCustomerPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
                <input
                  type="text"
                  value={editCustomerPhone2}
                  onChange={e => setEditCustomerPhone2(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={e => setEditAddress(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion Type</label>
                <input
                  type="text"
                  value={editOccasion}
                  onChange={e => setEditOccasion(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utility Type</label>
                <input
                  type="text"
                  value={editUtility}
                  onChange={e => setEditUtility(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                <input
                  type="text"
                  value={editAdvanceAmount}
                  onChange={e => setEditAdvanceAmount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  value={editPaymentType}
                      onChange={(e) => setEditPaymentType(e.target.value as 'advance' | 'full')}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                >
                  <option value="advance">Advance</option>
                  <option value="full">Full</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                <select
                  value={editPaymentMode}
                  onChange={e => setEditPaymentMode(e.target.value as 'bank' | 'cash' | 'upi')}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                >
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 border-gray-300"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold">Save</button>
              </div>
            </form>
          )}
        </div>
        {/* Booking Details Modal (from edit modal) */}
        {showDetailsModal && editingBooking && (
          <BookingDetailsModal
            bookings={[editingBooking]}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </Modal>
      {/* Booking Details Modal (from View button) */}
      {showDetailsModal && viewingBooking && (
        <BookingDetailsModal
          bookings={[viewingBooking]}
          onClose={() => {
            setShowDetailsModal(false);
            setViewingBooking(null);
          }}
        />
      )}
      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="font-semibold text-lg text-gray-800">Bookings</div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search (name, occasion, id, date)"
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
              onClick={() => {
                // Trigger re-filter intentionally; state already drives filtering.
                setSearch(search.trim());
              }}
              className="px-4 py-2 rounded bg-black text-white text-sm font-medium hover:bg-gray-900"
            >Search</button>
          </div>
        </div>

        {/* Mobile card list */}
        <div className="space-y-3 md:hidden">
          {bookings.filter(b => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            const dateStrings = [b.date, b.created_at].filter(Boolean).map(d => {
              const ddmmyy = d ? formatDateDMY(d) : '';
              return [d, ddmmyy];
            }).flat();
            return [b.name, b.occasion_type, b.payment_mode, String(b.id), ...dateStrings].some(f => (f || '').toLowerCase().includes(q));
          }).map(b => (
            <div
              key={b.id}
              className="border border-gray-200 rounded-xl p-3 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:bg-gray-50 transition cursor-pointer"
              onClick={() => router.push(`/dashboard/bookings/${b.id}`)}
            >
              {/* Header: ID + payment badge */}
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-black">#{b.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {b.payment_mode || '-'}
                </span>
              </div>
              {/* Name and amount */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-gray-900 font-medium truncate">{b.name}</div>
                  <div className="text-[12px] text-gray-500 truncate">{b.occasion_type || '-'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="text-sm font-semibold text-black">
                    {(() => {
                      const n = Number(b.advance_amount);
                      return Number.isFinite(n) && n > 0 ? `₹${n.toLocaleString()}` : '-';
                    })()}
                  </div>
                </div>
              </div>
              {/* Date row */}
              <div className="flex items-center justify-between text-[12px] mt-2">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-700">{b.date ? formatDateDMY(b.date) : '-'}</span>
              </div>
              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 text-green-700 hover:text-green-800 font-semibold text-xs border border-green-200 rounded-lg px-2 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingBooking(mapToFrontendBooking(b));
                    setShowDetailsModal(true);
                  }}
                >View</button>
                <button
                  className="text-red-600 hover:text-red-700 font-semibold text-xs border border-red-200 rounded-lg px-3 py-2"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!window.confirm('Delete this booking?')) return;
                    const token = getToken();
                    if (!token) return;
                    await deleteBooking(String(b.id), token);
                    setBookings(bookings.filter(x => x.id !== b.id));
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
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Booked Date</th>
                <th className="py-3 px-4 font-medium rounded-tr-xl">Amount Paid</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {Array.isArray(bookings) && bookings.filter(booking => {
                // Text search
                const textOk = (() => {
                  if (!search.trim()) return true;
                  const q = search.toLowerCase();
                  const dateStrings = [booking.date, booking.created_at].filter(Boolean).map(d => {
                    const ddmmyy = d ? formatDateDMY(d) : '';
                    return [d, ddmmyy];
                  }).flat();
                  return [booking.name, booking.occasion_type, booking.payment_mode, String(booking.id), ...dateStrings].some(f => (f || '').toLowerCase().includes(q));
                })();
                // Date filter (exact match by YYYY-MM-DD against event date)
                const dateOk = searchDate ? (booking.date ? booking.date.startsWith(searchDate) : false) : true;
                return textOk && dateOk;
              }).map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.id}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.name}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.occasion_type || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.payment_mode || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.date && booking.time ? `${formatDateDMY(booking.date)} ${booking.time}` : (booking.date ? formatDateDMY(booking.date) : '-')}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.created_at ? formatDateDMY(booking.created_at) : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">
                    {booking.payment_mode === 'full' && booking.advance_amount
                      ? <span>Full: {booking.advance_amount}</span>
                      : booking.advance_amount
                        ? <span>Advance: {booking.advance_amount}</span>
                        : '-'}
                  </td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB] flex gap-2">
                    <button
                      className="text-green-600 hover:text-green-800 font-bold text-sm border border-green-100 rounded px-2 py-1"
                      onClick={e => {
                        e.stopPropagation();
                        setViewingBooking(mapToFrontendBooking(booking));
                        setShowDetailsModal(true);
                      }}
                    >View</button>
                    <button
                      className="text-red-500 hover:text-red-700 font-bold text-sm border border-red-100 rounded px-2 py-1"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm('Are you sure you want to delete this booking?')) return;
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

// export default BookingsPage; (removed duplicate)