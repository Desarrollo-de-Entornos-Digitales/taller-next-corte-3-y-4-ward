'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import GarmentCard from '@/src/app/common/components/GarmentCard';
import { useGarments } from '@/src/app/common/hooks/useGarments';
import { useOutfitStore } from '@/src/lib/zustand/outfitStore';

export default function MyOutfitDetailPage() {
  const params = useParams();
  const outfitId = params?.id as string | undefined;
  const router = useRouter();
  const { createdOutfits, loadOutfits } = useOutfitStore();
  const { garments, loading: garmentsLoading } = useGarments();
  const [isOutfitsLoaded, setIsOutfitsLoaded] = useState(false);

  useEffect(() => {
    loadOutfits();
    setIsOutfitsLoaded(true);
  }, [loadOutfits]);

  const outfit = useMemo(
    () => (outfitId ? createdOutfits.find((item) => item.id === outfitId) : undefined),
    [createdOutfits, outfitId],
  );

  const selectedGarments = useMemo(() => {
    if (!outfit) return [];
    return garments.filter((garment) => outfit.garmentIds.includes(String(garment.id)));
  }, [garments, outfit]);

  if (!isOutfitsLoaded) {
    return (
      <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
        <p className="text-white text-lg">Cargando outfit...</p>
      </main>
    );
  }

  if (!outfit) {
    return (
      <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-slate-800/70 border border-slate-700/70 p-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Outfit no encontrado</h1>
          <p className="text-slate-300 mb-6">No se encontró el outfit que intentas ver. Regresa a mis outfits para seleccionar otro.</p>
          <button
            onClick={() => router.push('/my-outfits')}
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Volver a mis outfits
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-blue-400 font-semibold uppercase text-sm">Detalle de outfit</p>
            <h1 className="text-4xl font-bold text-white">{outfit.name}</h1>
            <p className="text-slate-300 mt-2">Ocasión: {outfit.occasion || 'Ninguna'}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push('/my-outfits')}
              className="px-5 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-semibold transition"
            >
              Volver a mis outfits
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-8">
            <h2 className="text-xl font-bold text-white mb-4">Resumen</h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-sm uppercase text-slate-500">Prendas</p>
                <p className="text-lg font-semibold">{outfit.garmentIds.length}</p>
              </div>
              <div>
                <p className="text-sm uppercase text-slate-500">Guardado local</p>
                <p className="text-lg font-semibold">Sí</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-8">
            <h2 className="text-xl font-bold text-white mb-6">Prendas incluidas</h2>
            {garmentsLoading ? (
              <p className="text-slate-300">Cargando prendas...</p>
            ) : selectedGarments.length === 0 ? (
              <p className="text-slate-300">No se encontraron los detalles de las prendas seleccionadas.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedGarments.map((garment) => (
                  <GarmentCard
                    key={String(garment.id)}
                    id={String(garment.id)}
                    image={garment.image_url}
                    imageAlt={garment.name || garment.type || 'Prenda'}
                    label={garment.type || garment.garment_type?.name || 'Prenda'}
                    name={garment.name}
                    brandName={garment.brand?.name}
                    colors={garment.garment_colors?.map((gc) => gc.color?.name).filter(Boolean) as string[]}
                    isFavorited={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
