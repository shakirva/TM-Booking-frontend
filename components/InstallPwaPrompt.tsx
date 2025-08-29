
import React, { useEffect, useState } from "react";

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <div style={{ position: "fixed", bottom: 20, left: 0, right: 0, zIndex: 9999, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#204DC5", color: "white", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 16 }}>
        <span>Add this app to your home screen for a better experience!</span>
        <button style={{ background: "white", color: "#204DC5", border: "none", borderRadius: 4, padding: "4px 12px", fontWeight: "bold", cursor: "pointer" }} onClick={handleInstallClick}>
          Install
        </button>
        <button style={{ background: "transparent", color: "white", border: "none", fontWeight: "bold", cursor: "pointer" }} onClick={() => setShowPrompt(false)}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default InstallPwaPrompt;
