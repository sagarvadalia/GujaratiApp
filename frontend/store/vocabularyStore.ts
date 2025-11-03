import { create } from 'zustand';
import { Vocabulary } from '../src/types/vocabulary';

export type DisplayMode = 'gujarati' | 'english' | 'both';

interface VocabularyState {
  vocabulary: Vocabulary[];
  favorites: string[];
  recentlyViewed: string[];
  displayMode: DisplayMode;
  setVocabulary: (vocabulary: Vocabulary[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  addRecentlyViewed: (id: string) => void;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const useVocabularyStore = create<VocabularyState>((set) => ({
  vocabulary: [],
  favorites: [],
  recentlyViewed: [],
  displayMode: 'both',
  setVocabulary: (vocabulary) => set({ vocabulary }),
  addFavorite: (id) =>
    set((state) => ({
      favorites: [...state.favorites.filter((f) => f !== id), id],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((f) => f !== id),
    })),
  addRecentlyViewed: (id) =>
    set((state) => ({
      recentlyViewed: [
        id,
        ...state.recentlyViewed.filter((r) => r !== id).slice(0, 9),
      ],
    })),
  setDisplayMode: (mode) => set({ displayMode: mode }),
}));

