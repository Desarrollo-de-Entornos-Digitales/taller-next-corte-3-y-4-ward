import axiosClient from '@/src/lib/axios/client';
import { Garment } from '@/src/app/common/services/garment.service';

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
            const response = await axiosClient.post<OutfitResponse>('/outfits', {
                name: outfitData.name,
                occasion: outfitData.occasion,
                garments: outfitData.garments.map((g) => g.id),
            });
            return response.data;
        } catch (error: any) {
            console.error('Error creating outfit:', error);
            throw new Error(error?.response?.data?.message || 'Failed to create outfit');
        }
    }

    async updateOutfit(outfitId: string, outfitData: OutfitData): Promise<OutfitResponse> {
        try {
            const response = await axiosClient.put<OutfitResponse>(`/outfits/${outfitId}`, {
                name: outfitData.name,
                occasion: outfitData.occasion,
                garments: outfitData.garments.map((g) => g.id),
            });
            return response.data;
        } catch (error: any) {
            console.error('Error updating outfit:', error);
            throw new Error(error?.response?.data?.message || 'Failed to update outfit');
        }
    }
}

export const outfitService = new OutfitService();
