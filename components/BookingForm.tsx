import React from 'react';
import { TimeSlot, Booking } from './booking/BookingDataProvider';

interface BookingFormProps {
  selectedSlots: number[];
  setSelectedSlots: (slots: number[]) => void;
  occasion: string;
  setOccasion: (occasion: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  timeSlots: TimeSlot[];
  date: Date | null;
  isEditMode?: boolean;
  editingBooking?: Booking | null;
  bookedTimes?: string[];
  // Night option
  includeNight?: boolean;
  setIncludeNight?: (value: boolean) => void;
  nightPrice?: number;
  totalAmount?: number;
  // Remarks
  remarks?: string;
  setRemarks?: (remarks: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedSlots,
  setSelectedSlots,
  occasion,
  setOccasion,
  notes,
  setNotes,
  timeSlots,
  date,
  isEditMode = false,
  editingBooking = null,
  bookedTimes = [],
  includeNight = false,
  setIncludeNight,
  nightPrice = 0,
  totalAmount = 0,
  remarks = '',
  setRemarks
}) => {
  // If in edit mode and we have booking data, populate the form
  React.useEffect(() => {
    if (isEditMode && editingBooking) {
      setOccasion(editingBooking.occasion);
      setNotes(editingBooking.notes);
      setSelectedSlots([0]); // Always full day slot
    }
  }, [isEditMode, editingBooking, setOccasion, setNotes, setSelectedSlots]);

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-sm font-medium mt-4">Select Slot</label>
        {!date ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Please select a date from the calendar above to choose your time slot</p>
          </div>
        ) : (
          <select
            value={selectedSlots.length > 0 ? selectedSlots[0] : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setSelectedSlots([]);
              } else {
                setSelectedSlots([parseInt(value, 10)]);
              }
            }}
            className="w-full border rounded-lg px-4 py-3 border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 text-black bg-white"
          >
            <option value="">-- Select a slot --</option>
            {timeSlots.map((slot, idx) => {
              const isBooked = (bookedTimes || []).includes(slot.time);
              return (
                <option key={slot.label} value={idx} disabled={isBooked}>
                  {slot.label} ({slot.time}) - ₹{slot.price.toLocaleString()} {isBooked ? '(Booked)' : ''}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {/* Night Option Toggle - Always show when date and slot selected */}
      {date && selectedSlots.length > 0 && setIncludeNight && (
        <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Night Stay</h4>
              <p className="text-sm text-gray-600">Add overnight accommodation</p>
              {nightPrice > 0 && (
                <p className="text-sm font-medium text-indigo-600 mt-1">+₹{nightPrice.toLocaleString()}</p>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeNight}
                onChange={(e) => setIncludeNight(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">{includeNight ? 'Yes' : 'No'}</span>
            </label>
          </div>
          {includeNight && totalAmount > 0 && (
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total with Night:</span>
                <span className="font-bold text-indigo-700">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Details Section - Only show in edit mode */}
      {isEditMode && editingBooking && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={editingBooking.customerName}
                className="w-full border rounded-lg px-3 py-2 border-gray-300 bg-white text-gray-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={editingBooking.customerPhone}
                className="w-full border rounded-lg px-3 py-2 border-gray-300 bg-white text-gray-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
              <input
                type="tel"
                value={editingBooking.customerPhone2}
                className="w-full border rounded-lg px-3 py-2 border-gray-300 bg-white text-gray-400"
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Remarks/Notes field */}
      {setRemarks && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Remarks <span className="text-gray-400">(Optional)</span></label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="Add event details, special requirements, or notes..."
            className="w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 min-h-[80px] text-black placeholder:text-gray-400"
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1">Max 500 characters</p>
        </div>
      )}
    </>
  );
};

export default BookingForm; 