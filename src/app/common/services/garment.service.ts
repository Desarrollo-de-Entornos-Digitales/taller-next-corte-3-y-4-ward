import axiosClient from '../../../lib/axios/client';

export interface Garment {
    id: string;
    type: string;
    name?: string;
    description?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface GarmentsResponse {
    garments: Garment[];
    total?: number;
    page?: number;
    limit?: number;
}

class GarmentService {
    async getGarments(): Promise<Garment[]> {
        try {
            const result = await axiosClient.get<GarmentsResponse>('/garments');
            return result.data.garments || [];
        } catch (error: any) {
            // Handle authentication errors gracefully
            if (error.response?.status === 401) {
                console.warn('Authentication required to fetch garments');
                return [];
            }
            console.error('Error fetching garments:', error);
            throw error;
        }
    }

    async getGarmentById(id: string): Promise<Garment | null> {
        try {
            const result = await axiosClient.get<Garment>(`/garments/${id}`);
            return result.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                console.warn('Authentication required to fetch garment');
                return null;
            }
            console.error('Error fetching garment:', error);
            return null;
        }
    }
}

export const garmentService = new GarmentService();
