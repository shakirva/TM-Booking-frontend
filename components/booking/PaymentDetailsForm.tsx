"use client";
import React from 'react';

interface PaymentDetailsFormProps {
  // Form data
  paymentType: 'advance' | 'full';
  setPaymentType: (type: 'advance' | 'full') => void;
  advanceAmount: string;
  setAdvanceAmount: (amount: string) => void;
  paymentMode: 'bank' | 'cash' | 'upi';
  setPaymentMode: (mode: 'bank' | 'cash' | 'upi') => void;
  
  // Pricing
  totalAmount: number;
  minAdvance?: number;
  
  // Edit mode props
  isEditMode?: boolean;
  isReadOnly?: boolean;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  paymentType,
  setPaymentType,
  advanceAmount,
  setAdvanceAmount,
  paymentMode,
  setPaymentMode,
  totalAmount,
  minAdvance = 10000,
  isEditMode = false,
  isReadOnly = false
}) => {
  const inputClassName = "w-full border rounded-md px-2 py-3 bg-white text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-200 border border-[#E5E7EB]";
  const readOnlyClassName = "w-full border rounded-md px-2 py-3 bg-gray-100 text-gray-600 text-sm cursor-not-allowed border border-gray-300";

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-base mb-3 text-black border-b border-gray-200 pb-2">
        Payment Details
        {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editing)</span>}
      </h3>
      
      <div className="space-y-4">
        {/* Payment Type Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 mb-1 text-sm font-medium">Payment Type</label>
          
          {/* Advance Payment Option */}
          <label className={`border rounded-lg px-4 py-3 cursor-pointer flex items-start gap-2 ${
            paymentType === 'advance' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
          } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''}`}>
            <div className="flex-1">
              <div className="font-medium text-black">Advance Payment</div>
              <input
                type="number"
                min={minAdvance}
                placeholder="Enter Amount"
                value={advanceAmount}
                onChange={e => setAdvanceAmount(e.target.value)}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                disabled={paymentType !== 'advance' || isReadOnly}
              />
              <div className="text-xs text-gray-400 mt-1">Min : ₹{minAdvance.toLocaleString()}</div>
            </div>
            <input
              type="radio"
              name="paymentType"
              checked={paymentType === 'advance'}
              onChange={() => !isReadOnly && setPaymentType('advance')}
              className="accent-blue-600 mt-2"
              disabled={isReadOnly}
            />
          </label>
          
          {/* Full Payment Option */}
          <label className={`border rounded-lg px-4 py-3 cursor-pointer flex items-start gap-2 ${
            paymentType === 'full' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
          } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''}`}>
            <div className="flex-1">
              <div className="font-medium text-black">Full Payment</div>
              <div className="mt-2 text-lg font-semibold text-black">₹{totalAmount.toLocaleString()}</div>
            </div>
            <input
              type="radio"
              name="paymentType"
              checked={paymentType === 'full'}
              onChange={() => !isReadOnly && setPaymentType('full')}
              className="accent-blue-600 mt-2"
              disabled={isReadOnly}
            />
          </label>
        </div>

        {/* Total Amount Display */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 text-sm">
          <div className="flex justify-between font-bold mt-1">
            <span className='text-black'>Total Amount</span>
            <span className='text-black'>₹{totalAmount.toLocaleString()}</span>
          </div>
         
        
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={e => !isReadOnly && setPaymentMode(e.target.value as 'bank' | 'cash' | 'upi')}
            className={isReadOnly ? readOnlyClassName : "w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-400"}
            disabled={isReadOnly}
          >
            <option value="bank">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default PaymentDetailsForm; 