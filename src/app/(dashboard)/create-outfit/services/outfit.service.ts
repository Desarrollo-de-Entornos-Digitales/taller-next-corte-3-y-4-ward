import axiosClient from '@/src/lib/axios/client';
import { Garment } from '@/src/app/common/services/garment.service';

const OUTFITS_STORAGE_KEY = 'wardd_registered_outfits';

function getCurrentUserKey(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
        const idValue =
            payload.sub ??
            payload.id ??
            payload.user_id ??
            payload.uid ??
            payload.userId ??
            null;

        if (typeof idValue === 'string' && idValue.trim() !== '') {
            return idValue.trim();
        }

        if (typeof idValue === 'number') {
            return String(idValue);
        }

        return token.slice(0, 24);
    } catch {
        return null;
    }
}

function getStorageKey(userKey?: string | null): string {
    return userKey != null ? `${OUTFITS_STORAGE_KEY}_${userKey}` : OUTFITS_STORAGE_KEY;
}

function getStoredOutfits(userKey?: string | null) {
    if (typeof window === 'undefined') return [] as any[];
    try {
        const key = getStorageKey(userKey ?? getCurrentUserKey());
        const raw = window.localStorage.getItem(key);
        if (!raw) return [] as any[];
        return JSON.parse(raw) as any[];
    } catch (e) {
        console.warn('Failed reading stored outfits', e);
        return [] as any[];
    }
}

function saveStoredOutfits(outfits: any[], userKey?: string | null) {
    if (typeof window === 'undefined') return;
    try {
        const key = getStorageKey(userKey ?? getCurrentUserKey());
        window.localStorage.setItem(key, JSON.stringify(outfits));
    } catch (e) {
        console.warn('Failed saving stored outfits', e);
    }
}

function saveOutfitLocally(data: OutfitData): OutfitResponse {
    const userKey = getCurrentUserKey();
    const stored = getStoredOutfits(userKey);
    const newOutfit: OutfitResponse = {
        id: Date.now().toString(),
        name: data.name,
        occasion: data.occasion,
        garments: data.garments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    saveStoredOutfits([...stored, newOutfit], userKey);
    return newOutfit;
}

function updateStoredOutfit(id: string, update: Partial<OutfitResponse>): OutfitResponse | null {
    const userKey = getCurrentUserKey();
    const stored = getStoredOutfits(userKey);
    const updated = stored.map((o) => (String(o.id) === String(id) ? { ...o, ...update, updatedAt: new Date().toISOString() } : o));
    const found = updated.find((o) => String(o.id) === String(id)) ?? null;
    saveStoredOutfits(updated, userKey);
    return found;
}

function removeStoredOutfit(id: string) {
    const userKey = getCurrentUserKey();
    const stored = getStoredOutfits(userKey);
    const updated = stored.filter((o) => String(o.id) !== String(id));
    saveStoredOutfits(updated, userKey);
}

export interface OutfitData {
    name: string;
    occasion: string;
    garments: Garment[];
}

export interface OutfitResponse {
    id: string;
    name: string;
    occasion: string;
    garments: Garment[];
    createdAt: string;
    updatedAt: string;
}

class OutfitService {
    async createOutfit(outfitData: OutfitData): Promise<OutfitResponse> {
        try {
            const response = await axiosClient.post<Partial<OutfitResponse>>('/outfits', {
                name: outfitData.name,
                occasion: outfitData.occasion,
                garmentIds: outfitData.garments.map((g) => g.id),
            });

            const resp = response.data || {};
            return {
                id: String(resp.id ?? Date.now()),
                name: resp.name ?? outfitData.name,
                occasion: resp.occasion ?? outfitData.occasion,
                garments: outfitData.garments,
                createdAt: resp.createdAt ?? new Date().toISOString(),
                updatedAt: resp.updatedAt ?? new Date().toISOString(),
            } as OutfitResponse;
        } catch (error: any) {
            const status = error?.response?.status;
            if (!error.response || status === 413 || status === 502 || status === 503 || status === 504 || (status !== undefined && status >= 500)) {
                console.warn('Outfit create failed on server, saving locally. status=', status, 'msg=', error?.response?.data || error?.message);
                return saveOutfitLocally(outfitData);
            }

            const message = error?.response?.data?.message || error?.message || 'Failed to create outfit';
            throw new Error(message);
        }
    }

    async updateOutfit(outfitId: string, outfitData: OutfitData): Promise<OutfitResponse> {
        try {
            const response = await axiosClient.put<Partial<OutfitResponse>>(`/outfits/${outfitId}`, {
                name: outfitData.name,
                occasion: outfitData.occasion,
                garmentIds: outfitData.garments.map((g) => g.id),
            });

            const resp = response.data || {};
            const normalized: OutfitResponse = {
                id: String(resp.id ?? outfitId),
                name: resp.name ?? outfitData.name,
                occasion: resp.occasion ?? outfitData.occasion,
                garments: outfitData.garments,
                createdAt: resp.createdAt ?? new Date().toISOString(),
                updatedAt: resp.updatedAt ?? new Date().toISOString(),
            };

            try {
                updateStoredOutfit(outfitId, normalized as Partial<OutfitResponse>);
            } catch {}

            return normalized;
        } catch (error: any) {
            const status = error?.response?.status;
            if (!error.response || status === 502 || status === 503 || status === 504 || (status !== undefined && status >= 500)) {
                const existing = updateStoredOutfit(outfitId, {
                    name: outfitData.name,
                    occasion: outfitData.occasion,
                    garments: outfitData.garments,
                } as Partial<OutfitResponse>);
                if (existing) return existing;
            }

            const message = error?.response?.data?.message || error?.message || 'Failed to update outfit';
            throw new Error(message);
        }
    }

    async getOutfits(): Promise<OutfitResponse[]> {
        // Return stored outfits for current user only (user requested).
        const userKey = getCurrentUserKey();
        const stored = getStoredOutfits(userKey) as OutfitResponse[];
        return stored;
    }

    async deleteOutfit(outfitId: string): Promise<void> {
        const userKey = getCurrentUserKey();
        try {
            await axiosClient.delete(`/outfits/${outfitId}`);
            // remove from stored as well in case it existed locally
            removeStoredOutfit(outfitId);
        } catch (error: any) {
            // On server errors or no response, remove local stored outfit if present
            const status = error?.response?.status;
            if (!error.response || (status !== undefined && status >= 500)) {
                removeStoredOutfit(outfitId);
                return;
            }

            const message = error?.response?.data?.message || error?.message || 'Failed to delete outfit';
            throw new Error(message);
        }
    }
}

export const outfitService = new OutfitService();
