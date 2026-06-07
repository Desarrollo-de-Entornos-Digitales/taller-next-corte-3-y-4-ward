import axiosClient from '../../../lib/axios/client';

export interface Garment {
    id: string;
    type: string;
    name?: string;
    image_url?: string;
    brand?: { id: number; name: string };
    garment_type?: { id: number; name: string };
    garmentColors?: { color: { id: number; name: string } }[];
    use_count?: number;
    createdAt?: string;
    updatedAt?: string;
    color?: string;
    description?: string;
    image?: string;
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
}

export const garmentService = new GarmentService();
