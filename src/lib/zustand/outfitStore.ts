import { create } from 'zustand';
import { outfitService } from '@/src/app/(dashboard)/create-outfit/services/outfit.service';

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
  removeOutfit: (id: string) => void;
  loadOutfits: () => Promise<void>;
}

const BASE_LOCAL_STORAGE_KEY = 'wardd_registered_outfits';

function getCurrentUserKey(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
    const idValue = payload.sub ?? payload.id ?? payload.user_id ?? payload.uid ?? payload.userId ?? null;
    if (typeof idValue === 'string' && idValue.trim() !== '') return idValue.trim();
    if (typeof idValue === 'number') return String(idValue);
    return token.slice(0, 24);
  } catch {
    return null;
  }
}

function getStorageKey(userKey?: string | null) {
  return userKey != null ? `${BASE_LOCAL_STORAGE_KEY}_${userKey}` : BASE_LOCAL_STORAGE_KEY;
}

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
        const key = getStorageKey(getCurrentUserKey());
        localStorage.setItem(key, JSON.stringify(updatedOutfits));
      }
      return { createdOutfits: updatedOutfits };
    }),
  removeOutfit: (id: string) =>
    set((state) => {
      const updatedOutfits = state.createdOutfits.filter((o) => String(o.id) !== String(id));
      if (typeof window !== 'undefined') {
        const key = getStorageKey(getCurrentUserKey());
        localStorage.setItem(key, JSON.stringify(updatedOutfits));
      }
      return { createdOutfits: updatedOutfits };
    }),
  loadOutfits: async () => {
    if (typeof window === 'undefined') return;
    try {
      const merged = await outfitService.getOutfits();
      const normalized: Outfit[] = merged.map((o) => ({
        id: String(o.id),
        name: o.name,
        occasion: o.occasion,
        garmentIds: (o.garments || []).map((g: any) => String(g.id)),
      }));
      set({ createdOutfits: normalized });
    } catch (e) {
      // fallback to stored only
      const key = getStorageKey(getCurrentUserKey());
      const stored = localStorage.getItem(key);
      if (!stored) return;
      try {
        const outfits = JSON.parse(stored) as Outfit[];
        set({ createdOutfits: outfits });
      } catch {
        localStorage.removeItem(key);
        set({ createdOutfits: [] });
      }
    }
  },
}));
