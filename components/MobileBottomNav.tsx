"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname() || '';
  const items = [
    { label: 'Home', href: '/dashboard', icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg>) },
    { label: 'Bookings', href: '/dashboard/bookings', icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M4 10h16"/></svg>) },
    { label: 'Users', href: '/dashboard/users', icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>) },
    { label: 'Reports', href: '/dashboard/reports', icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"/><path d="M7 13v4M12 9v8M17 6v11"/></svg>) },
    { label: 'Settings', href: '/dashboard/settings', icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>) },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white border rounded-xl shadow-lg px-3 py-2 flex justify-between">
        {items.map(it => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          return (
            <Link key={it.href} href={it.href} className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 ${active ? 'text-blue-600' : 'text-gray-600'}`}>
              <div className="mb-0">{it.icon}</div>
              <div className="text-[11px]">{it.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
