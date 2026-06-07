import { useState, useEffect } from 'react';

import { garmentService, Garment } from '../services/garment.service';

function getUserIdFromToken(): number | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub ?? null;
    } catch {
        return null;
    }
}

export const useGarments = () => {
    const [garments, setGarments] = useState<Garment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const fetchGarments = async () => {
        try {
            setLoading(true);
            setError(null);

            const id = getUserIdFromToken();
            if (!id) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            setUserId(id);
            setIsAuthenticated(true);

            const data = await garmentService.getGarmentsByUser(id);
            setGarments(data);
        } catch (err: any) {
            if (err.response?.status === 401) {
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
        fetchGarments();
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
