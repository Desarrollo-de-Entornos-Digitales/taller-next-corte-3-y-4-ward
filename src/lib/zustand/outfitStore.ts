import { create } from 'zustand';

export interface Outfit {
  id: string;
  name: string;
  occasion?: string;
  userId?: string;
  garmentIds: string[];
}

interface OutfitStore {
  selectedGarmentIds: string[];
  outfitName: string;
  occasion: string;
  createdOutfits: Outfit[];
  toggleGarment: (id: string) => void;
  clearOutfit: () => void;
  setOutfitName: (name: string) => void;
  setOccasion: (occasion: string) => void;
  addOutfit: (outfit: Outfit) => void;
  loadOutfits: () => void;
}

const LOCAL_STORAGE_KEY = 'created_outfits';

export const useOutfitStore = create<OutfitStore>()((set) => ({
  selectedGarmentIds: [],
  outfitName: '',
  occasion: '',
  createdOutfits: [],
  toggleGarment: (id: string) =>
    set((state) => ({
      selectedGarmentIds: state.selectedGarmentIds.includes(id)
        ? state.selectedGarmentIds.filter((item) => item !== id)
        : [...state.selectedGarmentIds, id],
    })),
  clearOutfit: () => set({ selectedGarmentIds: [], outfitName: '', occasion: '' }),
  setOutfitName: (name: string) => set({ outfitName: name }),
  setOccasion: (occasion: string) => set({ occasion }),
  addOutfit: (outfit: Outfit) =>
    set((state) => {
      const updatedOutfits = [...state.createdOutfits, outfit];
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOutfits));
      }
      return { createdOutfits: updatedOutfits };
    }),
  loadOutfits: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return;
    try {
      const outfits = JSON.parse(stored) as Outfit[];
      set({ createdOutfits: outfits });
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set({ createdOutfits: [] });
    }
  },
}));
