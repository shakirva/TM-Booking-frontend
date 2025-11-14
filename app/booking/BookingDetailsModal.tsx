
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

  const formatAmount = (val?: string) => {
    const n = Number(val);
    if (!Number.isFinite(n) || n <= 0) return '-';
    return `₹${n.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-[#F8FAFF]">
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Details
            <span className="ml-2 text-gray-500 text-sm">{bookings[0].date}</span>
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4">
          {bookings.map((details, idx) => {
            const name = details.name || details.customerName || '-';
            const phone = details.phone || details.customerPhone || '-';
            const occasion = details.occasion_type || details.occasion || '-';
            const payment = details.payment_mode || details.paymentMode || '-';
            const advance = details.advance_amount || details.advanceAmount || '';
            return (
              <div
                key={details.id || idx}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-blue-50 text-blue-700 border border-blue-100">
                      {details.time || 'Slot'}
                    </span>
                    <span className="text-xs text-gray-500">ID: {details.id}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500">Advance</div>
                    <div className="text-base font-semibold text-gray-900">{formatAmount(advance)}</div>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Customer</div>
                    <div className="text-gray-900 font-medium truncate">{name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Phone</div>
                    {phone !== '-' ? (
                      <a href={`tel:${phone}`} className="text-gray-900 font-medium underline decoration-dotted underline-offset-2">{phone}</a>
                    ) : (
                      <div className="text-gray-900 font-medium">-</div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Occasion</div>
                    <div className="text-gray-900 font-medium truncate">{occasion}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Payment Mode</div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 border border-gray-200 capitalize">
                      {payment}
                    </div>
                  </div>
                </div>

                {/* Edit action (optional) */}
                {onEdit && (
                  <div className="flex justify-end mt-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                      onClick={() => onEdit(details)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end">
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
