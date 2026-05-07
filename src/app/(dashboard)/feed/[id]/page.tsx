'use client';

import { useParams } from 'next/navigation';

export default function FeedItemPage() {
    const params = useParams();
    return (
        <div className="min-h-screen flex items-center justify-center p-8 text-white">
            <h1 className="text-3xl font-semibold">Feed item: {params?.id}</h1>
            <p className="mt-4 text-white/70">This route is now initialized.</p>
        </div>
    );
}
