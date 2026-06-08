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
