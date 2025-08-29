import React, { useEffect, useState } from 'react';
import { getRequests } from '../../lib/api';
import { getToken } from '../../lib/auth';

interface BookingDetails {
  id: string;
  date: string;
  name?: string;
  customerName?: string;
  phone?: string;
  customerPhone?: string;
  occasion_type?: string;
  occasion?: string;
  payment_mode?: string;
  paymentMode?: string;
  advance_amount?: string;
  advanceAmount?: string;
}

interface BookingDetailsModalProps {
  booking: { id: string; date: string } | null;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  const [details, setDetails] = useState<BookingDetails | null>(null);
  useEffect(() => {
    const fetchDetails = async () => {
      if (!booking) return;
      const token = getToken();
      if (!token) return;
      const all: BookingDetails[] = await getRequests(token);
      const found = all.find((b) => b.id == booking.id || b.date === booking.date) || null;
      setDetails(found);
    };
    fetchDetails();
  }, [booking]);
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">Booking Details</h3>
        <div className="space-y-3 text-base">
          <div><span className="font-semibold text-gray-700">Date:</span> <span className="text-gray-900">{details?.date || '-'}</span></div>
          <div><span className="font-semibold text-gray-700">Customer:</span> <span className="text-gray-900">{details?.name || details?.customerName || '-'}</span></div>
          <div><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{details?.phone || details?.customerPhone || '-'}</span></div>
          <div><span className="font-semibold text-gray-700">Occasion:</span> <span className="text-gray-900">{details?.occasion_type || details?.occasion || '-'}</span></div>
          <div><span className="font-semibold text-gray-700">Payment Mode:</span> <span className="text-gray-900">{details?.payment_mode || details?.paymentMode || '-'}</span></div>
          <div><span className="font-semibold text-gray-700">Advance Amount:</span> <span className="text-gray-900">{details?.advance_amount || details?.advanceAmount || '-'}</span></div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
