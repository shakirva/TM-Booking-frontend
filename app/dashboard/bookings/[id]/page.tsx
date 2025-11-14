"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { FaEdit, FaDownload } from "react-icons/fa";

// Expanded mock data for all booking IDs
const bookings = [
  {
    id: "BK-2024-001",
    customer: {
      fullName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 111-2222",
      address: "101 Main St, Springfield, IL 62701"
    },
    booking: {
      groomName: "John Smith",
      brideName: "Sarah Johnson",
      date: "Jan 15, 2024",
      occasionType: "Wedding",
      timeSlot: "Afternoon (2:00 PM - 6:00 PM)"
    },
    utilities: [
      { name: "Sound System", type: "Premium", price: 200 },
      { name: "Stage Lighting", type: "Standard", price: 150 }
    ],
    payment: {
      basePrice: 2500,
      utilities: 350,
      additionalServices: 100,
      discount: 200,
      subtotal: 2950,
      tax: 531,
      totalAmount: 3481,
      amountPaid: 3481,
      balance: 0
    },
    paymentTimeline: [
      { amount: 1740, description: "Advance Payment", date: "Jan 10, 2024", status: "Completed" },
      { amount: 1741, description: "Final Payment", date: "Jan 15, 2024", status: "Completed" }
    ],
    status: "Confirmed"
  },
  {
    id: "BK-2024-002",
    customer: {
      fullName: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 333-4444",
      address: "202 Oak Ave, Palo Alto, CA 94301"
    },
    booking: {
      groomName: "-",
      brideName: "-",
      date: "Jan 16, 2024",
      occasionType: "Conference",
      timeSlot: "Morning (9:00 AM - 12:00 PM)"
    },
    utilities: [
      { name: "Projector", type: "Standard", price: 100 }
    ],
    payment: {
      basePrice: 1800,
      utilities: 100,
      additionalServices: 50,
      discount: 0,
      subtotal: 1950,
      tax: 351,
      totalAmount: 2301,
      amountPaid: 1000,
      balance: 1301
    },
    paymentTimeline: [
      { amount: 1000, description: "Advance Payment", date: "Jan 12, 2024", status: "Completed" }
    ],
    status: "Pending"
  },
  {
    id: "BK-2024-003",
    customer: {
      fullName: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 (555) 555-6666",
      address: "303 Pine Rd, Austin, TX 78701"
    },
    booking: {
      groomName: "-",
      brideName: "-",
      date: "Jan 17, 2024",
      occasionType: "Corporate Event",
      timeSlot: "Evening (4:00 PM - 8:00 PM)"
    },
    utilities: [
      { name: "Catering", type: "Premium", price: 500 }
    ],
    payment: {
      basePrice: 3200,
      utilities: 500,
      additionalServices: 0,
      discount: 150,
      subtotal: 3700,
      tax: 666,
      totalAmount: 4366,
      amountPaid: 3200,
      balance: 1166
    },
    paymentTimeline: [
      { amount: 3200, description: "Advance Payment", date: "Jan 15, 2024", status: "Completed" }
    ],
    status: "Confirmed"
  },
  {
    id: "BK-2024-004",
    customer: {
      fullName: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 777-8888",
      address: "404 Cedar Blvd, Miami, FL 33101"
    },
    booking: {
      groomName: "-",
      brideName: "-",
      date: "Jan 18, 2024",
      occasionType: "Performance",
      timeSlot: "Night (7:00 PM - 11:00 PM)"
    },
    utilities: [
      { name: "Stage", type: "Standard", price: 200 }
    ],
    payment: {
      basePrice: 2100,
      utilities: 200,
      additionalServices: 0,
      discount: 0,
      subtotal: 2300,
      tax: 414,
      totalAmount: 2714,
      amountPaid: 0,
      balance: 2714
    },
    paymentTimeline: [],
    status: "Cancelled"
  }
];

export default function BookingDetailPage() {
  const router = useRouter();
  // Strongly type route params to access `id`
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const booking = bookings.find((b) => b.id === id);
  const [discountAmount, setDiscountAmount] = useState(booking?.payment.discount || 0);

  if (!booking) {
    return (
      <div className="p-8 text-center text-gray-500">Booking not found.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <button 
            onClick={() => router.push("/dashboard/bookings")}
            className="hover:text-blue-600"
          >
            Bookings
          </button>
          <span>›</span>
          <span>Booking Details</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {booking.status}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaEdit className="w-4 h-4" />
              Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FaDownload className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name</span>
                <span className="font-medium text-black">{booking.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-black">{booking.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium text-black">{booking.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address</span>
                <span className="font-medium text-right max-w-xs text-black">{booking.customer.address}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Groom Name</span>
                <span className="font-medium text-black">{booking.booking.groomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bride Name</span>
                <span className="font-medium text-black">{booking.booking.brideName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-black">{booking.booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occasion Type</span>
                <span className="font-medium text-black">{booking.booking.occasionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Slot</span>
                <span className="font-medium text-black">{booking.booking.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Selected Utilities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Selected Utilities</h2>
            <div className="space-y-3">
              {booking.utilities.map((utility, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-black">{utility.name}</span>
                    <span className="text-gray-500 ml-2">({utility.type})</span>
                  </div>
                  <span className="font-medium text-black">₹{utility.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium text-black">₹{booking.payment.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilities</span>
                <span className="font-medium text-black">₹{booking.payment.utilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-black">₹{booking.payment.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-bold text-black">Total Amount</span>
                <span className="text-lg font-bold text-black">₹{(booking.payment.subtotal - discountAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-blue-600 font-medium">₹{booking.payment.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance</span>
                <span className="font-medium text-black">₹{booking.payment.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Payment Timeline</h2>
            <div className="space-y-4">
              {booking.paymentTimeline.map((payment, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-black">₹{payment.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{payment.description}</div>
                      <div className="text-xs text-gray-500">{payment.date}</div>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">{payment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 