'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GarmentCard from '@/src/app/common/components/GarmentCard';
import { garmentService, Garment } from '../../../common/services/garment.service';

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

const API_BASE = process.env.NEXT_PUBLIC_API || 'http://localhost:3001';

function resolveImageUrl(image?: string, label?: string) {
    if (image) {
        if (image.startsWith('http')) return image;
        if (image.startsWith('/')) return `${API_BASE}${image}`;
        return image;
    }
    const fallback = garmentImageMap[label || ''] || '/assets/Accessorie.svg';
    return `${API_BASE}${fallback.startsWith('/') ? fallback : `/${fallback}`}`;
}

export default function FeedItemPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [garment, setGarment] = useState<Garment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const fetchGarment = async () => {
            setLoading(true);
            setError(null);
            try {
                // Try direct endpoint first
                const g = await garmentService.getGarment(id);
                if (!mounted) return;
                setGarment(g);
            } catch (err) {
                try {
                    // Fallback: fetch all and find
                    const all = await garmentService.getGarments();
                    const found = all.find((it) => String(it.id) === id);
                    if (!mounted) return;
                    if (found) setGarment(found);
                    else setError('Prenda no encontrada');
                } catch (e) {
                    if (!mounted) return;
                    setError('Error al obtener la prenda');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (id) fetchGarment();
        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) {
        return <div className="p-8 text-white">Cargando prenda...</div>;
    }

    if (error || !garment) {
        return <div className="p-8 text-white">{error || 'Prenda no encontrada'}</div>;
    }

    const typeLabel = garment.garment_type?.name || garment.type || '';
    const brandName = garment.brand?.name || '';
    const colors = (garment.garment_colors || []).map((gc) => gc?.color?.name).filter(Boolean) as string[];
    const uses = (garment.use_count ?? garment.use_count ?? 0) as number;
    const imageUrl = resolveImageUrl(garment.image_url || garment.image_url || undefined, typeLabel || undefined);

    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-15">
            <section className="px-8 md:px-16 py-14">
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-blue-700 hover:text-blue-500 font-medium flex items-center gap-2 transition"
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
                                <div className="text-white font-semibold text-lg">{brandName || '—'}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-white/60 text-sm font-medium mb-2">Tipo:</div>
                                    <div className="text-white font-semibold">{typeLabel || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm font-medium mb-2">Usos:</div>
                                    <div className="text-white font-semibold">{uses}</div>
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <div className="text-white/60 text-sm font-medium mb-3">Colores</div>
                                <div className="flex flex-wrap gap-2">
                                    {(colors.length > 0 ? colors : ['—']).map((color) => (
                                        <span
                                            key={color}
                                            className="px-3 py-1 bg-slate-700 text-white text-sm rounded-full"
                                        >
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Outfits Section */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Outfits donde aparece:</h3>
                            <p className="text-white/60 text-sm mb-6">No hay outfits aún</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-700">
                            <button onClick={() => router.push(`/edit-garment/${id}`)}className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition"
                             >
                             Editar prenda
                            </button>

                            <button className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-full transition">
                                Eliminar prenda
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Image */}
                    <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="relative h-full min-h-96 rounded-3xl overflow-hidden bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-2xl">
                            <img src={imageUrl} alt={garment.name || 'Prenda'} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
