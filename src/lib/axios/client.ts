import axios, { AxiosInstance } from 'axios';

const isServer = typeof window === 'undefined';
const API_BASE = process.env.NEXT_PUBLIC_API || 'http://localhost:3001';

const axiosClient: AxiosInstance = axios.create({
    baseURL: isServer ? API_BASE : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosClient;
