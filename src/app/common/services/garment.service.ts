import axiosClient from '../../../lib/axios/client';

export interface Garment {
    id: string;
    type: string;
    name?: string;
    description?: string;
    image?: string;
    brand?: string;
    color?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface GarmentsResponse {
    garments?: Garment[];
}

class GarmentService {
    async getGarments(): Promise<Garment[]> {
        const result = await axiosClient.get<GarmentsResponse | Garment[]>('/garments');
        if (Array.isArray(result.data)) {
            return result.data;
        }
        return result.data.garments || [];
    }
}

export const garmentService = new GarmentService();
