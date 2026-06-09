import { useState, useCallback } from 'react';
import { Garment } from '@/src/app/common/services/garment.service';

export interface OutfitFormState {
    name: string;
    occasion: string;
    selectedGarments: Garment[];
}

export interface OutfitStoreActions {
    setOutfitName: (name: string) => void;
    setOccasion: (occasion: string) => void;
    addGarment: (garment: Garment) => void;
    removeGarment: (garmentId: string) => void;
    reset: () => void;
    getGarmentsByType: (type: string) => Garment[];
    isGarmentSelected: (garmentId: string) => boolean;
}

const initialState: OutfitFormState = {
    name: '',
    occasion: '',
    selectedGarments: [],
};

/**
 * Custom hook para manejar el estado del formulario de crear outfit.
 * Preparado para migrar a Zustand en el futuro.
 * @returns Estado y acciones del formulario de outfit
 */
export const useOutfitStore = () => {
    const [state, setState] = useState<OutfitFormState>(initialState);

    const setOutfitName = useCallback((name: string) => {
        setState((prev) => ({ ...prev, name }));
    }, []);

    const setOccasion = useCallback((occasion: string) => {
        setState((prev) => ({ ...prev, occasion }));
    }, []);

    const addGarment = useCallback((garment: Garment) => {
        setState((prev) => {
            // Evitar duplicados del mismo tipo
            const existingGarment = prev.selectedGarments.find((g) => g.id === garment.id);
            if (existingGarment) return prev;

            return {
                ...prev,
                selectedGarments: [...prev.selectedGarments, garment],
            };
        });
    }, []);

    const removeGarment = useCallback((garmentId: string) => {
        setState((prev) => ({
            ...prev,
            selectedGarments: prev.selectedGarments.filter((g) => g.id !== garmentId),
        }));
    }, []);

    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    const getGarmentsByType = useCallback(
        (type: string) => {
            return state.selectedGarments.filter((g) => g.type === type);
        },
        [state.selectedGarments]
    );

    const isGarmentSelected = useCallback(
        (garmentId: string) => {
            return state.selectedGarments.some((g) => g.id === garmentId);
        },
        [state.selectedGarments]
    );

    return {
        state,
        actions: {
            setOutfitName,
            setOccasion,
            addGarment,
            removeGarment,
            reset,
            getGarmentsByType,
            isGarmentSelected,
        },
    };
};
