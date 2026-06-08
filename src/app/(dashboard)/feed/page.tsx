'use client';
import { useState, useEffect } from 'react';
import Banner from '../../common/components/Banner';
import AddGarmentCard from '../../common/components/AddGarmentCard';
import FilterPanel from '../../common/components/FilterPanel';
import GarmentCard from '../../common/components/GarmentCard';
import WelcomeModal from '../../common/components/WelcomeModal';
import { useGarments } from '../../common/hooks/useGarments';
import { useGarmentStore } from '@/src/lib/zustand/garmentStore';
import { garmentTypes } from '../../../util/garments.util';

export default function FeedPage() {
    const { garments, loading, error, isAuthenticated, isUsingMockData } = useGarments();
    const { setGarments } = useGarmentStore();
    const { garments, loading, error, isAuthenticated } = useGarments();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [pendingType, setPendingType] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const isNewUser = localStorage.getItem('isNewUser');
        if (isNewUser === 'true') {
            setShowWelcome(true);
        }
    }, []);

    // Sync garments to Zustand store
    useEffect(() => {
        if (garments.length > 0) {
            setGarments(garments);
        }
    }, [garments, setGarments]);

    const handleFavorite = (id: string, isFavorited: boolean) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (isFavorited) newFavorites.add(id);
            else newFavorites.delete(id);
            return newFavorites;
        });
    };

    if (loading) {
        return (
            <main style={{ backgroundColor: '#131620' }}>
                <Banner />
                <section className="px-8 md:px-16 py-14">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white">Loading garments...</div>
                    </div>
                </section>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main style={{ backgroundColor: '#131620' }}>
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

    const filteredGarments =
        activeType && activeType !== 'All types'
            ? garments.filter((g) => g.garment_type?.name === activeType)
            : garments;

    return (
        <main style={{ backgroundColor: '#131620' }}>
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

            <Banner />

            <section className="px-8 md:px-16 py-14">
                <FilterPanel
                    types={garmentTypes}
                    selectedType={activeType}
                    pendingType={pendingType}
                    onPendingTypeChange={setPendingType}
                    onApply={() => setActiveType(pendingType === 'All types' ? null : pendingType)}
                    onClear={() => {
                        setPendingType(null);
                        setActiveType(null);
                    }}
                />

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
                        Organiza tu estilo y lleva el control de tu armario digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <AddGarmentCard />
                    {filteredGarments.length > 0 ? (
                        filteredGarments.map((garment) => (
                            <GarmentCard
                                key={garment.id}
                                id={garment.id}
                                label={garment.garment_type?.name ?? ''}
                                isFavorited={favorites.has(garment.id)}
                                onFavorite={(isFav) => handleFavorite(garment.id, isFav)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col justify-center items-center h-64 gap-4">
                            <p className="text-white/60 text-center">Aún no tienes prendas registradas.</p>
                            <button
                                onClick={() => setShowWelcome(true)}
                                className="rounded-full px-6 py-2 text-white text-sm bg-blue-600 hover:bg-blue-700 transition"
                            >
                                ¿Cómo empezar?
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
