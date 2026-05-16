import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ayah } from '@/types';

interface FavoritesState {
  favorites: Ayah[];
  bookmarks: Ayah[];
  notes: Record<string, string>;
  addFavorite: (ayah: Ayah) => void;
  removeFavorite: (ayahNumber: number) => void;
  isFavorite: (ayahNumber: number) => boolean;
  addBookmark: (ayah: Ayah) => void;
  removeBookmark: (ayahNumber: number) => void;
  isBookmarked: (ayahNumber: number) => boolean;
  addNote: (ayahNumber: number, note: string) => void;
  getNote: (ayahNumber: number) => string | undefined;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      bookmarks: [],
      notes: {},
      addFavorite: (ayah) => set((state) => ({ 
        favorites: [...state.favorites, ayah] 
      })),
      removeFavorite: (ayahNumber) => set((state) => ({ 
        favorites: state.favorites.filter((a) => a.number !== ayahNumber) 
      })),
      isFavorite: (ayahNumber) => get().favorites.some((a) => a.number === ayahNumber),
      addBookmark: (ayah) => set((state) => ({ 
        bookmarks: [...state.bookmarks, ayah] 
      })),
      removeBookmark: (ayahNumber) => set((state) => ({ 
        bookmarks: state.bookmarks.filter((a) => a.number !== ayahNumber) 
      })),
      isBookmarked: (ayahNumber) => get().bookmarks.some((a) => a.number === ayahNumber),
      addNote: (ayahNumber, note) => set((state) => ({
        notes: { ...state.notes, [ayahNumber]: note }
      })),
      getNote: (ayahNumber) => get().notes[ayahNumber],
    }),
    {
      name: 'quran-favorites',
    }
  )
);
