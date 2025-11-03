import React from 'react';
import { TimeSlot, Booking, occasionTypes } from './booking/BookingDataProvider';

interface BookingFormProps {
  selectedSlots: number[];
  setSelectedSlots: (slots: number[]) => void;
  occasion: string;
  setOccasion: (occasion: string) => void;
  // utility type removed
  notes: string;
  setNotes: (notes: string) => void;
  timeSlots: TimeSlot[];
  date: Date | null;
  isEditMode?: boolean;
  editingBooking?: Booking | null;
  bookedTimes?: string[];
  // Removed selectedTab and setSelectedTab from props
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedSlots,
  setSelectedSlots,
  occasion,
  setOccasion,
  // utility type removed
  notes,
  setNotes,
  timeSlots,
  date,
  isEditMode = false,
  editingBooking = null,
  bookedTimes = []
  // Removed selectedTab and setSelectedTab from destructure
}) => {
  // If in edit mode and we have booking data, populate the form
  React.useEffect(() => {
    if (isEditMode && editingBooking) {
      setOccasion(editingBooking.occasion);
      setNotes(editingBooking.notes);
      setSelectedSlots([0]); // Always full day slot
    }
  }, [isEditMode, editingBooking, setOccasion, setNotes, setSelectedSlots]);

  // Show form even when no date is selected, but with appropriate messaging

  // Remove the separate save function since we're handling it in the Next button

  return (
    <>
  {/* No tab selection for full day booking */}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-sm font-medium mt-4"></label>
        {!date ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Please select a date from the calendar above to choose your time slot</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {timeSlots.map((slot, idx) => {
              const isBooked = (bookedTimes || []).includes(slot.time);
              const isSelected = selectedSlots.includes(idx);
              return (
                <button
                  key={slot.label}
                  type="button"
                  disabled={isBooked}
                  onClick={() => {
                    if (isBooked) return;
                      if (isSelected) {
                        setSelectedSlots([]);
                      } else {
                        setSelectedSlots([idx]);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-lg border transition-colors min-h-[64px]
                    ${isBooked ? 'bg-red-100 text-red-500 border-red-400 cursor-not-allowed' : isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black border-gray-300 hover:bg-blue-50'}`}
                >
                  <span className="flex-1 min-w-0 truncate">
                    {slot.label}{' '}
                    <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>({slot.time})</span>
                  </span>
                  <span className="text-sm font-semibold">₹{slot.price.toLocaleString()}</span>
                  {isBooked && <span className="ml-2 text-xs text-red-500 font-bold">Booked</span>}
                  {isSelected && !isBooked && <span className="ml-2 text-xs text-green-200">Selected</span>}
                  {isSelected && isBooked && <span className="ml-2 text-xs text-red-600 font-bold">Selected</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

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

      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-sm font-medium">Occasion Type</label>
        <select
          value={occasion}
          onChange={e => setOccasion(e.target.value)}
          className="w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-400"
        >
          <option value="">Select occasion type</option>
                            {occasionTypes.map((type: string) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Utility type removed */}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-sm font-medium">Notes <span className="text-gray-400">(Optional)</span></label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any special requirements..."
          className="w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 min-h-[48px] text-black placeholder:text-gray-400"
        />
      </div>

    </>
  );
};

export default BookingForm; 