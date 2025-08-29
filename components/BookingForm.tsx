import React from 'react';
import { TimeSlot, Booking, occasionTypes, utilityTypes } from './booking/BookingDataProvider';

interface BookingFormProps {
  selectedSlot: number;
  setSelectedSlot: (slot: number) => void;
  occasion: string;
  setOccasion: (occasion: string) => void;
  utility: string;
  setUtility: (utility: string) => void;
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
  selectedSlot,
  setSelectedSlot,
  occasion,
  setOccasion,
  utility,
  setUtility,
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
      setSelectedSlot(0); // Always full day slot
    }
  }, [isEditMode, editingBooking, setOccasion, setNotes, setSelectedSlot]);

  // Show form even when no date is selected, but with appropriate messaging

  // Remove the separate save function since we're handling it in the Next button

  return (
    <>
  {/* No tab selection for full day booking */}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-sm font-medium mt-4">Select Time Slot</label>
        {!date ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Please select a date from the calendar above to choose your time slot</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {timeSlots.map((slot, idx) => {
              const isBooked = (bookedTimes || []).includes(slot.time);
              return (
                <button
                  type="button"
                  key={slot.label}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 transition-all ${selectedSlot === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'} ${isBooked ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                  onClick={() => !isBooked && setSelectedSlot(idx)}
                  disabled={isBooked}
                >
                  <div className='flex flex-col justify-start items-start'>
                    <h5 className="font-medium text-base text-black tex-left">{slot.label}</h5>
                    <span className="text-xs text-gray-400">{slot.time} {isBooked && <span className="text-red-500 font-bold ml-2">Booked</span>}</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-700">₹{slot.price.toLocaleString()}</div>
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

              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm font-medium">Utility Type</label>
                <select
                  value={utility}
                  onChange={e => setUtility(e.target.value)}
                  className="w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-400"
                >
                  <option value="">Select utility type</option>
                  {utilityTypes.map((type: string) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
        </select>
      </div>
      
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