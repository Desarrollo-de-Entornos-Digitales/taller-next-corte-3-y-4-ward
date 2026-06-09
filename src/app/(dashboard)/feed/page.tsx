'use client';
import { useState, useEffect } from 'react';

import { garmentTypes, getMockGarments, getGarmentColors, getGarmentImageUrl } from '@/src/util/garments.util';
import type { Garment } from '@/src/app/common/services/garment.service';
import { useGarments } from '@/src/app/common/hooks/useGarments';
import Banner from '@/src/app/common/components/Banner';
import AddGarmentCard from '@/src/app/common/components/AddGarmentCard';
import FilterPanel from '@/src/app/common/components/FilterPanel';
import GarmentCard from '@/src/app/common/components/GarmentCard';
import WelcomeModal from '@/src/app/common/components/WelcomeModal';

export default function FeedPage() {
    const { garments, loading, isAuthenticated } = useGarments();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [pendingType, setPendingType] = useState<string | null>(null);
    const [pendingBrand, setPendingBrand] = useState<string | null>(null);
    const [pendingColor, setPendingColor] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [activeBrand, setActiveBrand] = useState<string | null>(null);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const isNewUser = localStorage.getItem('isNewUser');
        if (isNewUser === 'true') {
            window.setTimeout(() => setShowWelcome(true), 0);
        }
    }, []);

    // Sync garments to Zustand store
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

    const getGarmentColorsFromRecord = (garment: Garment) => {
        return getGarmentColors(garment);
    };

    const brands = Array.from(
        new Set(garments.map((g) => g.brand?.name).filter(Boolean)),
    ).sort() as string[];

    const colors = Array.from(
        new Set(garments.flatMap((g) => getGarmentColors(g)).filter(Boolean)),
    ).sort() as string[];

    const filteredGarments = garments.filter((garment) => {
        const garmentType = garment.type || garment.garment_type?.name || '';
        const brandName = garment.brand?.name || '';
        const garmentColors = getGarmentColors(garment);

        if (activeType && activeType !== 'All types' && garmentType !== activeType) {
            return false;
        }
        if (activeBrand && activeBrand !== 'All brands' && brandName !== activeBrand) {
            return false;
        }
        if (activeColor && activeColor !== 'All colors' && !garmentColors.includes(activeColor)) {
            return false;
        }
        return true;
    });

    return (
        <main style={{ backgroundColor: '#131620' }}>
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

            <Banner />

            <section className="px-8 md:px-16 py-14">
                <FilterPanel
                    types={garmentTypes}
                    brands={brands.length > 0 ? brands : getMockGarments().map((g) => g.brand?.name ?? '').filter(Boolean) as string[]}
                    colors={colors.length > 0 ? colors : Array.from(new Set(getMockGarments().flatMap((g) => getGarmentColors(g)))).filter(Boolean) as string[]}
                    selectedType={activeType}
                    selectedBrand={activeBrand}
                    selectedColor={activeColor}
                    pendingType={pendingType}
                    pendingBrand={pendingBrand}
                    pendingColor={pendingColor}
                    onPendingTypeChange={(value) => setPendingType(value === 'All types' ? null : value)}
                    onPendingBrandChange={(value) => setPendingBrand(value === 'All brands' ? null : value)}
                    onPendingColorChange={(value) => setPendingColor(value === 'All colors' ? null : value)}
                    onApply={() => {
                        setActiveType(pendingType === 'All types' ? null : pendingType);
                        setActiveBrand(pendingBrand === 'All brands' ? null : pendingBrand);
                        setActiveColor(pendingColor === 'All colors' ? null : pendingColor);
                    }}
                    onClear={() => {
                        setPendingType(null);
                        setPendingBrand(null);
                        setPendingColor(null);
                        setActiveType(null);
                        setActiveBrand(null);
                        setActiveColor(null);
                    }}
                />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm mb-2">Resumen de tu armario</p>
                        <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">
                            Aquí encontrarás
                            <br />
                        tus prendas favoritas
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
                                id={String(garment.id)}
                                label={garment.type || garment.garment_type?.name || ''}
                                name={garment.name}
                                brandName={garment.brand?.name}
                                colors={getGarmentColors(garment)}
                                image={getGarmentImageUrl(garment)}
                                imageAlt={String(
                                    garment.name || garment.type || garment.garment_type?.name || 'Garment',
                                )}
                                isFavorited={favorites.has(String(garment.id))}
                                onFavorite={(isFav) => handleFavorite(String(garment.id), isFav)}
                            />
                        ))
                    ) : garments.length === 0 ? (
                        <>
                            <div className="col-span-full rounded-3xl bg-slate-950/80 p-10 text-center text-white/70 mb-6">
                                Mostrando prendas predeterminadas con imágenes de ejemplo.
                            </div>
                            {getMockGarments().map((garment) => (
                                <GarmentCard
                                    key={garment.id}
                                    id={String(garment.id)}
                                    label={garment.type || garment.garment_type?.name || ''}
                                    name={garment.name}
                                    brandName={garment.brand?.name}
                                    colors={getGarmentColors(garment)}
                                    image={getGarmentImageUrl(garment)}
                                    imageAlt={garment.name}
                                    isFavorited={false}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full flex flex-col justify-center items-center h-64 gap-4">
                            <p className="text-white/60 text-center">No hay prendas que coincidan con el filtro actual.</p>
                            <button
                                onClick={() => {
                                    setPendingType(null);
                                    setActiveType(null);
                                }}
                                className="rounded-full px-6 py-2 text-white text-sm bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Mostrar todas
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
