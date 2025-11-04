/**
 * PWA Detection and Installation Utilities
 */

export const isPWAInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://') ||
    window.location.search.includes('utm_source=homescreen')
  );
};

export const canInstallPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if already installed
  if (isPWAInstalled()) return false;
  
  // Check if browser supports PWA installation
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
};

export const isAndroidDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /android/.test(window.navigator.userAgent.toLowerCase());
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return isIOSDevice() || isAndroidDevice() || 
         /mobile|tablet|kindle|silk|opera mini/i.test(navigator.userAgent);
};

export const shouldShowInstallPrompt = (): boolean => {
  if (!canInstallPWA() || !isMobileDevice()) return false;
  
  const dismissed = localStorage.getItem('pwa-prompt-dismissed');
  if (!dismissed) return true;
  
  const dismissedTime = parseInt(dismissed);
  const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
  
  return daysSince > 7; // Show again after 7 days
};

export const getInstallInstructions = (): string => {
  if (isIOSDevice()) {
    return "Tap the Share button (↗️) at the bottom, then select 'Add to Home Screen'";
  }
  
  if (isAndroidDevice()) {
    return "Look for the 'Install' option in your browser menu, or tap 'Add to Home Screen'";
  }
  
  return "Look for the install icon in your browser's address bar or menu";
};