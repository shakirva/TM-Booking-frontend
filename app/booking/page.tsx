"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useBooking } from '../context/BookingContext';
import { useBookingData, Booking } from '../../components/booking/BookingDataProvider';
import { createBookingRequest } from '../../lib/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BookingForm from '../../components/BookingForm';
import PersonalPaymentForm from '../../components/booking/PersonalPaymentForm';

const receptionSlots = [
  { label: 'Evening', time: '3:00 PM - 6:00 PM', price: 20000 },
  { label: 'Night', time: '4:00 PM - 7:00 PM', price: 40000 },
];
const dayTimeSlots = [
  { label: 'Day', time: '9:00 AM - 6:00 PM', price: 60000 },
];

// Helper function to format date consistently
const formatDateForComparison = (date: Date) => {
  return date.toISOString().split('T')[0];
};

type BookingStep = 'slot-selection' | 'personal-payment';

export default function BookingPage() {
  const { booking, setBooking } = useBooking();
  const { getBookingsByDate } = useBookingData();
  const router = useRouter();

  // Step management
  const [currentStep, setCurrentStep] = useState<BookingStep>('slot-selection');

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

  const timeSlots = selectedTab === 'Day Time' ? dayTimeSlots : receptionSlots;
  const today = new Date();
  const slotPrice = booking?.slot?.selectedSlotPrice ?? 0;
  const minAdvance = 10000;

  // Check if we're in edit mode by looking for existing booking data
  const isPersonalEditMode = !!(booking?.personal?.customerName && booking?.personal?.phone1);

  // Function to check if a date is booked using centralized data
  const isDateBooked = (date: Date) => {
    const dateString = formatDateForComparison(date);
    const bookings = getBookingsByDate(dateString);
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
      if (isDateBooked(date)) {
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
      setSelectedDateBookings(bookings);
      
      // Reset edit mode when date changes
      setIsEditMode(false);
      setEditingBooking(null);
    }
  };

  // Handle step navigation
  const [submitError, setSubmitError] = useState<string | null>(null);
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
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

      // Save slot data to context
      const selectedSlotData = timeSlots[selectedSlot];
      setBooking(prev => ({
        ...prev,
        slot: {
          selectedTab,
          selectedSlot,
          selectedSlotLabel: selectedSlotData.label,
          selectedSlotTime: selectedSlotData.time,
          selectedSlotPrice: selectedSlotData.price,
          date: date.toISOString().split('T')[0],
          occasion,
          utility,
          notes,
        },
      }));

      setCurrentStep('personal-payment');
    } else if (currentStep === 'personal-payment') {
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
        await createBookingRequest({
          name: customerName,
          phone: customerPhone,
          slot_id: 1, // You may want to map selected slot to backend slot_id
          details: notes,
          occasion_type: occasion,
          utility_type: utility,
          payment_mode: paymentMode,
          advance_amount: paymentType === 'advance' ? advanceAmount : '',
          date: date ? date.toISOString().split('T')[0] : '',
          time: (selectedTab === 'Day Time' ? dayTimeSlots[selectedSlot]?.time : receptionSlots[selectedSlot]?.time) || '',
          // Add all possible fields for backend compatibility
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_phone2: customerPhone2,
          groom_name: groomName,
          bride_name: brideName,
          address: address,
          payment_type: paymentType,
        });
        router.push('/booking/confirmation');
      } catch {
        setSubmitError('Failed to submit booking. Please try again.');
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
                  <>
                    {/* Show booked details for this tab */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 text-black">Booked Slots ({selectedTab})</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedDateBookings.filter(b => b.timeSlot === selectedTab).length === 0 ? (
                          <li className="text-gray-500">No bookings for this tab</li>
                        ) : (
                          selectedDateBookings.filter(b => b.timeSlot === selectedTab).map((b, idx) => (
                            <li key={idx} className="border rounded-lg p-2 bg-white">
                              <div className="font-semibold text-black">{b.slotTime}</div>
                              <div className="text-xs text-gray-600">Customer: {b.customerName || '-'}</div>
                              <div className="text-xs text-gray-600">Phone: {b.customerPhone || '-'}</div>
                              <div className="text-xs text-gray-600">Occasion: {b.occasion || '-'}</div>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    {/* Show available slots for this date and tab */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm mb-2 text-black">Available Slots</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {(() => {
                          // If 'Day' is booked, no slots are available for any tab
                          const isDayBooked = selectedDateBookings.some(b => b.slotTime === '9:00 AM - 6:00 PM');
                          if (isDayBooked) {
                            return <li className="text-gray-500">No slots available</li>;
                          }
                          // Reception tab logic
                          if (selectedTab === 'Reception') {
                            const isEveningBooked = selectedDateBookings.some(b => b.slotTime === '3:00 PM - 6:00 PM' && b.timeSlot === 'Reception');
                            const isNightBooked = selectedDateBookings.some(b => b.slotTime === '4:00 PM - 7:00 PM' && b.timeSlot === 'Reception');
                            const availableReceptionSlots = timeSlots.filter(slot => {
                              if (slot.time === '3:00 PM - 6:00 PM') return !isEveningBooked;
                              if (slot.time === '4:00 PM - 7:00 PM') return !isNightBooked;
                              return false;
                            });
                            if (availableReceptionSlots.length === 0) {
                              return <li className="text-gray-500">No slots available</li>;
                            }
                            return availableReceptionSlots.map((slot, idx) => (
                              <li key={idx} className="text-green-700 font-medium">{slot.label} ({slot.time})</li>
                            ));
                          }
                          // Day Time tab logic (only one slot, so just check if it's booked)
                          const isDayTimeBooked = selectedDateBookings.some(b => b.slotTime === '9:00 AM - 6:00 PM' && b.timeSlot === 'Day Time');
                          if (isDayTimeBooked) {
                            return <li className="text-gray-500">No slots available</li>;
                          }
                          return timeSlots.filter(slot => slot.time === '9:00 AM - 6:00 PM').map((slot, idx) => (
                            <li key={idx} className="text-green-700 font-medium">{slot.label} ({slot.time})</li>
                          ));
                        })()}
                      </ul>
                    </div>
                  </>
                )}

                {/* Booking Form - Show by default OR when in edit mode OR when available date is selected and there are available slots */}
                {((!date || selectedDateBookings.length === 0 || isEditMode) || (selectedDateBookings.length > 0 && !isEditMode && (() => {
                  // If 'Day' is booked, no slots are available
                  const isDayBooked = selectedDateBookings.some(b => b.slotTime === '9:00 AM - 6:00 PM' && b.timeSlot === selectedTab);
                  if (isDayBooked) return false;
                  // If 'Evening' or 'Night' is booked, only 'Day' and unbooked slots are available
                  const isEveningBooked = selectedDateBookings.some(b => b.slotTime === '3:00 PM - 6:00 PM' && b.timeSlot === selectedTab);
                  const isNightBooked = selectedDateBookings.some(b => b.slotTime === '4:00 PM - 7:00 PM' && b.timeSlot === selectedTab);
                  return timeSlots.filter(slot => {
                    if (isEveningBooked || isNightBooked) {
                      if (slot.time === '9:00 AM - 6:00 PM') return true;
                      return !selectedDateBookings.some(b => b.slotTime === slot.time && b.timeSlot === selectedTab);
                    }
                    return !selectedDateBookings.some(b => b.slotTime === slot.time && b.timeSlot === selectedTab);
                  }).length > 0;
                })())) && (
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
                    bookedTimes={(() => {
                      // If 'Day' is booked, all slots are booked
                      const isDayBooked = selectedDateBookings.some(b => b.slotTime === '9:00 AM - 6:00 PM' && b.timeSlot === selectedTab);
                      if (isDayBooked) return timeSlots.map(s => s.time);
                      // If 'Evening' or 'Night' is booked, only 'Day' and unbooked slots are available
                      const isEveningBooked = selectedDateBookings.some(b => b.slotTime === '3:00 PM - 6:00 PM' && b.timeSlot === selectedTab);
                      const isNightBooked = selectedDateBookings.some(b => b.slotTime === '4:00 PM - 7:00 PM' && b.timeSlot === selectedTab);
                      if (isEveningBooked || isNightBooked) {
                        return timeSlots.filter(slot => slot.time !== '9:00 AM - 6:00 PM').map(s => s.time).filter(time => selectedDateBookings.some(b => b.slotTime === time && b.timeSlot === selectedTab));
                      }
                      return selectedDateBookings.filter(b => b.timeSlot === selectedTab).map(b => b.slotTime);
                    })()}
                  />
                )}
              </section>
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
}
