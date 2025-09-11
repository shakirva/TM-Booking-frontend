"use client";
import React, { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useBooking } from '../context/BookingContext';
import { useBookingData, Booking } from '../../components/booking/BookingDataProvider';
import { createBookingRequest, getSlots } from '@/lib/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BookingForm from '../../components/BookingForm';
import PersonalPaymentForm from '../../components/booking/PersonalPaymentForm';
import BookingDetailsModal from './BookingDetailsModal';

export default function BookingPage() {
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/auth/login');
    }
  }, [router]);
  // Fallback slots if backend not available
  const fallbackTimeSlots = [
    { id: 1, label: 'Morning', time: '6:00 AM - 12:00 PM', price: 25000 },
    { id: 2, label: 'Evening', time: '1:00 PM - 8:00 PM', price: 30000 },
    { id: 3, label: 'Day', time: '9:00 AM - 6:00 PM', price: 60000 },
  ];
  interface Slot {
    id: number;
    label: string;
    time: string;
    price: number;
  }
  const [allSlots, setAllSlots] = useState<Slot[]>([]); // All slots from backend
  const timeSlots: Slot[] = allSlots.length > 0 ? allSlots : fallbackTimeSlots;

  // Helper function to format date as local date (matches backend storage)
  const formatDateForComparison = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  type BookingStep = 'slot-selection' | 'personal-payment';

  const { booking, setBooking } = useBooking();
  const { getBookingsByDate, fetchBookings } = useBookingData();

  // Step management
  const [currentStep, setCurrentStep] = useState<BookingStep>('slot-selection');
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]); // Multi-slot selection
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalBookings, setModalBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize date after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    if (booking?.slot?.date) {
      setDate(new Date(booking.slot.date));
    }
  }, [booking?.slot?.date]);

  // Fetch all slots from backend on mount
  useEffect(() => {
    async function fetchSlots() {
      try {
        const slots = await getSlots('');
        setAllSlots(slots);
      } catch {
        setAllSlots([]);
      }
    }
    fetchSlots();
  }, []);

  const [occasion, setOccasion] = useState(booking?.slot?.occasion ?? '');
  const [utility, setUtility] = useState(booking?.slot?.utility ?? '');
  const [notes, setNotes] = useState(booking?.slot?.notes ?? '');
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Personal details state
  const [customerName, setCustomerName] = useState(booking?.personal?.customerName ?? '');
  const [customerPhone, setCustomerPhone] = useState(booking?.personal?.phone1 ?? '');
  const [customerPhone2, setCustomerPhone2] = useState(booking?.personal?.phone2 ?? '');
  const [groomName, setGroomName] = useState(booking?.personal?.groomName ?? '');
  const [brideName, setBrideName] = useState(booking?.personal?.brideName ?? '');
  const [address, setAddress] = useState(booking?.personal?.address ?? '');

  // Payment details state
  const validPaymentTypes = ['advance', 'full'] as const;
  const validPaymentModes = ['bank', 'cash', 'upi'] as const;
  const initialPaymentType = validPaymentTypes.includes(booking?.payment?.paymentType as 'advance' | 'full') ? booking?.payment?.paymentType as 'advance' | 'full' : 'advance';
  const initialPaymentMode = validPaymentModes.includes(booking?.payment?.paymentMode as 'bank' | 'cash' | 'upi') ? booking?.payment?.paymentMode as 'bank' | 'cash' | 'upi' : 'bank';
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>(initialPaymentType);
  const [advanceAmount, setAdvanceAmount] = useState(booking?.payment?.advanceAmount ?? '');
  const [paymentMode, setPaymentMode] = useState<'bank' | 'cash' | 'upi'>(initialPaymentMode);

  const today = new Date();
  // Calculate total slot price dynamically based on selected slots
  const slotPrice = selectedSlots.reduce((sum, idx) => sum + (timeSlots[idx]?.price || 0), 0);
  const minAdvance = 10000;

  // Check if we're in edit mode by looking for existing booking data
  const isPersonalEditMode = !!(booking?.personal?.customerName && booking?.personal?.phone1);

  // Function to check if a date is booked using centralized data
  const isDateBooked = (date: Date) => {
    // Always use local date string (no time offset)
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateString = formatDateForComparison(localDate);
    const bookings = getBookingsByDate(dateString);
    if (bookings.length > 0) {
      console.log('[DEBUG] isDateBooked:', { date, localDate, dateString, bookings });
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

  // Custom tile className for calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const booked = isDateBooked(date);
      if (booked) {
        console.log('[DEBUG] tileClassName: Booked date', date);
        // Use Tailwind red classes for booked dates
        return 'bg-red-200 text-red-800 font-bold rounded-full';
      } else if (isDateAvailable(date)) {
        return 'available-date';
      }
    }
    return '';
  };

  // Disable only past dates, allow booked dates to be selectable
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  };

  // Handle calendar date change
  const handleDateChange = (value: unknown) => {
    if (value instanceof Date) {
      setDate(value);
      const dateString = formatDateForComparison(value);
      const bookings = getBookingsByDate(dateString);
      // Debug: log slotTime values for this date
      console.log('[DEBUG] handleDateChange:', { value, dateString, bookings });
      setSelectedDateBookings(bookings);
      // Reset edit mode when date changes
      setIsEditMode(false);
      setEditingBooking(null);
    }
  };

  // Handle calendar day click for showing booking details
  const handleCalendarClick = (value: Date) => {
    const dateString = formatDateForComparison(value);
    const bookings = getBookingsByDate(dateString);
    if (bookings.length > 0) {
      setModalBookings(bookings);
      setShowDetailsModal(true);
    } else {
      setDate(value);
      setSelectedDateBookings([]);
      setIsEditMode(false);
      setEditingBooking(null);
    }
  };

  // Handle step navigation
  const [submitError, setSubmitError] = useState<string | null>(null);
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'slot-selection') {
      // Validate slot selection
      if (!date) {
        alert('Please select a date');
        return;
      }
      if (!occasion.trim()) {
        alert('Please enter an occasion');
        return;
      }
      if (!selectedSlots.length) {
        alert('Please select at least one slot');
        return;
      }
      // Always use local date string for both display and backend
      const localDateString = formatDateForComparison(date);
      setBooking(prev => ({
        ...prev,
        slot: {
          selectedSlots,
          selectedSlotLabels: selectedSlots.map(idx => timeSlots[idx]?.label || ''),
          selectedSlotTimes: selectedSlots.map(idx => timeSlots[idx]?.time || ''),
          selectedSlotPrices: selectedSlots.map(idx => timeSlots[idx]?.price || 0),
          date: localDateString,
          occasion,
          utility,
          notes,
        },
      }));
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate())); // ensure no time offset
      setCurrentStep('personal-payment');
      return;
    }

    if (currentStep === 'personal-payment') {
      // Validate personal details
      if (!customerName.trim()) {
        alert('Please enter customer name');
        return;
      }
      if (!customerPhone.trim()) {
        alert('Please enter customer phone');
        return;
      }
      if (!address.trim()) {
        alert('Please enter address');
        return;
      }

      // Save personal data to context
      setBooking(prev => ({
        ...prev,
        personal: {
          groomName: groomName || undefined,
          brideName: brideName || undefined,
          customerName,
          phone1: customerPhone,
          phone2: customerPhone2,
          address,
        },
      }));

      // Since personal and payment are now combined, proceed to confirmation
      // Validate payment details
      if (paymentType === 'advance') {
        const advance = parseInt(advanceAmount);
        if (!advance || advance < minAdvance) {
          alert(`Advance amount must be at least ₹${minAdvance.toLocaleString()}`);
          return;
        }
        if (advance > slotPrice) {
          alert('Advance amount cannot exceed total amount');
          return;
        }
      }

      // Save payment data to context
      setBooking(prev => ({
        ...prev,
        payment: {
          paymentType,
          advanceAmount: paymentType === 'advance' ? advanceAmount : '',
          paymentMode,
        },
      }));

      // Send booking request to backend
      try {
        // Always use local date string for backend
        const localDateString = date ? formatDateForComparison(date) : '';
        // For each selected slot, send a booking request with the correct slot_id
        for (const idx of selectedSlots) {
          const slot = timeSlots[idx];
          await createBookingRequest({
            name: customerName,
            phone: customerPhone,
            slot_id: slot.id,
            details: notes,
            occasion_type: occasion,
            utility_type: utility,
            payment_mode: paymentMode,
            advance_amount: paymentType === 'advance' ? advanceAmount : '',
            date: localDateString,
            time: slot.time,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_phone2: customerPhone2,
            groom_name: groomName,
            bride_name: brideName,
            address: address,
            payment_type: paymentType,
          });
        }
        await fetchBookings(); // Refresh bookings after successful booking
        router.push('/booking/confirmation');
      } catch (err: unknown) {
        function isAxiosErrorWithMessage(error: unknown): error is { response: { data: { message: string } } } {
          return (
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            typeof (error as { response?: unknown }).response === 'object' &&
            (error as { response: { data?: unknown } }).response !== null &&
            'data' in (error as { response: { data?: unknown } }).response &&
            typeof ((error as { response: { data?: unknown } }).response as { data?: unknown }).data === 'object' &&
            ((error as { response: { data: { message?: unknown } } }).response.data !== null) &&
            'message' in (error as { response: { data: { message?: unknown } } }).response.data &&
            typeof ((error as { response: { data: { message?: unknown } } }).response.data as { message?: unknown }).message === 'string'
          );
        }
        if (isAxiosErrorWithMessage(err)) {
          setSubmitError(err.response.data.message);
        } else {
          setSubmitError('Failed to submit booking. Please try again.');
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'personal-payment') {
      setCurrentStep('slot-selection');
    } else {
      router.back();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'slot-selection':
        return 'Book Your Slot';
      case 'personal-payment':
        return 'Personal & Payment Details';
      default:
        return 'Book Your Slot';
    }
  };

  // For a given date, get booked slot_ids
  const getBookedSlotIdsForDate = (date: Date) => {
    const dateString = formatDateForComparison(date);
    const bookings = getBookingsByDate(dateString) as Booking[];
  return bookings.map((b) => (b as any).slot_id);
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
          <div className="flex items-center mb-4 border-b border-[#F3F4F6] pb-4 -mx-4 px-4">
            <button className="mr-2 text-xl text-black" onClick={handleBack}>
              <IoIosArrowBack />
            </button>
            <h2 className="flex-1 text-center font-semibold text-lg text-black">
              {getStepTitle()}
            </h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleNext}>
            {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
            {/* Step 1: Slot Selection */}
            {currentStep === 'slot-selection' && (
              <section className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-base mb-3 text-black border-b border-gray-200 pb-2">
                  Slot Selection
                </h3>
                {/* Calendar Section */}
                <div className="mb-4">
                  <div className="calendar-container">
                    <Calendar
                      onClickDay={handleCalendarClick}
                      onChange={handleDateChange}
                      value={date}
                      tileContent={tileContent}
                      tileClassName={tileClassName}
                      tileDisabled={tileDisabled}
                      minDate={today}
                      locale="en-US"
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
                {/* Booked Customer Details Section - Show when there are bookings and NOT in edit mode */}
                {selectedDateBookings.length > 0 && !isEditMode && (
                  <></>
                )}
                {/* Booking Form - Show by default OR when in edit mode OR when available date is selected and there are available slots */}
                {date && (
                  <BookingForm
                    selectedSlots={selectedSlots}
                    setSelectedSlots={setSelectedSlots}
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
                    // Mark slots as booked if their slot_id is in bookedSlotIds
                    bookedTimes={(() => {
                      const bookedSlotIds = getBookedSlotIdsForDate(date);
                      return timeSlots.filter((slot) => bookedSlotIds.includes(slot.id)).map((slot) => slot.time);
                    })()}
                  />
                )}
              </section>
            )}
          {/* Show modal if a booked date is clicked */}
          {showDetailsModal && modalBookings.length > 0 && (
            <BookingDetailsModal
              bookings={modalBookings}
              onClose={() => setShowDetailsModal(false)}
              onEdit={(details) => {
                // Map BookingDetails to Booking type
                setEditingBooking({
                  id: details.id,
                  date: details.date || '',
                  customerName: details.name || details.customerName || '',
                  customerPhone: details.phone || details.customerPhone || '',
                  customerPhone2: '',
                  groomName: '',
                  brideName: '',
                  address: '',
                  occasion: details.occasion_type || details.occasion || '',
                  utility: '',
                  timeSlot: '',
                  slotTime: details.time || '',
                  price: 0,
                  notes: '',
                  paymentType: details.payment_mode === 'advance' ? 'advance' : 'full',
                  advanceAmount: details.advance_amount || details.advanceAmount || '',
                  paymentMode: (['bank', 'cash', 'upi'].includes((details.payment_mode || details.paymentMode) as string)
                    ? (details.payment_mode || details.paymentMode)
                    : 'cash') as 'bank' | 'cash' | 'upi',
                  createdAt: '',
                  updatedAt: '',
                });
                setIsEditMode(true);
                setShowDetailsModal(false);
              }}
            />
          )}

            {/* Step 2: Personal & Payment Details Combined */}
            {currentStep === 'personal-payment' && (
              <PersonalPaymentForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerPhone2={customerPhone2}
                setCustomerPhone2={setCustomerPhone2}
                groomName={groomName}
                setGroomName={setGroomName}
                brideName={brideName}
                setBrideName={setBrideName}
                address={address}
                setAddress={setAddress}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                advanceAmount={advanceAmount}
                setAdvanceAmount={setAdvanceAmount}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                totalAmount={slotPrice}
                minAdvance={minAdvance}
                isEditMode={isPersonalEditMode}
              />
            )}

            {/* Cancel Button - Only show in edit mode */}
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setEditingBooking(null);
                }}
                className="bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors w-full mt-4"
              >
                Cancel
              </button>
            )}

            {/* Navigation Button */}
            <button
              type="submit"
              className="bg-[#204DC5] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-base w-full"
            >
              {currentStep === 'personal-payment' ? 'Confirm Booking' : 'Next'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
// ...existing code...
}
