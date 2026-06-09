import { create } from 'zustand';
import { outfitService } from '@/src/app/(dashboard)/create-outfit/services/outfit.service';
import { Garment } from '@/src/app/common/services/garment.service';

export interface Outfit {
    id: string;
    name: string;
    occasion?: string;
    userId?: string;
    garmentIds: string[];
    garments?: Garment[];
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

function parseUserKeyFromPayload(payload: Record<string, unknown>): string | null {
    const idValue = payload.sub ?? payload.id ?? payload.user_id ?? payload.uid ?? payload.userId ?? null;
    if (typeof idValue === 'string' && idValue.trim() !== '') return idValue.trim();
    if (typeof idValue === 'number') return String(idValue);
    return null;
}

function getCurrentUserFromLocalStorage(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    try {
        const currentUserString = localStorage.getItem('current_user');
        if (!currentUserString) return null;
        return JSON.parse(currentUserString) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function getCurrentUserKey(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
            const key = parseUserKeyFromPayload(payload);
            if (key) return key;
        } catch {
            // invalid token
        }
    }

    const currentUser = getCurrentUserFromLocalStorage();
    if (currentUser) {
        const key = parseUserKeyFromPayload(currentUser);
        if (key) return key;
    }

    return token ? token.slice(0, 24) : null;
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
            const normalized: Outfit[] = merged.map((o: any) => {
                // Handle both OutfitResponse format and Outfit format
                const garmentIds = o.garmentIds
                    ? o.garmentIds.map((id: any) => String(id))
                    : (o.garments || []).map((g: any) => String(g.id ?? g));

                return {
                    id: String(o.id),
                    name: o.name || '',
                    occasion: o.occasion || '',
                    garmentIds,
                    garments: Array.isArray(o.garments) ? o.garments : undefined,
                };
            });
            set({ createdOutfits: normalized });
        } catch (e) {
            console.warn('Error loading outfits from service, falling back to localStorage:', e);
            // fallback to stored only
            const key = getStorageKey(getCurrentUserKey());
            const stored = localStorage.getItem(key);
            if (!stored) {
                console.warn('No stored outfits found');
                set({ createdOutfits: [] });
                return;
            }
            try {
                const outfits = JSON.parse(stored) as Outfit[];
                set({ createdOutfits: outfits });
            } catch (parseErr) {
                console.error('Failed to parse stored outfits:', parseErr);
                localStorage.removeItem(key);
                set({ createdOutfits: [] });
            }
        }
    },
}));
