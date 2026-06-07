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

    async createGarment(formData: FormData): Promise<Garment> {
        try {
            const response = await axiosClient.post<Garment>('/garments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error creating garment:', error);
            throw new Error(error?.response?.data?.message || error?.message || 'Failed to create garment');
        }
    }
}

export const garmentService = new GarmentService();
