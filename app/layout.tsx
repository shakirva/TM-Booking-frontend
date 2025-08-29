import { BookingProvider } from './context/BookingContext';
import { BookingDataProvider } from '../components/booking/BookingDataProvider';
import IosInstallBanner from '../components/IosInstallBanner';
import dynamic from 'next/dynamic';
const InstallPwaPrompt = dynamic(() => import('../components/InstallPwaPrompt'), { ssr: false });
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // iOS install banner moved to client component

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1d4ed8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
  <IosInstallBanner />
  <InstallPwaPrompt />
        <BookingProvider>
          <BookingDataProvider>
            {children}
          </BookingDataProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
