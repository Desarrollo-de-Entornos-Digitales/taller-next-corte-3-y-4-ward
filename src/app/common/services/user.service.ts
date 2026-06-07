import axiosClient from '@/src/lib/axios/client';

export interface CurrentUser {
    id?: string;
    username?: string;
    email?: string;
    avatar?: string | null;
}

class UserService {
    async getCurrentUser(): Promise<CurrentUser> {
        // Try with Authorization header using stored token first
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                const res = await axiosClient.get<CurrentUser>('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return res.data;
            }
        } catch (err) {
            console.warn('Failed to fetch current user with token header, falling back to cookie method');
        }

        // Fallback: try with credentials (cookie)
        try {
            const response = await axiosClient.get<CurrentUser>('/auth/me', { withCredentials: true });
            return response.data;
        } catch (err: any) {
            console.warn('Could not fetch current user from API:', err?.message || err);
            throw err;
        }
    }
}

export const userService = new UserService();
