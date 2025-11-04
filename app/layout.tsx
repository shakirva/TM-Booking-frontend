
import ClientRootLayout from '../components/ClientRootLayout';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1d4ed8" />
        <link rel="manifest" href="/manifest.json" />
        {/* iOS Home Screen icon (Apple ignores manifest icons) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/tm.png" />
        {/* Apple PWA meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TM Booking App" />
      </head>
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
