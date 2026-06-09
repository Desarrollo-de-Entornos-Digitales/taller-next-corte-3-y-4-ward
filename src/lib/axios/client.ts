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
            if (config.headers) {
                (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
            } else {
                config.headers = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;
            }
        }
    }

    return config;
});

export default axiosClient;
