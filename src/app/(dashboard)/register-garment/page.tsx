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
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm">Registrar prenda</p>
                        <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">
                            Tus prendas más usadas
                        </h2>
                    </div>
                    <p className="text-white/80 text-base md:text-lg max-w-sm md:mt-8 leading-relaxed">
                        Aquí puedes ver las prendas más destacadas. En cuanto implementemos el registro completo, esta
                        sección mostrará la nueva prenda creada.
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
                        Aún no hay prendas disponibles.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {garments.map((garment) => (
                            <GarmentCard
                                key={garment.id}
                                id={garment.id}
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
