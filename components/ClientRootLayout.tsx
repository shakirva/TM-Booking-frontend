"use client";
import { BookingProvider } from '../app/context/BookingContext';
import { BookingDataProvider } from './booking/BookingDataProvider';
import IosInstallBanner from '../components/IosInstallBanner';
import InstallPwaPrompt from '../components/InstallPwaPrompt';
import '../app/globals.css';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IosInstallBanner />
      <InstallPwaPrompt />
      <BookingProvider>
        <BookingDataProvider>
          {children}
        </BookingDataProvider>
      </BookingProvider>
    </>
  );
}
