"use client";
import React from 'react';

interface PersonalDetailsFormProps {
  // Form data
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
  
  // Edit mode props
  isEditMode?: boolean;
  isReadOnly?: boolean;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
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
  isEditMode = false,
  isReadOnly = false
}) => {
  const inputClassName = "w-full rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder:text-gray-300";
  const readOnlyClassName = "w-full rounded-lg px-3 py-2 bg-gray-100 outline-none text-gray-600 cursor-not-allowed";

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-base mb-3 text-black border-b border-gray-200 pb-2">
        Personal Details
        {isEditMode && <span className="text-sm text-blue-600 ml-2"></span>}
      </h3>
      
      <div className="space-y-4">
        {/* Customer Name - Only show in new booking mode */}
        {!isEditMode && (
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
        )}

        {/* Phone Numbers - Only show in new booking mode */}
        {!isEditMode && (
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
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Phone 2 <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                value={customerPhone2}
                onChange={e => setCustomerPhone2(e.target.value)}
                className={isReadOnly ? readOnlyClassName : inputClassName}
                placeholder="Enter secondary phone number"
                readOnly={isReadOnly}
              />
            </div>
          </div>
        )}

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
  );
};

export default PersonalDetailsForm; 