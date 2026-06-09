import axiosClient from '../../../lib/axios/client';

export interface Garment {
    id: number | string;
    name: string;
    image_url?: string;
    imageUrl?: string;
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

function getStoredGarments(): Garment[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = window.localStorage.getItem(GARMENTS_STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as Garment[];
    } catch (error) {
        console.warn('Failed to read stored garments:', error);
        return [];
    }
}

function saveStoredGarments(garments: Garment[]): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(GARMENTS_STORAGE_KEY, JSON.stringify(garments));
    } catch (error) {
        console.warn('Failed to save stored garments:', error);
    }
}

function saveGarmentLocally(garment: Garment): void {
    const storedGarments = getStoredGarments();
    const exists = storedGarments.some((stored) => String(stored.id) === String(garment.id));
    if (!exists) {
        saveStoredGarments([...storedGarments, garment]);
    }
}

function mergeStoredWithBackend(backendGarments: Garment[]): Garment[] {
    const storedGarments = getStoredGarments();
    if (storedGarments.length === 0) return backendGarments;

    const backendIds = new Set(backendGarments.map((garment) => String(garment.id)));
    const extras = storedGarments.filter((garment) => !backendIds.has(String(garment.id)));
    return [...backendGarments, ...extras];
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

async function createLocalGarment(data: Record<string, unknown> | FormData): Promise<Garment> {
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

    const storedGarments = getStoredGarments();
    const newGarment: Garment = {
        id: Date.now().toString(),
        name,
        type,
        color,
        description,
        brand: brandValue ? { id: Date.now(), name: brandValue } : undefined,
        image_url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    saveStoredGarments([...storedGarments, newGarment]);
    return newGarment;
}

class GarmentService {
    async getGarmentsByUser(userId: number): Promise<Garment[]> {
        const result = await axiosClient.get<Garment[]>(`/garments/user/${userId}`);
        return result.data;
    }

    async getGarments(): Promise<Garment[]> {
        try {
            const result = await axiosClient.get<Garment[]>(`/garments`);
            return mergeStoredWithBackend(result.data);
        } catch (error: any) {
            console.warn('Falling back to stored garments because /garments request failed', error);
            return getStoredGarments();
        }
    }

    async getGarment(id: string | number): Promise<Garment> {
        try {
            const result = await axiosClient.get<Garment>(`/garments/${id}`);
            return result.data;
        } catch (error: any) {
            const stored = getStoredGarments();
            const match = stored.find((garment) => String(garment.id) === String(id));
            if (match) {
                return match;
            }
            throw error;
        }
    }

    async createGarment(data: Record<string, unknown> | FormData): Promise<Garment> {
        try {
            const response = await axiosClient.post<Garment>('/garments', data);
            saveGarmentLocally(response.data);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            };

            if (!axiosError.response || axiosError.response.status === undefined || axiosError.response.status >= 500) {
                console.warn('Backend unavailable; saving garment locally instead', error);
                return await createLocalGarment(data);
            }

            console.error('Error creating garment:', error);
            throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to create garment');
        }
    }

    async updateGarment(id: string | number, data: Record<string, unknown>): Promise<Garment> {
        try {
            const response = await axiosClient.patch<Garment>(`/garments/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    data?: { message?: string };
                };
                message?: string;
            };

            console.error('Error updating garment:', error);
            throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to update garment');
        }
    }
}

export const garmentService = new GarmentService();
