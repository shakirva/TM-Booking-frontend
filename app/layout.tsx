
import ClientRootLayout from '../components/ClientRootLayout';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="description" content="A modern booking SaaS PWA for hall reservations." />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* iOS Home Screen icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/tm.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/tm.png" />
        
        {/* Apple PWA meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TM Booking" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft Windows/Edge */}
        <meta name="msapplication-TileColor" content="#1d4ed8" />
        <meta name="msapplication-TileImage" content="/icons/tm.png" />
        <meta name="msapplication-config" content="none" />
        
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/tm.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/tm.png" />
        <link rel="shortcut icon" href="/icons/tm.png" />
      </head>
      <body>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
