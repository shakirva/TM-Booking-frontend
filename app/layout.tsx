import { BookingProvider } from './context/BookingContext';
import { BookingDataProvider } from '../components/booking/BookingDataProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1d4ed8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <BookingProvider>
          <BookingDataProvider>
            {children}
          </BookingDataProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
