import { create } from 'zustand';
import { Garment } from '@/src/app/common/services/garment.service';

interface GarmentStore {
  garments: Garment[];
  setGarments: (garments: Garment[]) => void;
  addGarment: (garment: Garment) => void;
  removeGarment: (id: string) => void;
}

export const useGarmentStore = create<GarmentStore>()((set) => ({
  garments: [],
  setGarments: (garments: Garment[]) => set({ garments }),
  addGarment: (garment: Garment) => set((state) => ({ garments: [...state.garments, garment] })),
  removeGarment: (id: string) => set((state) => ({ garments: state.garments.filter((garment) => garment.id !== id) })),
}));
