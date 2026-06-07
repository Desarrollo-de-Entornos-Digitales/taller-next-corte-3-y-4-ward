'use client';

import { Garment } from '@/src/app/common/services/garment.service';
import GarmentCard from '@/src/app/common/components/GarmentCard';

interface SelectedGarmentsSectionProps {
    garments: Garment[];
    onRemoveGarment: (garmentId: string) => void;
}

export default function SelectedGarmentsSection({
    garments,
    onRemoveGarment,
}: SelectedGarmentsSectionProps) {
    if (garments.length === 0) {
        return (
            <div className="w-full">
                <h2 className="text-xl font-bold text-white mb-6">Prendas seleccionadas</h2>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 text-center">
                    <p className="text-white/50">No hay prendas seleccionadas</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-white mb-6">Prendas seleccionadas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {garments.map((garment) => (
                    <div key={garment.id} className="relative group">
                        <GarmentCard
                            id={garment.id}
                            image={garment.image}
                            label={garment.type}
                            isFavorited={false}
                        />
                        <button
                            onClick={() => onRemoveGarment(garment.id)}
                            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Remove garment"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
