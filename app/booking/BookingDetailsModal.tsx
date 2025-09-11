
import React from 'react';

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
  slot_id?: number;
  time?: string;
}

interface BookingDetailsModalProps {
  bookings: BookingDetails[];
  onClose: () => void;
  onEdit?: (booking: BookingDetails) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ bookings, onClose, onEdit }) => {
  if (!bookings || bookings.length === 0) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">Booking Details for {bookings[0].date}</h3>
        <div className="space-y-6">
          {bookings.map((details, idx) => (
            <div key={details.id || idx} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div className="font-semibold text-lg text-blue-800">{details.time || 'Slot'}</div>
                <div className="text-gray-500">Booking ID: {details.id}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-base">
                <div><span className="font-semibold text-gray-700">Customer:</span> <span className="text-gray-900">{details.name || details.customerName || '-'}</span></div>
                <div><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{details.phone || details.customerPhone || '-'}</span></div>
                <div><span className="font-semibold text-gray-700">Occasion:</span> <span className="text-gray-900">{details.occasion_type || details.occasion || '-'}</span></div>
                <div><span className="font-semibold text-gray-700">Payment Mode:</span> <span className="text-gray-900">{details.payment_mode || details.paymentMode || '-'}</span></div>
                <div><span className="font-semibold text-gray-700">Advance Amount:</span> <span className="text-gray-900">{details.advance_amount || details.advanceAmount || '-'}</span></div>
              </div>
              {onEdit && (
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    onClick={() => onEdit(details)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
