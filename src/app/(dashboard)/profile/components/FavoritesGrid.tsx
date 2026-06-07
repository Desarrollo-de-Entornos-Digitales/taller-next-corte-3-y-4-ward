'use client';

import { useEffect, useState } from 'react';
import { Garment } from '@/src/app/common/services/garment.service';
import GarmentCard from '@/src/app/common/components/GarmentCard';
import FavoriteButton from '@/src/app/common/components/FavoriteButton';
import { useGarments } from '@/src/app/common/hooks/useGarments';

export default function FavoritesGrid() {
    const { garments, loading } = useGarments();
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('favorites');
            if (raw) setFavorites(JSON.parse(raw));
        } catch (e) {
            setFavorites([]);
        }
    }, []);

    const toggleFavorite = (id: string, isFav: boolean) => {
        setFavorites((prev) => {
            const updated = isFav ? [...prev, id] : prev.filter((x) => x !== id);
            try {
                localStorage.setItem('favorites', JSON.stringify(updated));
            } catch (e) {}
            return updated;
        });
    };

    const favoriteGarments = garments.filter((g) => favorites.includes(g.id));

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Tus prendas favoritas</h3>
            {loading ? (
                <div className="text-white/70">Cargando...</div>
            ) : favoriteGarments.length === 0 ? (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 text-white/60">
                    No tienes prendas favoritas aún.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {favoriteGarments.map((g: Garment) => (
                        <div key={g.id} className="relative group">
                            <GarmentCard id={g.id} image={g.image_url} label={g.type} isFavorited={true} />
                            <div className="absolute top-2 right-2 z-10">
                                <FavoriteButton isFavorited={true} onToggle={(isFav) => toggleFavorite(g.id, !isFav)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
