"use client";
import React from 'react';

interface PersonalPaymentFormProps {
  // Personal details
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerPhone2: string;
  setCustomerPhone2: (phone: string) => void;
  groomName: string;
  setGroomName: (name: string) => void;
  brideName: string;
  setBrideName: (name: string) => void;
  address: string;
  setAddress: (address: string) => void;
  
  // Payment details
  paymentType: 'advance' | 'full';
  setPaymentType: (type: 'advance' | 'full') => void;
  advanceAmount: string;
  setAdvanceAmount: (amount: string) => void;
  paymentMode: 'bank' | 'cash' | 'upi';
  setPaymentMode: (mode: 'bank' | 'cash' | 'upi') => void;
  totalAmount: number;
  minAdvance?: number;
  
  // Edit mode props
  isEditMode?: boolean;
  isReadOnly?: boolean;
}

const PersonalPaymentForm: React.FC<PersonalPaymentFormProps> = ({
  // Personal details
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerPhone2,
  setCustomerPhone2,
  groomName,
  setGroomName,
  brideName,
  setBrideName,
  address,
  setAddress,
  
  // Payment details
  paymentType,
  setPaymentType,
  advanceAmount,
  setAdvanceAmount,
  paymentMode,
  setPaymentMode,
  totalAmount,
  // minAdvance removed
  
  // Edit mode props
  isEditMode = false,
  isReadOnly = false
}) => {
  const inputClassName = "w-full rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-300";
  const readOnlyClassName = "w-full rounded-lg px-3 py-2 bg-gray-100 outline-none text-gray-600 cursor-not-allowed";
  const paymentInputClassName = "w-full border rounded-md px-2 py-3 bg-white text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-200 border border-[#E5E7EB]";
  const paymentReadOnlyClassName = "w-full border rounded-md px-2 py-3 bg-gray-100 text-gray-600 text-sm cursor-not-allowed border border-gray-300";

  return (
    <div className="space-y-4">
      {/* Personal Details Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-base mb-3 text-black border-b border-gray-200 pb-2">
          Personal Details
          {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editing)</span>}
        </h3>
        
        <div className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className={isReadOnly ? readOnlyClassName : inputClassName}
              placeholder="Enter your full name"
              readOnly={isReadOnly}
              required
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Phone 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                placeholder="Enter primary phone number"
                readOnly={isReadOnly}
                required
                inputMode="numeric"
                pattern="\\d{10}"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Phone 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone2}
                onChange={e => setCustomerPhone2(e.target.value)}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                placeholder="Enter secondary phone number"
                readOnly={isReadOnly}
                required
                inputMode="numeric"
                pattern="\\d{10}"
                maxLength={10}
              />
            </div>
          </div>

          {/* Groom and Bride Names */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-2">
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={e => setGroomName(e.target.value)}
                  className={isReadOnly ? readOnlyClassName : inputClassName}
                  placeholder="Enter groom's name"
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={e => setBrideName(e.target.value)}
                  className={isReadOnly ? readOnlyClassName : inputClassName}
                  placeholder="Enter bride's name"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              className={isReadOnly ? readOnlyClassName : inputClassName}
              placeholder="Enter your complete address"
              rows={3}
              readOnly={isReadOnly}
              required
            />
          </div>
        </div>
      </section>

      {/* Payment Details Section */}
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
                  min={0}
                  placeholder="Enter Amount"
                  value={advanceAmount}
                  onChange={e => setAdvanceAmount(e.target.value)}
                  className={isReadOnly ? paymentReadOnlyClassName : paymentInputClassName}
                  disabled={paymentType !== 'advance' || isReadOnly}
                />
                {/* Min advance removed */}
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

          {/* Balance Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 text-sm">
            <div className="flex justify-between font-bold mt-1">
              <span className='text-black'>Balance Amount</span>
              <span className='text-black'>₹{(totalAmount - (parseFloat(advanceAmount) || 0)).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={e => !isReadOnly && setPaymentMode(e.target.value as 'bank' | 'cash' | 'upi')}
              className={isReadOnly ? paymentReadOnlyClassName : "w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-400"}
              disabled={isReadOnly}
            >
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalPaymentForm;
