'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const garmentImageMap: Record<string, string> = {
    'T-Shirt': '/assets/Tshirt.svg',
    Shirt: '/assets/Shirt.svg',
    Pants: '/assets/pants.svg',
    Jacket: '/assets/Jacket.svg',
    Sweater: '/assets/Sweater.svg',
    Dress: '/assets/Dress.svg',
    Skirt: '/assets/Skirt.svg',
    Shoes: '/assets/Shoes.svg',
    Accessories: '/assets/Accessorie.svg',
};

export default function FeedItemPage() {
    const params = useParams();
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const id = params?.id as string;
    const imageUrl = garmentImageMap[id] || '/assets/Accessorie.svg';

    return (
        <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
            <section className="px-8 md:px-16 py-14">
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition"
                >
                    ← Volver
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
                    {/* Image */}
                    <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <img src={imageUrl} alt={id} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="inline-flex px-4 py-2 bg-blue-500/20 rounded-full mb-6">
                                <span className="text-blue-300 font-semibold text-sm">{id}</span>
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4">{id}</h1>

                            <p className="text-white/70 text-lg mb-8 leading-relaxed">
                                Esta es una prenda de tu armario. Puedes marcarla como favorita y usarla para crear tus
                                outfits.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60">Estado</span>
                                    <span className="text-white font-semibold">Disponible</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60">Tipo</span>
                                    <span className="text-white font-semibold">{id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsFavorited(!isFavorited)}
                                className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition ${
                                    isFavorited
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                }`}
                            >
                                {isFavorited ? '❤ Favorita' : '🤍 Agregar a favoritos'}
                            </button>
                            <Link
                                href="/feed"
                                className="flex-1 px-6 py-3 rounded-2xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition text-center"
                            >
                                Volver al feed
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
