"use client";

import React, { useEffect, useState } from "react";
import { registerServiceWorker } from "../lib/serviceWorker";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const EnhancedPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const FORCE = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_PWA_PROMPT === '1';

  useEffect(() => {
    // Detect device and installation status
    const detectDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isAndroidDevice = /android/.test(userAgent);
      
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
    };

    const detectInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as Navigator & { standalone?: boolean }).standalone
        || window.location.search.includes('utm_source=homescreen');
      
      setIsInstalled(isStandalone);
    };

    const shouldShowPrompt = () => {
      if (FORCE) return true;
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) return true;
      
      const dismissedTime = parseInt(dismissed);
      const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      return daysSince > 7; // Show again after 7 days
    };

    detectDevice();
    detectInstallation();
    
    // Register service worker
    registerServiceWorker();

  if (isInstalled && !FORCE) return;

    // Handle beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(event);
      
      if (shouldShowPrompt()) setShowPrompt(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-prompt-dismissed');
    };

    // Show prompt for iOS or other devices without native support
    if ((isIOS || (!deferredPrompt && shouldShowPrompt()))) {
      if (!isInstalled || FORCE) setShowPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, deferredPrompt, isIOS, FORCE]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Native Chrome/Android install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
      } else {
        handleDismiss();
      }
    } else if (isIOS) {
      // iOS manual instructions
      alert(
        "📱 Install TM Booking App:\n\n" +
        "1. Tap the Share button (↗️) at the bottom\n" +
        "2. Scroll down and tap 'Add to Home Screen'\n" +
        "3. Tap 'Add' to confirm\n\n" +
        "You'll then have quick access to the app!"
      );
    } else {
      // Generic instructions for other browsers
      alert(
        "📱 Install TM Booking App:\n\n" +
        "• Chrome: Look for the install icon in the address bar\n" +
        "• Safari: Use 'Add to Home Screen' from the share menu\n" +
        "• Firefox: Look for 'Install' option in the menu\n\n" +
        "Get quick access and offline features!"
      );
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || (isInstalled && !FORCE)) return null;

  const getPromptText = () => {
    if (isIOS) return "📱 Add to Home Screen for quick access!";
    if (isAndroid) return "📱 Install TM Booking app for better experience!";
    return "📱 Install our app for quick access and offline use!";
  };

  const getButtonText = () => {
    if (deferredPrompt) return "Install";
    if (isIOS) return "How to Add";
    return "Install Guide";
  };

  return (
    <div 
      style={{ 
        position: "fixed", 
        bottom: 16, 
        left: 16, 
        right: 16, 
        zIndex: 10000,
        display: "flex", 
        justifyContent: "center",
        animation: "slideUp 0.4s ease-out"
      }}
    >
      <div 
        style={{ 
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", 
          color: "white", 
          padding: "14px 18px", 
          borderRadius: 16, 
          boxShadow: "0 8px 32px rgba(29, 78, 216, 0.4)", 
          display: "flex", 
          alignItems: "center", 
          gap: 14,
          maxWidth: "95%",
          fontSize: "15px",
          fontWeight: "500",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <div style={{ flex: 1 }}>
          {getPromptText()}
        </div>
        <button 
          style={{ 
            background: "white", 
            color: "#1d4ed8", 
            border: "none", 
            borderRadius: 10, 
            padding: "10px 18px", 
            fontWeight: "600", 
            cursor: "pointer",
            fontSize: "14px",
            minWidth: "80px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }} 
          onClick={handleInstall}
        >
          {getButtonText()}
        </button>
        <button 
          style={{ 
            background: "transparent", 
            color: "white", 
            border: "1px solid rgba(255,255,255,0.4)", 
            borderRadius: 8,
            padding: "8px 10px",
            fontWeight: "500", 
            cursor: "pointer",
            fontSize: "14px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }} 
          onClick={handleDismiss}
        >
          ✕
        </button>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { 
            transform: translateY(100%) scale(0.95); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedPwaPrompt;