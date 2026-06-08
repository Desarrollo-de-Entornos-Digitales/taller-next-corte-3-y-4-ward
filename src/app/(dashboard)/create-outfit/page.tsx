'use client';

import { useState } from 'react';

import { useGarments } from '@/src/app/common/hooks/useGarments';
import { useOutfitStore } from '@/src/lib/zustand/outfitStore';

import { outfitService } from './services/outfit.service';
import OutfitNameInput from './components/OutfitNameInput';
import OccasionSelector from './components/OccasionSelector';
import SelectedGarmentsSection from './components/SelectedGarmentsSection';
import AddGarmentsSection from './components/AddGarmentsSection';

export default function CreateOutfitPage() {
    const { garments, loading, error } = useGarments();
    const { selectedGarmentIds, outfitName, occasion, toggleGarment, clearOutfit, setOutfitName, setOccasion } =
        useOutfitStore();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const availableGarments = garments;
    const selectedGarments = availableGarments.filter((g) => selectedGarmentIds.includes(String(g.id)));

    const handleSaveOutfit = async () => {
        // Validaciones
        if (!outfitName.trim()) {
            setSaveError('El nombre del outfit es requerido');
            return;
        }

        if (!occasion) {
            setSaveError('Debes seleccionar una ocasión');
            return;
        }

        if (selectedGarments.length === 0) {
            setSaveError('Debes seleccionar al menos una prenda');
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            await outfitService.createOutfit({
                name: outfitName,
                occasion: occasion,
                garments: selectedGarments,
            });

            // Reset form on success
            clearOutfit();
            setSaveSuccess(true);

            // Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al guardar el outfit';
            setSaveError(message);
            console.error('Error saving outfit:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                    <p className="text-white/70">Cargando prendas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Crear tu outfit</h1>
                    <p className="text-white/60 text-lg">
                        Selecciona las prendas de tu armario, ponle nombre y elige la ocasión. Tu outfit quedará
                        guardado y listo para usarlo cuando lo necesites.
                    </p>
                </div>

                {/* Alert Messages */}
                {saveError && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200">
                        <p className="font-medium">{saveError}</p>
                    </div>
                )}

                {saveSuccess && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-200">
                        <p className="font-medium">¡Outfit guardado exitosamente!</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-yellow-200">
                        <p className="font-medium">Nota: {error}</p>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Form Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 p-6 space-y-6">
                            <OutfitNameInput value={outfitName} onChange={setOutfitName} />

                            <OccasionSelector value={occasion} onChange={setOccasion} />

                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                <p className="text-sm text-blue-200">
                                    <span className="font-semibold">Prendas seleccionadas: </span>
                                    {selectedGarments.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Selected Garments Section */}
                    <div className="lg:col-span-2">
                        <SelectedGarmentsSection garments={selectedGarments} onRemoveGarment={toggleGarment} />
                    </div>
                </div>

                {/* Add Garments Section */}
                <div className="mb-12">
                    <AddGarmentsSection
                        availableGarments={availableGarments}
                        selectedGarmentIds={selectedGarmentIds}
                        onToggleGarment={toggleGarment}
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => void handleSaveOutfit()}
                        disabled={isSaving || selectedGarments.length === 0}
                        className="px-12 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 text-lg"
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                Guardando...
                            </span>
                        ) : (
                            'Guardar outfit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
