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
  toggleGarment: (id: string) => void;
  clearOutfit: () => void;
  setOutfitName: (name: string) => void;
  setOccasion: (occasion: string) => void;
}

export const useOutfitStore = create<OutfitStore>()((set) => ({
  selectedGarmentIds: [],
  outfitName: '',
  occasion: '',
  toggleGarment: (id: string) =>
    set((state) => ({
      selectedGarmentIds: state.selectedGarmentIds.includes(id)
        ? state.selectedGarmentIds.filter((item) => item !== id)
        : [...state.selectedGarmentIds, id],
    })),
  clearOutfit: () => set({ selectedGarmentIds: [], outfitName: '', occasion: '' }),
  setOutfitName: (name: string) => set({ outfitName: name }),
  setOccasion: (occasion: string) => set({ occasion }),
}));
