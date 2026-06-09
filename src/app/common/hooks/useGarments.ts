import { useEffect, useState } from 'react';

import { useGarmentStore } from '@/src/lib/zustand/garmentStore';

import { garmentService } from '../services/garment.service';

function getUserIdFromToken(): number | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
        const idValue =
            payload.sub ??
            payload.id ??
            payload.user_id ??
            payload.uid ??
            payload.userId ??
            null;

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

    const fetchGarments = async () => {
        try {
            setLoading(true);
            setError(null);
            setGarments([]);

            const id = getUserIdFromToken();
            if (!id) {
                setIsAuthenticated(false);
                setGarments([]);
                setLoading(false);
                return;
            }

            setUserId(id);
            setIsAuthenticated(true);

            const data = await garmentService.getGarments();
            setGarments(data);
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
