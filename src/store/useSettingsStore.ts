import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  fontSize: number;
  translationEnabled: boolean;
  urduEnabled: boolean;
  reciter: string;
  autoPlayNext: boolean;
  readingMode: 'card' | 'page';
  setFontSize: (size: number) => void;
  toggleTranslation: () => void;
  toggleUrdu: () => void;
  setReciter: (reciter: string) => void;
  toggleAutoPlay: () => void;
  setReadingMode: (mode: 'card' | 'page') => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 24,
      translationEnabled: true,
      urduEnabled: true,
      reciter: 'ar.alafasy',
      autoPlayNext: true,
      readingMode: 'card',
      setFontSize: (fontSize) => set({ fontSize }),
      toggleTranslation: () => set((state) => ({ translationEnabled: !state.translationEnabled })),
      toggleUrdu: () => set((state) => ({ urduEnabled: !state.urduEnabled })),
      setReciter: (reciter) => set({ reciter }),
      toggleAutoPlay: () => set((state) => ({ autoPlayNext: !state.autoPlayNext })),
      setReadingMode: (readingMode) => set({ readingMode }),
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'quran-settings',
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
