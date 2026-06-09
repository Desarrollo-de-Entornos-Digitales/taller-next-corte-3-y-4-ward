import axiosClient from '@/src/lib/axios/client';
import { Garment, garmentService } from '@/src/app/common/services/garment.service';

const OUTFITS_STORAGE_KEY = 'wardd_registered_outfits';

function parseUserKeyFromPayload(payload: Record<string, unknown>): string | null {
    const idValue = payload.sub ?? payload.id ?? payload.user_id ?? payload.uid ?? payload.userId ?? null;

    if (typeof idValue === 'string' && idValue.trim() !== '') {
        return idValue.trim();
    }

    if (typeof idValue === 'number') {
        return String(idValue);
    }

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

function saveOutfitResponseLocally(outfit: OutfitResponse): OutfitResponse {
    const userKey = getCurrentUserKey();
    const stored = getStoredOutfits(userKey);
    saveStoredOutfits([...stored, outfit], userKey);
    return outfit;
}

function updateStoredOutfit(id: string, update: Partial<OutfitResponse>): OutfitResponse | null {
    const userKey = getCurrentUserKey();
    const stored = getStoredOutfits(userKey);
    const updated = stored.map((o) =>
        String(o.id) === String(id) ? { ...o, ...update, updatedAt: new Date().toISOString() } : o,
    );
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
            // Resolve garments: if any garment looks local-only, try creating it in backend first
            const resolvedGarments: Garment[] = await Promise.all(
                outfitData.garments.map(async (g) => {
                    const idStr = String(g.id ?? '');
                    const looksLocal = isNaN(Number(idStr)) || idStr.startsWith('local') || idStr.length > 12;
                    if (looksLocal) {
                        try {
                            const created = await garmentService.createGarment({
                                name: g.name,
                                type: g.type || g.garment_type?.name || null,
                                brand: g.brand?.name ?? undefined,
                                color:
                                    (g.garment_colors?.[0]?.color?.name as string) ?? (g.color as string) ?? undefined,
                                description: g.description ?? undefined,
                            } as Record<string, unknown>);
                            return created;
                        } catch (e) {
                            console.warn(
                                'Failed to create garment in backend while creating outfit, keeping local garment',
                                e,
                            );
                            return g;
                        }
                    }

                    return g;
                }),
            );

            const garmentIds = resolvedGarments.map((g) => g.id);

            try {
                const response = await axiosClient.post<Partial<OutfitResponse>>('/outfits', {
                    name: outfitData.name,
                    occasion: outfitData.occasion,
                    garmentIds,
                });

                const resp = response.data || {};
                const outfitResponse = {
                    id: String(resp.id ?? Date.now()),
                    name: resp.name ?? outfitData.name,
                    occasion: resp.occasion ?? outfitData.occasion,
                    garments: resolvedGarments,
                    createdAt: resp.createdAt ?? new Date().toISOString(),
                    updatedAt: resp.updatedAt ?? new Date().toISOString(),
                } as OutfitResponse;

                // Also save locally as backup
                saveOutfitResponseLocally(outfitResponse);
                return outfitResponse;
            } catch (backendError: any) {
                const status = backendError?.response?.status;
                // If backend is down, save locally
                if (
                    !backendError.response ||
                    status === 413 ||
                    status === 502 ||
                    status === 503 ||
                    status === 504 ||
                    (status !== undefined && status >= 500)
                ) {
                    console.warn(
                        'Outfit create failed on server, saving locally. status=',
                        status,
                        'msg=',
                        backendError?.response?.data || backendError?.message,
                    );
                    return saveOutfitLocally(outfitData);
                }
                // If it's another error, throw
                const message =
                    backendError?.response?.data?.message || backendError?.message || 'Failed to create outfit';
                throw new Error(message);
            }
        } catch (error: any) {
            console.error('Error in createOutfit:', error);
            // Last resort: save locally
            try {
                return saveOutfitLocally(outfitData);
            } catch (localSaveError) {
                console.error('Failed to save outfit locally:', localSaveError);
                throw error;
            }
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
            if (
                !error.response ||
                status === 502 ||
                status === 503 ||
                status === 504 ||
                (status !== undefined && status >= 500)
            ) {
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
        const userKey = getCurrentUserKey();
        const endpoints = [
            userKey ? `/outfits/user/${userKey}` : null,
            userKey ? `/outfits?userId=${userKey}` : null,
            `/outfits`,
        ].filter(Boolean) as string[];

        for (const endpoint of endpoints) {
            try {
                const resp = await axiosClient.get<any[]>(endpoint);
                const backend = (resp.data || []) as any[];

                // Normalize backend outfits to OutfitResponse shape
                const normalized = backend.map((o) => {
                    const garmentsRaw = o.garments ?? o.garmentIds ?? [];
                    const garments = Array.isArray(garmentsRaw)
                        ? garmentsRaw.map((g: any) => (typeof g === 'object' ? g : { id: g }))
                        : [];

                    return {
                        id: String(o.id ?? o._id ?? Date.now()),
                        name: o.name ?? '',
                        occasion: o.occasion ?? '',
                        garments,
                        createdAt: o.createdAt ?? o.created_at ?? new Date().toISOString(),
                        updatedAt: o.updatedAt ?? o.updated_at ?? new Date().toISOString(),
                    } as OutfitResponse;
                });

                const stored = getStoredOutfits(userKey) as OutfitResponse[];
                if (!stored || stored.length === 0) return normalized;

                const backendIds = new Set(normalized.map((o) => String(o.id)));
                const extras = stored.filter((s) => !backendIds.has(String(s.id)));
                return [...normalized, ...extras];
            } catch (error) {
                console.warn(`outfitService: request failed for ${endpoint}`, error);
            }
        }

        console.warn('Falling back to stored outfits because all /outfits requests failed');
        return getStoredOutfits(userKey) as OutfitResponse[];
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
