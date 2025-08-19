"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import * as api from '../../lib/api';
import { getToken } from '../../lib/auth';

// Types for the booking system
export interface Booking {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerPhone2: string;
  groomName?: string;
  brideName?: string;
  address: string;
  occasion: string;
  timeSlot: string;
  slotTime: string;
  price: number;
  notes: string;
  paymentType: 'advance' | 'full';
  advanceAmount?: string;
  paymentMode: 'bank' | 'cash' | 'upi';
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  label: string;
  time: string;
  price: number;
}

export interface BookingFormData {
  // Slot Selection
  selectedTab: 'Reception' | 'Day Time';
  selectedSlot: number;
  occasion: string;
  utility: string;
  notes: string;
  
  // Personal Details
  customerName: string;
  customerPhone: string;
  customerPhone2: string;
  groomName?: string;
  brideName?: string;
  address: string;
  
  // Payment Details
  paymentType: 'advance' | 'full';
  advanceAmount: string;
  paymentMode: 'bank' | 'cash' | 'upi';
}

// Mock data for testing - Only August 5th has bookings
// Removed mockBookings, now using backend API

export const timeSlots: TimeSlot[] = [
  { label: 'Morning Slot', time: '9:00 AM - 1:00 PM', price: 20000 },
  { label: 'Afternoon Slot', time: '2:00 PM - 6:00 PM', price: 25000 },
  { label: 'Evening Slot', time: '6:00 PM - 10:00 PM', price: 30000 },
  { label: 'Night Slot', time: '10:00 PM - 2:00 AM', price: 35000 }
];

export const occasionTypes = [
  'Wedding Reception',
  'Wedding Ceremony',
  'Engagement Party',
  'Birthday Party',
  'Corporate Event',
  'Anniversary Celebration',
  'Other'
];

export const utilityTypes = [
  'Basic Setup',
  'Premium Setup',
  'Luxury Setup',
  'Custom Setup'
];

// Context type
type BookingDataContextType = {
  // Current booking being created/edited
  currentBooking: BookingFormData | null;
  setCurrentBooking: Dispatch<SetStateAction<BookingFormData | null>>;
  
  // All bookings data
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
  
  // Booking operations
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBookingsByDate: (date: string) => Booking[];
  
  // Form data helpers
  resetForm: () => void;
  populateFormFromBooking: (booking: Booking) => void;
};

const BookingDataContext = createContext<BookingDataContextType | null>(null);

export function BookingDataProvider({ children }: { children: ReactNode }) {
  const [currentBooking, setCurrentBooking] = useState<BookingFormData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await api.getSlots(token);
      setBookings(data);
    } catch {
      // handle error
    }
  };

  // Create a new booking slot (for staff)
  const createBooking = async (bookingData: any) => {
  const token = getToken();
  if (!token) return;
  await api.createSlot(bookingData as Record<string, unknown>, token);
  fetchBookings();
  };

  // Update booking (implement if needed)
  const updateBooking = async (id: string, updates: Partial<Booking>) => {
  // Implement API call if backend supports
  };

  // Delete a booking (implement if needed)
  const deleteBooking = async (id: string) => {
    const token = getToken();
    if (!token) return;
    await api.deleteBooking(id, token);
    fetchBookings();
  };

  // Get bookings for a specific date
  const getBookingsByDate = (date: string) => {
    return bookings.filter(booking => booking.date === date);
  };

  // Reset form data
  const resetForm = () => {
    setCurrentBooking(null);
  };

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Populate form from existing booking
  const populateFormFromBooking = (booking: Booking) => {
    setCurrentBooking({
      selectedTab: booking.timeSlot as 'Reception' | 'Day Time',
      selectedSlot: 0, // Will be calculated based on timeSlot
      occasion: booking.occasion,
      utility: 'Basic Setup', // Default value
      notes: booking.notes,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerPhone2: booking.customerPhone2,
      groomName: booking.groomName || '',
      brideName: booking.brideName || '',
      address: booking.address,
      paymentType: booking.paymentType,
      advanceAmount: booking.advanceAmount || '',
      paymentMode: booking.paymentMode
    });
  };

  return (
    <BookingDataContext.Provider value={{
      currentBooking,
      setCurrentBooking,
      bookings,
      setBookings,
      createBooking,
      updateBooking,
      deleteBooking,
      getBookingsByDate,
      resetForm,
      populateFormFromBooking
    }}>
      {children}
    </BookingDataContext.Provider>
  );
}

export function useBookingData() {
  const context = useContext(BookingDataContext);
  if (!context) {
    throw new Error('useBookingData must be used within a BookingDataProvider');
  }
  return context;
}