import { useEffect, useState } from 'react';

import { useGarmentStore } from '@/src/lib/zustand/garmentStore';
import { getGarmentImageUrl } from '@/src/util/garments.util';

import { garmentService } from '../services/garment.service';

function parseTokenUserId(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
        const idValue = payload.sub ?? payload.id ?? payload.user_id ?? payload.uid ?? payload.userId ?? null;

        if (typeof idValue === 'string' && idValue.trim() !== '') {
            const parsed = Number(idValue);
            return Number.isNaN(parsed) ? null : parsed;
        }

        return typeof idValue === 'number' ? idValue : null;
    } catch {
        return null;
    }
}

function getUserIdFromStorage(): number | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token) {
        const id = parseTokenUserId(token);
        if (id != null) return id;
    }

    const currentUserString = localStorage.getItem('current_user');
    if (!currentUserString) return null;

    try {
        const currentUser = JSON.parse(currentUserString) as Record<string, unknown>;
        const idValue = currentUser.id ?? currentUser.user_id ?? currentUser.uid ?? currentUser.userId ?? null;
        if (typeof idValue === 'string' && idValue.trim() !== '') {
            const parsed = Number(idValue);
            return Number.isNaN(parsed) ? null : parsed;
        }
        return typeof idValue === 'number' ? idValue : null;
    } catch {
        return null;
    }
}

export const useGarments = () => {
    const { garments, setGarments } = useGarmentStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const hasActualImage = (garment: Parameters<typeof getGarmentImageUrl>[0]) => {
        const imageUrl = getGarmentImageUrl(garment);
        return typeof imageUrl === 'string' && imageUrl.trim() !== '';
    };

    const fetchGarments = async () => {
        try {
            setLoading(true);
            setError(null);
            setGarments([]);

            const id = getUserIdFromStorage();
            if (!id) {
                // Not authenticated — still attempt to load garments (will return stored ones)
                setIsAuthenticated(false);
                setUserId(null);
            } else {
                setIsAuthenticated(true);
                setUserId(id);
            }

            const data = await garmentService.getGarments();
            setGarments(data.filter(hasActualImage));
        } catch (err: unknown) {
            const axiosError = err as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
                setIsAuthenticated(false);
                setError('Authentication required');
            } else {
                setError('Error loading garments');
            }
            console.error('Error fetching garments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadGarments = async () => {
            await fetchGarments();
        };

        void loadGarments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        garments,
        loading,
        error,
        isAuthenticated,
        userId,
        refetch: fetchGarments,
    };
};
