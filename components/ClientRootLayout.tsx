"use client";
import { BookingProvider } from '../app/context/BookingContext';
import { BookingDataProvider } from './booking/BookingDataProvider';
import EnhancedPwaPrompt from './EnhancedPwaPrompt';
import '../app/globals.css';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnhancedPwaPrompt />
      <BookingProvider>
        <BookingDataProvider>
          {children}
        </BookingDataProvider>
      </BookingProvider>
    </>
  );
}
