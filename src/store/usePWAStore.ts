import { create } from 'zustand';

interface PWAState {
  isOnline: boolean;
  installPrompt: any;
  isInstalled: boolean;
  showInstallBanner: boolean;
  setOnline: (isOnline: boolean) => void;
  setInstallPrompt: (prompt: any) => void;
  setIsInstalled: (isInstalled: boolean) => void;
  setShowInstallBanner: (show: boolean) => void;
}

export const usePWAStore = create<PWAState>((set) => ({
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  installPrompt: null,
  isInstalled: false,
  showInstallBanner: false,
  setOnline: (isOnline) => set({ isOnline }),
  setInstallPrompt: (installPrompt) => set({ installPrompt, showInstallBanner: !!installPrompt }),
  setIsInstalled: (isInstalled) => set({ isInstalled }),
  setShowInstallBanner: (showInstallBanner) => set({ showInstallBanner }),
}));
