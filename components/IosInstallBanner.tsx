
import React, { useState, useEffect } from "react";

const IosInstallBanner: React.FC = () => {
  const [showIosBanner, setShowIosBanner] = useState(false);

  useEffect(() => {
    const isIos = () =>
      /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    
    const isInStandaloneMode = () =>
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone;
    
    const wasRecentlyDismissed = () => {
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) return false;
      const dismissedTime = parseInt(dismissed);
      const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      return daysSince < 7; // Show again after 7 days
    };

    if (isIos() && !isInStandaloneMode() && !wasRecentlyDismissed()) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setShowIosBanner(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('ios-install-dismissed', Date.now().toString());
    setShowIosBanner(false);
  };

  if (!showIosBanner) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          color: "white",
          padding: "12px 16px",
          textAlign: "center",
          fontSize: "14px",
          boxShadow: "0 -4px 20px rgba(29, 78, 216, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          animation: "slideUp 0.3s ease-out"
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
            📱 Install TM Booking
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>
            Tap <span style={{ fontWeight: "bold", backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 4 }}>↗️</span> then{' '}
            <span style={{ fontWeight: "bold" }}>&quot;Add to Home Screen&quot;</span>
          </div>
        </div>
        <button
          style={{
            background: "white",
            color: "#1d4ed8",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
            minWidth: "60px"
          }}
          onClick={() => {
            // For iOS, we can only guide users to manually add to home screen
            alert("To install:\n1. Tap the Share button (↗️) at the bottom\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' to confirm");
          }}
        >
          Guide
        </button>
        <button
          style={{
            marginLeft: 8,
            background: "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 6,
            padding: "6px 10px",
            fontWeight: "500",
            cursor: "pointer",
            fontSize: "14px"
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

export default IosInstallBanner;
