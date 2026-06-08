import axiosClient from '../../../lib/axios/client';

export interface Garment {
    id: number | string;
    name: string;
    image_url?: string;
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

class GarmentService {
    async getGarmentsByUser(userId: number): Promise<Garment[]> {
        const result = await axiosClient.get<Garment[]>(`/garments/user/${userId}`);
        return result.data;
    }

    async getGarments(): Promise<Garment[]> {
        const result = await axiosClient.get<Garment[]>(`/garments`);
        return result.data;
    }

    async getGarment(id: string | number): Promise<Garment> {
        const result = await axiosClient.get<Garment>(`/garments/${id}`);
        return result.data;
    }

    async createGarment(data: Record<string, unknown>): Promise<Garment> {
        try {
            const response = await axiosClient.post<Garment>('/garments', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating garment:', error);
            throw new Error(error?.response?.data?.message || error?.message || 'Failed to create garment');
        }
    }
}

export const garmentService = new GarmentService();
