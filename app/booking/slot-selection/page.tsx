"use client";
import { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useBooking } from '../../context/BookingContext';
import { useBookingData, Booking } from '../../../components/booking/BookingDataProvider';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BookingCards from '../../../components/BookingCards';
import BookingForm from '../../../components/BookingForm';

const receptionSlots = [
  { label: 'Evening', time: '3:00 PM - 6:00 PM', price: 20000 },
  { label: 'Night', time: '4:00 PM - 7:00 PM', price: 40000 },
];
const dayTimeSlots = [
  { label: 'Day', time: '9:00 AM - 6:00 PM', price: 60000 },
];

// Only August 5th has booked dates - using centralized data provider
// Note: This is now handled by the centralized data provider

// Helper function to format date consistently
const formatDateForComparison = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function SlotSelectionPage() {
  const { booking, setBooking } = useBooking();
  const { getBookingsByDate, deleteBooking } = useBookingData();
  // Slot selection state
  const validTabs = ['Reception', 'Day Time'] as const;

  const initialTab = validTabs.includes(booking?.slot?.selectedTab as 'Reception' | 'Day Time') ? booking?.slot?.selectedTab as 'Reception' | 'Day Time' : 'Day Time';

  const [selectedTab, setSelectedTab] = useState<'Reception' | 'Day Time'>(initialTab);
  const [selectedSlot, setSelectedSlot] = useState(booking?.slot?.selectedSlot ?? 0);
  const [date, setDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize date after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    if (booking?.slot?.date) {
      setDate(new Date(booking.slot.date));
    }
  }, [booking?.slot?.date]);
  const [occasion, setOccasion] = useState(booking?.slot?.occasion ?? '');
  const [utility, setUtility] = useState(booking?.slot?.utility ?? '');
  const [notes, setNotes] = useState(booking?.slot?.notes ?? '');
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();

  const timeSlots = selectedTab === 'Day Time' ? dayTimeSlots : receptionSlots;
  const today = new Date();

  // Function to check if a date is booked using centralized data
  const isDateBooked = (date: Date) => {
    const dateString = formatDateForComparison(date);
    const bookings = getBookingsByDate(dateString);
    
    // Debug: Log the date comparison
    if (date.getDate() === 5 && date.getMonth() === 7) { // August 5th
      console.log('Checking August 5th:', {
        dateString,
        bookingsCount: bookings.length,
        bookings: bookings
      });
    }
    
    return bookings.length > 0;
  };

  // Function to check if a date is available (not booked and not in the past)
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !isDateBooked(date);
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (isDateBooked(date)) {
        return (
          <div className="w-full h-full flex items-center justify-center">
          </div>
        );
      } else if (isDateAvailable(date)) {
        return (
          <div className="w-full h-full flex items-center justify-center">
           
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile className for calendar (red for booked)
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (isDateBooked(date)) {
        return 'bg-red-200 text-red-800 font-bold rounded-full';
      } else if (isDateAvailable(date)) {
        return 'available-date';
      }
    }
    return '';
  };

  // Modal state for booking details
  const [showBookingModal, setShowBookingModal] = useState(false);
  // Disable only past dates, allow booked dates to be selectable
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Only disable past dates, allow booked dates to be selectable
      return date < today;
    }
    return false;
  };

  // Handle calendar date change
  const handleDateChange = (value: unknown) => {
    if (value instanceof Date) {
      setDate(value);
      const dateString = value.toISOString().split('T')[0];
      const dateBookings = getBookingsByDate(dateString);
      if (dateBookings && dateBookings.length > 0) {
        setSelectedDateBookings(dateBookings);
        setIsEditMode(false);
        setEditingBooking(null);
        setShowBookingModal(true);
      } else {
        setSelectedDateBookings([]);
        setIsEditMode(false);
        setEditingBooking(null);
        setShowBookingModal(false);
      }
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    // If in edit mode, save the booking changes first and populate booking context
    if (isEditMode && editingBooking) {
      const updatedBooking = {
        ...editingBooking,
        occasion,
        notes,
        timeSlot: selectedTab,
        slotTime: timeSlots[selectedSlot]?.time || editingBooking.slotTime,
        price: timeSlots[selectedSlot]?.price || editingBooking.price
      };
      
      // Update the booking in the selectedDateBookings array
      const updatedBookings = selectedDateBookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      );
      setSelectedDateBookings(updatedBookings);
      
      // Set the booking context with the editing booking's personal data
      setBooking(prev => ({
        ...prev,
        slot: {
          selectedTab,
          selectedSlot,
          selectedSlotLabel: timeSlots[selectedSlot]?.label || '',
          selectedSlotTime: timeSlots[selectedSlot]?.time || '',
          selectedSlotPrice: timeSlots[selectedSlot]?.price || 0,
          date: date.toISOString().split('T')[0],
          occasion,
          utility,
          notes,
        },
        personal: {
          customerName: editingBooking.customerName,
          phone1: editingBooking.customerPhone,
          phone2: editingBooking.customerPhone2,
          groomName: editingBooking.groomName,
          brideName: editingBooking.brideName,
          address: editingBooking.address,
        },
        payment: {
          paymentType: editingBooking.paymentType,
          advanceAmount: editingBooking.advanceAmount || '',
          paymentMode: editingBooking.paymentMode,
        }
      }));
      
      setIsEditMode(false);
      setEditingBooking(null);
    } else {
      // For new bookings, only set slot data
      setBooking(prev => ({
        ...prev,
        slot: {
          selectedTab,
          selectedSlot,
          selectedSlotLabel: timeSlots[selectedSlot]?.label || '',
          selectedSlotTime: timeSlots[selectedSlot]?.time || '',
          selectedSlotPrice: timeSlots[selectedSlot]?.price || 0,
          date: date.toISOString().split('T')[0],
          occasion,
          utility,
          notes,
        },
      }));
    }
    
    router.push('/booking/personal-payment');
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <main className="w-full max-w-2xl p-0 sm:p-4">
          <div className="max-w-md mx-auto px-4 py-6 bg-white">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <main className="w-full max-w-2xl p-0 sm:p-4">
        <div className="max-w-md mx-auto px-4 py-6 bg-white">
          <div className="flex items-center mb-4 border-b border-[#F3F4F6] pb-4  -mx-4 px-4">
            <button className="mr-2 text-xl text-black" onClick={() => router.back()}><IoIosArrowBack /></button>
            <h2 className="flex-1 text-center font-semibold text-lg text-black">Book Your Slot</h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleNext}>
            {/* Slot Selection Section */}  
            <section className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-base mb-3 text-black border-b border-gray-200 pb-2">Slot Selection</h3>
              
              {/* Calendar Section */}
              <div className="mb-4">
                <div className="calendar-container">
                  <Calendar
                    onChange={handleDateChange}
                    value={date}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    tileDisabled={tileDisabled}
                    minDate={today}
                    className="w-full border rounded-lg"
                  />
                </div>
                {/* Enhanced Legend */}
                <div className="calendar-legend">
                  <div className="calendar-legend-item">
                    <div className="calendar-legend-dot available"></div>
                    <span>Available</span>
                  </div>
                  <div className="calendar-legend-item">
                    <div className="calendar-legend-dot booked"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              {/* Booking Form - Show by default OR when in edit mode OR when available date is selected */}
              {(!date || selectedDateBookings.length === 0 || isEditMode) && (
                <BookingForm
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  occasion={occasion}
                  setOccasion={setOccasion}
                  utility={utility}
                  setUtility={setUtility}
                  notes={notes}
                  setNotes={setNotes}
                  timeSlots={timeSlots}
                  date={date}
                  isEditMode={isEditMode}
                  editingBooking={editingBooking}
                />
              )}

              {/* Booked Customer Details Section - Show when there are bookings and NOT in edit mode */}
              {selectedDateBookings.length > 0 && !isEditMode && (
                <BookingCards 
                  date={date}
                  bookings={selectedDateBookings}
                  onEditBooking={(booking) => {
                    setEditingBooking(booking as Booking);
                    setIsEditMode(true);
                  }}
                />
              )}
            </section>
          </form>

          {/* Booked Customer Details Modal - Show when there are bookings and NOT in edit mode */}
          {showBookingModal && selectedDateBookings.length > 0 && !isEditMode && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setShowBookingModal(false)}></div>
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full z-50 relative">
                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                {selectedDateBookings.map((booking) => (
                  <div key={booking.id} className="mb-4 border-b pb-4">
                    <div className="font-medium">Customer: {booking.customerName}</div>
                    <div>Phone: {booking.customerPhone}</div>
                    <div>Occasion: {booking.occasion}</div>
                    <div>Utility: {booking.utility}</div>
                    <div>Notes: {booking.notes}</div>
                    <div>Payment Mode: {booking.paymentMode}</div>
                    <div>Date: {booking.date}</div>
                    <div>Time: {booking.slotTime}</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                          setEditingBooking(booking as Booking);
                          setIsEditMode(true);
                          setShowBookingModal(false);
                        }}
                      >Edit</button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={async () => {
                          await deleteBooking(booking.id);
                          setShowBookingModal(false);
                        }}
                      >Delete</button>
                    </div>
                  </div>
                ))}
                <button className="mt-2 px-4 py-2 bg-gray-200 rounded" onClick={() => setShowBookingModal(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}