import { create } from 'zustand';
import { Ayah, Surah } from '@/types';

interface AudioState {
  isPlaying: boolean;
  currentAyah: Ayah | null;
  currentSurah: Surah | null;
  ayahs: Ayah[];
  playbackSpeed: number;
  volume: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentAyah: (ayah: Ayah | null) => void;
  setCurrentSurah: (surah: Surah | null) => void;
  setAyahs: (ayahs: Ayah[]) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  currentAyah: null,
  currentSurah: null,
  ayahs: [],
  playbackSpeed: 1,
  volume: 1,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentAyah: (currentAyah) => set({ currentAyah }),
  setCurrentSurah: (currentSurah) => set({ currentSurah }),
  setAyahs: (ayahs) => set({ ayahs }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setVolume: (volume) => set({ volume }),
  playNext: () => {
    const { currentAyah, ayahs } = get();
    if (!currentAyah || ayahs.length === 0) return;
    const currentIndex = ayahs.findIndex((a) => a.number === currentAyah.number);
    if (currentIndex < ayahs.length - 1) {
      set({ currentAyah: ayahs[currentIndex + 1] });
    } else {
      set({ isPlaying: false });
    }
  },
  playPrevious: () => {
    const { currentAyah, ayahs } = get();
    if (!currentAyah || ayahs.length === 0) return;
    const currentIndex = ayahs.findIndex((a) => a.number === currentAyah.number);
    if (currentIndex > 0) {
      set({ currentAyah: ayahs[currentIndex - 1] });
    }
  },
}));
