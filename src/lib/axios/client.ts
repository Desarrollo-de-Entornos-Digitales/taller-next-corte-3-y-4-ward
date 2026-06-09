import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

const isServer = typeof window === 'undefined';
const API_BASE = process.env.NEXT_PUBLIC_API || 'http://localhost:3001';

const axiosClient: AxiosInstance = axios.create({
    baseURL: isServer ? API_BASE : '/api',
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
        }
    }

    return config;
});

export default axiosClient;
