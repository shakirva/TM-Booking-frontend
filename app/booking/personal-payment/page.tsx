"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '../../context/BookingContext';

import PersonalDetailsForm from '../../../components/booking/PersonalDetailsForm';
import PaymentDetailsForm from '../../../components/booking/PaymentDetailsForm';
import { IoChevronBackOutline } from "react-icons/io5";


export default function PersonalPaymentPage() {
  const { booking, setBooking } = useBooking();
  const router = useRouter();

  // Check if we're in edit mode by looking for existing booking data
  const isEditMode = !!(booking?.personal?.customerName && booking?.personal?.phone1);

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

  const slotPrice = booking?.slot?.selectedSlotPrice ?? 0;
  const minAdvance = 10000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      payment: {
        paymentType,
        advanceAmount,
        paymentMode,
      }
    }));
    router.push('/booking/confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <main className="w-full max-w-2xl p-0 sm:p-4">
        <div className="max-w-md mx-auto px-4 py-6 bg-white">
          <div className="flex items-center mb-4 border-b border-[#F3F4F6] pb-4  -mx-4 px-4">
            <button className="mr-2 text-xl text-black" onClick={() => router.push('/booking/slot-selection')}><IoChevronBackOutline /></button>
            <h2 className="flex-1 text-center font-semibold text-lg text-black">Personal & Payment Details</h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {/* Personal Details Form */}
            <PersonalDetailsForm
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
              isEditMode={isEditMode}
            />
            
            {/* Payment Details Form */}
            <PaymentDetailsForm
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              advanceAmount={advanceAmount}
              setAdvanceAmount={setAdvanceAmount}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              totalAmount={slotPrice}
              minAdvance={minAdvance}
            />
            <button
              type="submit"
              className="bg-[#204DC5] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-base w-full mt-4"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 