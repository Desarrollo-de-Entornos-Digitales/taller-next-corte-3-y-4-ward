'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import GarmentCard from '@/src/app/common/components/GarmentCard';

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

// Mock data for garment details
const garmentDetails: Record<string, any> = {
    Jacket: {
        name: 'Jacket Oversize',
        brand: 'Zara',
        type: 'Jacket',
        uses: 18,
        colors: ['Gris', 'Negro'],
        description: 'Elegante y cómodo jacket oversize perfecto para diferentes ocasiones.',
        outfits: [
            { id: '1', name: 'Casual Friday' },
            { id: '2', name: 'Night Out' },
        ],
    },
};

export default function FeedItemPage() {
    const params = useParams();
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const id = params?.id as string;
    const imageUrl = garmentImageMap[id] || '/assets/Accessorie.svg';
    
    // Get garment details from mock data or use defaults
    const garment = garmentDetails[id] || {
        name: `${id} Item`,
        brand: 'Brand',
        type: id,
        uses: 0,
        colors: ['Color'],
        description: 'Descripción de la prenda',
        outfits: [],
    };

    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
            <section className="px-8 md:px-16 py-14">
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition"
                >
                    ← Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
                    {/* Left Panel - Details */}
                    <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-700/50 p-8">
                        <h1 className="text-2xl font-bold text-white mb-8">Prenda</h1>

                        {/* Details Grid */}
                        <div className="space-y-6 mb-8">
                            <div>
                                <div className="text-white/60 text-sm font-medium mb-2">Nombre:</div>
                                <div className="text-white font-semibold text-lg">{garment.name}</div>
                            </div>
                            <div>
                                <div className="text-white/60 text-sm font-medium mb-2">Marca:</div>
                                <div className="text-white font-semibold text-lg">{garment.brand}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-white/60 text-sm font-medium mb-2">Tipo:</div>
                                    <div className="text-white font-semibold">{garment.type}</div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm font-medium mb-2">Usos:</div>
                                    <div className="text-white font-semibold">{garment.uses}</div>
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <div className="text-white/60 text-sm font-medium mb-3">Colores</div>
                                <div className="flex flex-wrap gap-2">
                                    {garment.colors.map((color: string) => (
                                        <span key={color} className="px-3 py-1 bg-slate-700 text-white text-sm rounded-full">
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Outfits Section */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Outfits donde aparece:</h3>
                            {garment.outfits.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {garment.outfits.map((outfit: any) => (
                                        <div
                                            key={outfit.id}
                                            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 aspect-square cursor-pointer hover:shadow-lg transition"
                                        >
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img src={imageUrl} alt={outfit.name} className="w-full h-full object-cover opacity-75" />
                                            </div>
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                {garment.type}
                                            </div>
                                            <div className="absolute top-2 right-2 text-white text-xl">
                                                <button className="hover:scale-110 transition">🤍</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 text-sm mb-6">No hay outfits aún</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-700">
                            <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition">
                                Editar prenda
                            </button>
                            <button className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-full transition">
                                Eliminar prenda
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Image */}
                    <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="relative h-full min-h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-2xl">
                            <img src={imageUrl} alt={garment.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
