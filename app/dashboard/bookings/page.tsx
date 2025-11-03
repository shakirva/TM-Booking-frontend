"use client";

import React, { useEffect, useState } from "react";
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

  // Helper to map backend booking to frontend booking type
  function mapToFrontendBooking(booking: Booking): FrontendBooking {
    return {
      id: String(booking.id),
      date: booking.date || '',
      customerName: booking.name || '',
      customerPhone: '',
      customerPhone2: '',
      groomName: '',
      brideName: '',
      address: '',
      occasion: booking.occasion_type || '',
    // utility removed
      timeSlot: '',
      slotTime: booking.time || '',
      price: 0,
      notes: '',
      paymentType: booking.payment_mode === 'advance' ? 'advance' : 'full',
      advanceAmount: booking.advance_amount || '',
      paymentMode: (['bank', 'cash', 'upi'].includes((booking.payment_mode || '') as string)
        ? (booking.payment_mode as 'bank' | 'cash' | 'upi')
        : 'cash'),
      createdAt: '',
      updatedAt: '',
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
    <div className="space-y-6">
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
                {/* <th className="py-3 px-4 font-medium">Utility Type</th> */}
                <th className="py-3 px-4 font-medium">Payment Mode</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium rounded-tr-xl">Amount Paid</th>
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
                  {/* utility_type column removed */}
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.payment_mode || '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">{booking.date && booking.time ? `${new Date(booking.date).toLocaleDateString()} ${booking.time}` : '-'}</td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB]">
                    {booking.payment_mode === 'full' && booking.advance_amount
                      ? <span>Full: {booking.advance_amount}</span>
                      : booking.advance_amount
                        ? <span>Advance: {booking.advance_amount}</span>
                        : '-'}
                  </td>
                  <td className="py-3 px-4 border-b border-[#E5E7EB] flex gap-2">
                    {/* <button
                      className="text-blue-500 hover:text-blue-700 font-bold text-sm border border-blue-100 rounded px-2 py-1"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingBooking(mapToFrontendBooking(booking));
                        setEditModalOpen(true);
                      }}
                    >Edit</button> */}
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