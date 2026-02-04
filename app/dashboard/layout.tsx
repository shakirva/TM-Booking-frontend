"use client";
import React from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { usePathname } from "next/navigation";
import Image from "next/image";
import MobileBottomNav from '../../components/MobileBottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean).slice(1); // skip 'dashboard'
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Get profile info from localStorage (set by settings page)
  const [profileName, setProfileName] = React.useState('John Doe');
  const [profileImage, setProfileImage] = React.useState('');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('profileName');
      const image = localStorage.getItem('profileImage');
      if (name) setProfileName(name);
      if (image) setProfileImage(image);
    }
  }, []);

  // Sidebar nav items
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
    ) },
    { label: 'Event log', href: '/dashboard/deleted-bookings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6l1-2h4l1 2"/></svg>
    ) },
    { label: 'Users', href: '/dashboard/users', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
    ) },
    { label: 'Reports', href: '/dashboard/reports', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"/><path d="M7 13v4M12 9v8M17 6v11"/></svg>
    ) },
    { label: 'Slots', href: '/dashboard/slots', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
    ) },
    { label: 'Settings', href: '/dashboard/settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    ) },
  ];

  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFF]">
      {/* Desktop Sidebar */}
  <aside className="hidden md:flex w-64 bg-white border-r flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-lg tracking-widest border-[#E5E7EB] border-b text-black">
          <span className="text-blue-700 mr-2"><Image src="/icons/tm.png" alt="logo" width={42} height={42} /></span> TM MAHAL
        </div>
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <div className="font-bold text-lg tracking-widest flex items-center text-black">
              <span className="text-blue-700 mr-2"><Image src="/icons/tm.png" alt="logo" width={38} height={48} /></span> TM MAHAL
            </div>
            <button aria-label="Close menu" className="p-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.href === '/dashboard'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
  <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              aria-label="Open menu"
              className="md:hidden p-2 rounded hover:bg-gray-100 text-gray-700"
              onClick={() => setMobileOpen(true)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            {/* Breadcrumbs */}
            <nav className="text-sm text-gray-400 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
              <span>Dashboard</span>
              {segments.map((seg, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-gray-300">&gt;</span>
                  {idx === segments.length - 1 ? (
                    <span className="text-black font-medium capitalize">{seg.replace(/-/g, ' ')}</span>
                  ) : (
                    <a href={`/dashboard/${segments.slice(0, idx + 1).join("/")}`} className="hover:underline capitalize">{seg.replace(/-/g, ' ')}</a>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {profileImage ? (
                <Image src={profileImage} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">👤</span>
              )}
              <div className="hidden sm:block">
                <div className="font-medium text-black text-sm">{profileName}</div>
                <div className="text-xs text-gray-400">Admin</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs md:text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
        </main>
        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
} 