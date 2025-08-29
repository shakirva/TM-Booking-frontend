
import React, { useState, useEffect } from "react";

const IosInstallBanner: React.FC = () => {
  const [showIosBanner, setShowIosBanner] = useState(false);

  useEffect(() => {
    const isIos = () =>
      /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = () =>
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone;
    if (isIos() && !isInStandaloneMode()) {
      setShowIosBanner(true);
    }
  }, []);

  if (!showIosBanner) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
      <div
        style={{
          background: "#204DC5",
          color: "white",
          padding: "16px",
          textAlign: "center",
          fontSize: "16px",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          Install this app on your iPhone:
        </span>
        <span>
          Tap <span style={{ fontWeight: "bold" }}>&#x2191;</span> then{' '}
          <span style={{ fontWeight: "bold" }}>'Add to Home Screen'</span>
        </span>
        <button
          style={{
            marginLeft: 16,
            background: "white",
            color: "#204DC5",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => {
            if (window.navigator.share) {
              window.navigator.share({ url: window.location.href });
            }
          }}
        >
          Install
        </button>
        <button
          style={{
            marginLeft: 8,
            background: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setShowIosBanner(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default IosInstallBanner;
