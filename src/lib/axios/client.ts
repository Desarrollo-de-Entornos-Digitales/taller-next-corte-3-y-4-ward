import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API || 'http://localhost:3001';

const axiosClient: AxiosInstance = axios.create({
    // Use direct backend URL from the client to ensure Authorization header is sent
    // (avoids Next.js rewrite/proxy that can drop headers in dev)
    baseURL: API_BASE,
});

axiosClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }

            const headers = config.headers as AxiosRequestHeaders | Record<string, string>;
            if ('set' in headers && typeof headers.set === 'function') {
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                (headers as Record<string, string>).Authorization = `Bearer ${token}`;
            }
            try {
                const masked = typeof token === 'string' ? `${token.slice(0, 6)}...${token.slice(-6)}` : 'present';
                // Debug log to help track missing Authorization issues (temporary)
                // eslint-disable-next-line no-console
                console.debug('[axios] attaching Authorization Bearer token', masked);
            } catch {}
        }
    }

    return config;
});

export default axiosClient;
