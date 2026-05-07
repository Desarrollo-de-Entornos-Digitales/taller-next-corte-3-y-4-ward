'use client';
import { useState } from 'react';
import Banner from '../../common/components/Banner';
import GarmentCard from '../../common/components/GarmentCard';
import { useGarments } from '../../common/hooks/useGarments';

export default function FeedPage() {
    const { garments, loading, error, isAuthenticated, isUsingMockData } = useGarments();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const handleFavorite = (id: string, isFavorited: boolean) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (isFavorited) {
                newFavorites.add(id);
            } else {
                newFavorites.delete(id);
            }
            return newFavorites;
        });
        console.log(`Garment ${id} favorited: ${isFavorited}`);
    };

    if (loading) {
        return (
            <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
                <Banner />
                <section className="px-8 md:px-16 py-14">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white">Loading garments...</div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
                <Banner />
                <section className="px-8 md:px-16 py-14">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-400">Error loading garments: {error}</div>
                    </div>
                </section>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
                <Banner />
                <section className="px-8 md:px-16 py-14">
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="text-white/80 text-center">
                            <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                            <p>Please log in to view your garments</p>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
            <Banner />

            {/* Resumen de tu armario */}
            <section className="px-8 md:px-16 py-14">
                {/* Header: dos columnas */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm mb-2">Resumen de tu armario</p>
                        <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">
                            Tus prendas más
                            <br />
                            usadas
                        </h2>
                    </div>
                    <p className="text-white/80 text-base md:text-lg max-w-sm md:mt-8 leading-relaxed">
                        Tu estilo gira principalmente alrededor de prendas tipo{' '}
                        <strong className="text-white">Shirts</strong>, que se han convertido en la base de la mayoría
                        de tus outfits.
                    </p>
                </div>

                {isUsingMockData && (
                    <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                        <p className="text-yellow-300 text-sm">
                            ⚠️ Mostrando datos de prueba. El servidor no está disponible en este momento.
                        </p>
                    </div>
                )}

                {/* Garment cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {garments.length > 0 ? (
                        garments.map((garment) => (
                            <GarmentCard
                                key={garment.id}
                                label={garment.type}
                                isFavorited={favorites.has(garment.id)}
                                onFavorite={(isFav) => handleFavorite(garment.id, isFav)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center items-center h-64">
                            <div className="text-white/60">No garments found</div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
