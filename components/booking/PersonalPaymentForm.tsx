"use client";
import React, { useState } from 'react';

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
  paymentMode: 'bank' | 'cash' | 'upi' | '';
  setPaymentMode: (mode: 'bank' | 'cash' | 'upi') => void;
  totalAmount: number;
  minAdvance?: number;
  
  // Night option
  includeNight?: boolean;
  setIncludeNight?: (value: boolean) => void;
  nightPrice?: number;
  
  // Utensil and Remarks
  utensil?: string;
  setUtensil?: (utensil: string) => void;
  remarks?: string;
  setRemarks?: (remarks: string) => void;
  
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
  minAdvance,
  
  // Night option
  includeNight = false,
  setIncludeNight,
  nightPrice = 0,
  
  // Utensil and Remarks
  utensil = '',
  setUtensil,
  remarks = '',
  setRemarks,
  
  // Edit mode props
  isEditMode = false,
  isReadOnly = false
}) => {
  const [addressError, setAddressError] = useState<string>('');
  const [paymentModeError, setPaymentModeError] = useState<string>('');
  
  // Ensure mobile-friendly text size to prevent iOS zoom on focus
  const inputClassName = "w-full rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-300 text-base";
  const readOnlyClassName = "w-full rounded-lg px-3 py-2 bg-gray-100 outline-none text-gray-600 cursor-not-allowed";
  const paymentInputClassName = "w-full border rounded-md px-2 py-3 bg-white text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-200 border border-[#E5E7EB]";
  const paymentReadOnlyClassName = "w-full border rounded-md px-2 py-3 bg-gray-100 text-gray-600 text-sm cursor-not-allowed border border-gray-300";

  // Address validation handler
  const handleAddressChange = (value: string) => {
    if (value.length > 140) {
      setAddressError('Address must be 140 characters or less');
      setAddress(value.slice(0, 140));
    } else {
      setAddressError('');
      setAddress(value);
    }
  };

  // Payment mode validation
  const handlePaymentModeChange = (mode: 'bank' | 'cash' | 'upi') => {
    setPaymentModeError('');
    setPaymentMode(mode);
  };

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
                onChange={e => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) {
                    setCustomerPhone(val);
                  }
                }}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                placeholder="Enter primary phone (10 digits)"
                readOnly={isReadOnly}
                required
                inputMode="numeric"
                autoComplete="tel"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Phone 2 <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                value={customerPhone2}
                onChange={e => {
                  const val = e.target.value;
                  if (/^\d{0,11}$/.test(val)) {
                    setCustomerPhone2(val);
                  }
                }}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                placeholder="Secondary phone (optional)"
                readOnly={isReadOnly}
                inputMode="numeric"
                autoComplete="tel"
                maxLength={11}
              />
            </div>
          </div>

          {/* Groom and Bride Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Groom Name <span className="text-gray-400">(Optional)</span>
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
                Bride Name <span className="text-gray-400">(Optional)</span>
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

          {/* Address with 140 char limit */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Address <span className="text-red-500">*</span>
              <span className="text-gray-400 text-xs ml-2">({address.length}/140)</span>
            </label>
            <textarea
              value={address}
              onChange={e => handleAddressChange(e.target.value)}
              className={`${isReadOnly ? readOnlyClassName : inputClassName} ${addressError ? 'border-red-500 border' : ''}`}
              placeholder="Enter complete address (max 140 characters)"
              rows={2}
              readOnly={isReadOnly}
              required
              maxLength={140}
            />
            {addressError && (
              <p className="text-red-500 text-xs mt-1">{addressError}</p>
            )}
          </div>
          
          {/* Utensil Field */}
          {setUtensil && (
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Utensil <span className="text-gray-400">(Optional)</span>
              </label>
              <select
                value={utensil}
                onChange={e => setUtensil(e.target.value)}
                className={isReadOnly ? readOnlyClassName : "w-full border rounded-lg px-3 py-3 border-[#E5E7EB] outline-none focus:ring-2 focus:ring-blue-200 text-black"}
                disabled={isReadOnly}
              >
                <option value="">Select utensil option</option>
                <option value="Yes">Yes - Include utensils</option>
                <option value="No">No - Not needed</option>
              </select>
            </div>
          )}
          
          {/* Remarks Field */}
          {setRemarks && (
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Remarks <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                placeholder="Any special requirements or notes..."
                rows={2}
                readOnly={isReadOnly}
                maxLength={500}
              />
            </div>
          )}
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-base mb-3 text-black border-b border-gray-200 pb-2">
          Payment Details
          {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editing)</span>}
        </h3>
        
        <div className="space-y-4">
          {/* Night Option Toggle */}
          {setIncludeNight && !isReadOnly && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-700 font-medium text-sm">Include Night</label>
                  <p className="text-xs text-gray-500 mt-0.5">Add night charges (+₹{nightPrice.toLocaleString()})</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeNight(!includeNight)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    includeNight ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeNight ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
          
          {/* Night Charges Display */}
          {includeNight && nightPrice > 0 && (
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-700">Night Charges Included:</span>
                <span className="font-semibold text-indigo-700">+₹{nightPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
          
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
                  min={typeof minAdvance === 'number' ? minAdvance : 10000}
                  step={1}
                  placeholder={typeof minAdvance === 'number' ? `Minimum ₹${minAdvance.toLocaleString()}` : 'Minimum ₹10,000'}
                  value={advanceAmount}
                  onChange={e => setAdvanceAmount(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                  className={isReadOnly ? paymentReadOnlyClassName : paymentInputClassName}
                  disabled={paymentType !== 'advance' || isReadOnly}
                  required={paymentType === 'advance'}
                  inputMode="numeric"
                />
                {!isReadOnly && paymentType === 'advance' && (
                  <div className="text-xs text-gray-500 mt-2">Minimum advance is <span className="font-semibold">₹{(typeof minAdvance === 'number' ? minAdvance : 10000).toLocaleString()}</span></div>
                )}
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
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Slot Amount:</span>
              <span>₹{(totalAmount - (includeNight ? nightPrice : 0)).toLocaleString()}</span>
            </div>
            {includeNight && nightPrice > 0 && (
              <div className="flex justify-between text-sm text-indigo-600">
                <span>Night Charges:</span>
                <span>₹{nightPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Amount:</span>
              <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
            </div>
            {paymentType === 'advance' && advanceAmount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Advance Paid:</span>
                <span>-₹{(parseFloat(advanceAmount) || 0).toLocaleString()}</span>
              </div>
            )}
            {paymentType === 'full' && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Full Payment:</span>
                <span>-₹{totalAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200">
              <span className='text-black'>Balance Amount</span>
              <span className='text-orange-600'>₹{paymentType === 'full' ? '0' : (totalAmount - (parseFloat(advanceAmount) || 0)).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Mode - MANDATORY */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                { value: 'cash', label: 'Cash', icon: '💵' },
                { value: 'upi', label: 'UPI', icon: '📱' }
              ].map(mode => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => !isReadOnly && handlePaymentModeChange(mode.value as 'bank' | 'cash' | 'upi')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMode === mode.value 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  disabled={isReadOnly}
                >
                  <div className="text-xl mb-1">{mode.icon}</div>
                  <div className="text-xs font-medium">{mode.label}</div>
                </button>
              ))}
            </div>
            {paymentModeError && (
              <p className="text-red-500 text-xs mt-1">{paymentModeError}</p>
            )}
            {!paymentMode && !isReadOnly && (
              <p className="text-amber-600 text-xs mt-1">⚠️ Please select a payment mode</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalPaymentForm;
