import axiosClient from '../../../lib/axios/client';

export interface Garment {
    id: number | string;
    name: string;
    image_url?: string;
    imageUrl?: string;
    image_preview?: string;
    use_count?: number;
    brand?: { id: number; name: string } | null;
    garment_type?: { id: number; name: string } | null;
    type?: string | null; // legacy
    garment_colors?: { color: { id: number; name: string } }[];
    description?: string | null;
    color?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

const GARMENTS_STORAGE_KEY = 'wardd_registered_garments';

function getCurrentUserId(): number | null {
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
            const parsed = Number(idValue);
            return Number.isNaN(parsed) ? null : parsed;
        }

        return typeof idValue === 'number' ? idValue : null;
    } catch {
        return null;
    }
}

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

        // Fallback to a stable token-based key if no explicit user ID is available.
        return token.slice(0, 24);
    } catch {
        return null;
    }
}

function getStorageKey(userKey?: number | string | null): string {
    return userKey != null ? `${GARMENTS_STORAGE_KEY}_${userKey}` : GARMENTS_STORAGE_KEY;
}

function getStoredGarments(userKey?: number | string | null): Garment[] {
    if (typeof window === 'undefined') return [];
    try {
        const storageKey = getStorageKey(userKey ?? getCurrentUserKey());
        const stored = window.localStorage.getItem(storageKey);
        if (!stored) return [];
        return JSON.parse(stored) as Garment[];
    } catch (error) {
        console.warn('Failed to read stored garments:', error);
        return [];
    }
}

function saveStoredGarments(garments: Garment[], userKey?: number | string | null): void {
    if (typeof window === 'undefined') return;
    try {
        const storageKey = getStorageKey(userKey ?? getCurrentUserKey());
        window.localStorage.setItem(storageKey, JSON.stringify(garments));
    } catch (error) {
        console.warn('Failed to save stored garments:', error);
    }
}

function removeStoredGarment(id: string | number, userKey?: number | string | null): void {
    if (typeof window === 'undefined') return;
    const storageKey = getStorageKey(userKey ?? getCurrentUserKey());
    try {
        const storedGarments = getStoredGarments(userKey);
        const filtered = storedGarments.filter((garment) => String(garment.id) !== String(id));
        window.localStorage.setItem(storageKey, JSON.stringify(filtered));
    } catch (error) {
        console.warn('Failed to remove stored garment:', error);
    }
}

function updateStoredGarment(
    id: string | number,
    update: Partial<Garment>,
    userKey?: number | string | null,
): Garment | null {
    if (typeof window === 'undefined') return null;
    const currentUserKey = userKey ?? getCurrentUserKey();
    const storedGarments = getStoredGarments(currentUserKey);
    const updatedGarments = storedGarments.map((garment) =>
        String(garment.id) === String(id) ? { ...garment, ...update } : garment,
    );
    const updated = updatedGarments.find((garment) => String(garment.id) === String(id)) ?? null;
    saveStoredGarments(updatedGarments, currentUserKey);
    return updated;
}

function saveGarmentLocally(garment: Garment, preview?: string): void {
    const userKey = getCurrentUserKey();
    const storedGarments = getStoredGarments(userKey);
    const exists = storedGarments.some((stored) => String(stored.id) === String(garment.id));
    const garmentToStore = preview ? { ...garment, image_preview: preview } : garment;
    if (!exists) {
        saveStoredGarments([...storedGarments, garmentToStore], userKey);
    } else if (preview) {
        const updated = storedGarments.map((stored) =>
            String(stored.id) === String(garment.id) ? { ...stored, image_preview: preview } : stored,
        );
        saveStoredGarments(updated, userKey);
    }
}

function mergeStoredWithBackend(backendGarments: Garment[], userKey?: number | string | null): Garment[] {
    const storedGarments = getStoredGarments(userKey);
    if (storedGarments.length === 0) return backendGarments;

    const storedMap = new Map(storedGarments.map((garment) => [String(garment.id), garment]));
    const backendIds = new Set(backendGarments.map((garment) => String(garment.id)));

    const merged = backendGarments.map((backendGarment) => {
        const stored = storedMap.get(String(backendGarment.id));
        if (!stored) return backendGarment;

        return {
            ...backendGarment,
            image_preview: stored.image_preview ?? backendGarment.image_preview,
            image_url: backendGarment.image_url ?? stored.image_url,
            imageUrl: backendGarment.imageUrl ?? stored.imageUrl,
        };
    });

    const extras = storedGarments.filter((garment) => !backendIds.has(String(garment.id)));
    return [...merged, ...extras];
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Unable to read image file'));
            }
        };
        reader.onerror = () => reject(new Error('Error reading image file'));
        reader.readAsDataURL(file);
    });
}

async function createLocalGarment(data: Record<string, unknown> | FormData, preview?: string): Promise<Garment> {
    const getValue = (key: string) => {
        if (data instanceof FormData) {
            const value = data.get(key);
            return typeof value === 'string' ? value : undefined;
        }

        return data[key] as string | undefined;
    };

    const name = getValue('name') || 'Nueva prenda';
    const brandValue = getValue('brand') || undefined;
    const type = getValue('type') || null;
    const color = getValue('color') || null;
    const description = getValue('description') || null;
    let image_url: string | undefined;

    if (data instanceof FormData) {
        const imageFile = data.get('image');
        if (imageFile instanceof File) {
            image_url = await fileToDataUrl(imageFile);
        }
    } else {
        const imageValue = (data.image_url || data.imageUrl) as string | undefined;
        image_url = imageValue;
    }

    const userKey = getCurrentUserKey();
    const storedGarments = getStoredGarments(userKey);
    const newGarment: Garment = {
        id: Date.now().toString(),
        name,
        type,
        color,
        description,
        brand: brandValue ? { id: Date.now(), name: brandValue } : undefined,
        image_url,
        image_preview: preview,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    saveStoredGarments([...storedGarments, newGarment], userKey);
    return newGarment;
}

class GarmentService {
    async getGarmentsByUser(userId: number): Promise<Garment[]> {
        try {
            const result = await axiosClient.get<Garment[]>(`/garments/user/${userId}`);
            return mergeStoredWithBackend(result.data, userId);
        } catch (error: any) {
            console.warn('Falling back to stored garments for user because /garments/user request failed', error);
            return getStoredGarments(userId);
        }
    }

    async getGarments(): Promise<Garment[]> {
        const userId = getCurrentUserId();
        if (userId != null) {
            return this.getGarmentsByUser(userId);
        }

        try {
            const result = await axiosClient.get<Garment[]>(`/garments`);
            return mergeStoredWithBackend(result.data, getCurrentUserId());
        } catch (error: any) {
            console.warn('Falling back to stored garments because /garments request failed', error);
            return getStoredGarments(getCurrentUserId());
        }
    }

    async getGarment(id: string | number): Promise<Garment> {
        const userKey = getCurrentUserKey();
        try {
            const result = await axiosClient.get<Garment>(`/garments/${id}`);
            const stored = getStoredGarments(userKey).find((garment) => String(garment.id) === String(id));
            if (stored) {
                return {
                    ...result.data,
                    image_preview: stored.image_preview ?? result.data.image_preview,
                    image_url: result.data.image_url ?? stored.image_url,
                    imageUrl: result.data.imageUrl ?? stored.imageUrl,
                };
            }
            return result.data;
        } catch (error: any) {
            const stored = getStoredGarments(userKey);
            const match = stored.find((garment) => String(garment.id) === String(id));
            if (match) {
                return match;
            }
            throw error;
        }
    }

    async createGarment(data: Record<string, unknown> | FormData, preview?: string): Promise<Garment> {
        try {
            const response = await axiosClient.post<Garment>('/garments', data);
            saveGarmentLocally(response.data, preview);
            return preview ? { ...response.data, image_preview: preview } : response.data;
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            };

            const status = axiosError.response?.status;
            if (
                !axiosError.response ||
                status === 413 ||
                status === 502 ||
                status === 503 ||
                status === 504 ||
                (status !== undefined && status >= 500)
            ) {
                console.warn('Backend unavailable; saving garment locally instead', error);
                return await createLocalGarment(data, preview);
            }

            console.error('Error creating garment:', error);
            throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to create garment');
        }
    }

    async updateGarment(id: string | number, data: Record<string, unknown>): Promise<Garment> {
        try {
            const response = await axiosClient.patch<Garment>(`/garments/${id}`, data);
            updateStoredGarment(id, response.data, getCurrentUserKey());
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            };

            const status = axiosError.response?.status;
            if (
                !axiosError.response ||
                status === 502 ||
                status === 503 ||
                status === 504 ||
                (status !== undefined && status >= 500)
            ) {
                const existing = updateStoredGarment(id, data, getCurrentUserKey());
                if (existing) {
                    return existing;
                }
            }

            console.error('Error updating garment:', error);
            throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to update garment');
        }
    }

    async deleteGarment(id: string | number): Promise<void> {
        try {
            await axiosClient.delete(`/garments/${id}`);
            removeStoredGarment(id, getCurrentUserKey());
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    data?: { message?: string };
                };
                message?: string;
            };
            console.error('Error deleting garment:', error);
            throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to delete garment');
        }
    }
}

export const garmentService = new GarmentService();
