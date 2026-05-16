import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Surah, Ayah } from '@/types';

interface ReadingState {
  lastReadSurah: Surah | null;
  lastReadAyah: Ayah | null;
  recentlyRead: Surah[];
  readingProgress: Record<number, number>; // Surah number -> percentage
  setLastRead: (surah: Surah, ayah: Ayah) => void;
  addRecentlyRead: (surah: Surah) => void;
  updateProgress: (surahNumber: number, progress: number) => void;
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      lastReadSurah: null,
      lastReadAyah: null,
      recentlyRead: [],
      readingProgress: {},
      setLastRead: (surah, ayah) => set({ lastReadSurah: surah, lastReadAyah: ayah }),
      addRecentlyRead: (surah) => set((state) => {
        const filtered = state.recentlyRead.filter((s) => s.number !== surah.number);
        return { recentlyRead: [surah, ...filtered].slice(0, 10) };
      }),
      updateProgress: (surahNumber, progress) => set((state) => ({
        readingProgress: { ...state.readingProgress, [surahNumber]: progress }
      })),
    }),
    {
      name: 'quran-reading',
    }
  )
);
