import axiosClient from '../../../lib/axios/client';
import { getMockGarments } from '../../../util/garments.util';

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
        try {
            const result = await axiosClient.get<GarmentsResponse | Garment[]>('/garments');
            if (Array.isArray(result.data)) {
                return result.data;
            }
            return result.data.garments || [];
        } catch (error: any) {
            if (error.response?.status === 401) {
                console.warn('Authentication required to fetch garments');
                return [];
            }
            console.warn('Network or API error fetching garments, using mock data fallback:', error?.message || error);
            return getMockGarments();
        }
    }
}

export const garmentService = new GarmentService();
