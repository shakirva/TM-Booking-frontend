
import React, { useEffect, useState } from "react";

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone
      || window.location.search.includes('utm_source=homescreen');

    if (isStandalone) {
      return; // Don't show any prompts if already installed
    }

    // Check if user has dismissed the prompt before
    const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = hasBeenDismissed ? parseInt(hasBeenDismissed) : 0;
    const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show manual prompt after 3 seconds if no native prompt and hasn't been dismissed recently
    const manualPromptTimer = setTimeout(() => {
      if (!deferredPrompt && !hasBeenDismissed || daysSinceDismissal > 7) {
        setShowManualPrompt(true);
      }
    }, 3000);

    const onBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      clearTimeout(manualPromptTimer);
      setDeferredPrompt(event);
      
      // Show prompt immediately or after a short delay if not dismissed recently
      if (!hasBeenDismissed || daysSinceDismissal > 1) {
        setTimeout(() => setShowPrompt(true), 1000);
      }
    };

    const onAppInstalled = () => {
      setShowPrompt(false);
      setShowManualPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    
    return () => {
      clearTimeout(manualPromptTimer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
        setDeferredPrompt(null);
      } else {
        handleDismiss();
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
    setShowManualPrompt(false);
  };

  if (!showPrompt && !showManualPrompt) return null;

  const isNativePrompt = showPrompt && deferredPrompt;
  const isManualPrompt = showManualPrompt && !deferredPrompt;

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 9999, display: "flex", justifyContent: "center" }}>
      <div style={{ 
        background: "#1d4ed8", 
        color: "white", 
        padding: "12px 16px", 
        borderRadius: 12, 
        boxShadow: "0 4px 20px rgba(29, 78, 216, 0.3)", 
        display: "flex", 
        alignItems: "center", 
        gap: 12,
        maxWidth: "90%",
        fontSize: "14px",
        animation: "slideUp 0.3s ease-out"
      }}>
        <div style={{ flex: 1 }}>
          {isNativePrompt && (
            <span>📱 Install TM Booking app for quick access and offline use!</span>
          )}
          {isManualPrompt && (
            <span>📱 Add to Home Screen for the best mobile experience!</span>
          )}
        </div>
        <button 
          style={{ 
            background: "white", 
            color: "#1d4ed8", 
            border: "none", 
            borderRadius: 6, 
            padding: "8px 16px", 
            fontWeight: "600", 
            cursor: "pointer",
            fontSize: "14px",
            minWidth: "60px"
          }} 
          onClick={handleInstallClick}
        >
          {isNativePrompt ? "Install" : "How?"}
        </button>
        <button 
          style={{ 
            background: "transparent", 
            color: "white", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 6,
            padding: "8px 12px",
            fontWeight: "500", 
            cursor: "pointer",
            fontSize: "12px"
          }} 
          onClick={handleDismiss}
        >
          ✕
        </button>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InstallPwaPrompt;
