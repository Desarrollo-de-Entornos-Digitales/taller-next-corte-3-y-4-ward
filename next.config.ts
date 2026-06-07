import type { NextConfig } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API || 'http://localhost:3001';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${API_BASE}/:path*`,
            },
        ];
    },
};

export default nextConfig;
