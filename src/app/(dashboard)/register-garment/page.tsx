'use client';

import { useEffect, useState } from 'react';
import Banner from '../../common/components/Banner';
import GarmentCard from '../../common/components/GarmentCard';
import { garmentService, Garment } from '../../common/services/garment.service';

export default function RegisterGarmentPage() {
    const [garments, setGarments] = useState<Garment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGarments = async () => {
            try {
                const data = await garmentService.getGarments();
                setGarments(data);
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch garments');
            } finally {
                setLoading(false);
            }
        };

        fetchGarments();
    }, []);

    return (
        <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
            <Banner />
            <section className="px-8 md:px-16 py-14">
                <div className="mb-10 flex flex-col gap-3 text-white">
                    <p className="text-blue-400 font-semibold text-sm">Agregar prenda</p>
                    <h1 className="text-4xl font-bold">Consume el endpoint de prendas</h1>
                    <p className="max-w-2xl text-white/70">
                        Aquí se realiza la llamada al endpoint GET /garments. Si tu backend necesita credenciales,
                        asegúrate de estar autenticado.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-3xl bg-slate-950/80 p-10 text-center text-white">Cargando prendas...</div>
                ) : error ? (
                    <div className="rounded-3xl bg-rose-500/10 border border-rose-500/20 p-10 text-center text-red-300">
                        Error al cargar prendas: {error}
                    </div>
                ) : garments.length === 0 ? (
                    <div className="rounded-3xl bg-slate-950/80 p-10 text-center text-white/70">
                        No se encontraron prendas en el endpoint.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {garments.map((garment) => (
                            <GarmentCard
                                key={garment.id}
                                label={garment.type}
                                image={garment.image}
                                imageAlt={garment.name || garment.type}
                                isFavorited={false}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
