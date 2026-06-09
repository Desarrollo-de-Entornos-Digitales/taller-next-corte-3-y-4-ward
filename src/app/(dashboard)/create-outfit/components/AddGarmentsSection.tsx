'use client';

import { useState, useMemo } from 'react';

import { Garment } from '@/src/app/common/services/garment.service';
import GarmentCard from '@/src/app/common/components/GarmentCard';
import { garmentTypes, getGarmentColors, getGarmentImageUrl } from '@/src/util/garments.util';

interface AddGarmentsSectionProps {
    availableGarments: Garment[];
    selectedGarmentIds: string[];
    onToggleGarment: (garmentId: string) => void;
}

// Use centralized garmentTypes from util to ensure consistency

export default function AddGarmentsSection({
    availableGarments,
    selectedGarmentIds,
    onToggleGarment,
}: AddGarmentsSectionProps) {
    const [activeCategory, setActiveCategory] = useState<string>(garmentTypes[0] || 'T-Shirt');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGarments = useMemo(() => {
        return availableGarments.filter((garment) => {
            const garmentCategory = garment.type || garment.garment_type?.name || '';
            const matchesCategory = garmentCategory === activeCategory;
            const matchesSearch =
                searchQuery === '' ||
                garment.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                garment.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [availableGarments, activeCategory, searchQuery]);

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-white mb-6">Agregar prendas</h2>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar prendas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-6 py-3 text-white placeholder:text-slate-400 shadow-sm transition duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
            </div>

            {/* Category Tabs */}
            <div className="mb-8 flex flex-wrap gap-3 overflow-x-auto pb-2">
                {garmentTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveCategory(type)}
                        className={`px-5 py-2 rounded-full font-medium transition duration-200 whitespace-nowrap ${
                            activeCategory === type
                                ? 'bg-sky-600 text-white shadow-lg'
                                : 'bg-slate-700 text-white hover:bg-slate-600'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Garments Grid */}
            {filteredGarments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredGarments.map((garment) => {
                        const isSelected = selectedGarmentIds.includes(String(garment.id));
                        return (
                            <div key={garment.id} className="relative group">
                                <div className="opacity-75 group-hover:opacity-100 transition-opacity duration-200">
                                    <GarmentCard
                                        id={String(garment.id)}
                                        image={getGarmentImageUrl(garment)}
                                        label={garment.type || garment.garment_type?.name || ''}
                                        name={garment.name}
                                        brandName={garment.brand?.name}
                                        colors={
                                            garment.garment_colors
                                                ?.map((gc) => gc.color?.name)
                                                .filter(Boolean) as string[]
                                        }
                                        isFavorited={false}
                                    />
                                </div>
                                <button
                                    onClick={() => onToggleGarment(String(garment.id))}
                                    disabled={isSelected}
                                    className={`absolute bottom-2 right-2 z-10 rounded-full p-2 transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-green-500 text-white opacity-100'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white opacity-0 group-hover:opacity-100'
                                    }`}
                                    aria-label={isSelected ? 'Already selected' : 'Add garment'}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill={isSelected ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {isSelected ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 text-center">
                    <p className="text-white/50">
                        No hay prendas disponibles en esta categoría
                        {searchQuery && ' que coincidan con tu búsqueda'}
                    </p>
                </div>
            )}
        </div>
    );
}
