import { useState, useEffect } from 'react';
import { garmentService, Garment } from '../services/garment.service';
import { getMockGarments } from '../../../util/garments.util';

export const useGarments = () => {
    const [garments, setGarments] = useState<Garment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isUsingMockData, setIsUsingMockData] = useState(false);

    const fetchGarments = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsUsingMockData(false);
            const data = await garmentService.getGarments();
            setGarments(data);
            setIsAuthenticated(true);
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Authentication required');
                setIsAuthenticated(false);
            } else {
                // Usar datos mock como fallback
                console.warn('Using mock garments data as fallback');
                const mockData = getMockGarments();
                setGarments(mockData);
                setIsUsingMockData(true);
                setError(null);
                setIsAuthenticated(true);
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
        isUsingMockData,
        refetch: fetchGarments,
    };
};
