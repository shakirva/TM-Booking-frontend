"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

type BookingData = {
  personal: {
    customerName?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    groomName?: string;
    brideName?: string;
  };
  slot: {
    selectedTab?: string;
    selectedSlot?: number;
    selectedSlotLabel?: string;
    selectedSlotTime?: string;
    selectedSlotPrice?: number;
    date?: string;
    occasion?: string;
    notes?: string;
  };
  payment: {
    paymentType?: string;
    advanceAmount?: string;
    paymentMode?: string;
  };
};

type BookingContextType = {
  booking: BookingData;
  setBooking: Dispatch<SetStateAction<BookingData>>;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingData>({
    personal: {},
    slot: {},
    payment: {},
  });

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within a BookingProvider");
  return context;
} 