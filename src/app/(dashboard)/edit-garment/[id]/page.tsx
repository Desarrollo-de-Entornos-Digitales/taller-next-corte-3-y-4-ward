'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { garmentTypes } from '@/src/util/garments.util';
import { garmentService, Garment } from '@/src/app/common/services/garment.service';
import { useGarments } from '@/src/app/common/hooks/useGarments';

export default function EditGarmentPage() {
const params = useParams();
const router = useRouter();
const id = params?.id as string;

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [garment, setGarment] = useState<Garment | null>(null);

const [name, setName] = useState('');
const [brand, setBrand] = useState('');
const [type, setType] = useState('');
const [color, setColor] = useState('');
const [description, setDescription] = useState('');

const [success, setSuccess] = useState(false);
const [error, setError] = useState<string | null>(null);

const { garments } = useGarments();

const uniqueBrands = Array.from(
    new Set(garments.map((g) => g.brand?.name).filter(Boolean))
).sort();

const allColors = garments.flatMap((g) => [
    ...(g.garment_colors?.map((gc) => gc.color?.name) ?? []),
    g.color,
]);

const uniqueColors = Array.from(
    new Set(allColors.filter((c): c is string => Boolean(c)))
).sort();

useEffect(() => {
    const loadGarment = async () => {
        try {
            const data = await garmentService.getGarment(id);

            setGarment(data);

            setName(data.name || '');
            setBrand(data.brand?.name || '');
            setType(data.type || data.garment_type?.name || '');

            const firstColor =
                data.garment_colors?.[0]?.color?.name ||
                data.color ||
                '';

            setColor(firstColor);
            setDescription(data.description || '');
        } catch (err) {
            setError('No fue posible cargar la prenda');
        } finally {
            setLoading(false);
        }
    };

    if (id) {
        void loadGarment();
    }
}, [id]);

const handleSubmit = async () => {
    try {
        setSaving(true);
        setError(null);

        await garmentService.updateGarment(id, {
            name,
            brand,
            type,
            color,
            description,
        });

        setSuccess(true);

        setTimeout(() => {
            router.push(`/feed/${id}`);
        }, 1200);
    } catch (err) {
        setError('No fue posible actualizar la prenda');
    } finally {
        setSaving(false);
    }
};

if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            Cargando prenda...
        </div>
    );
}

if (!garment) {
    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            Prenda no encontrada
        </div>
    );
}

return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <section className="px-8 md:px-16 py-14">

            <button
                onClick={() => router.back()}
                className="mb-8 text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
                ← Volver
            </button>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Editar prenda
                </h1>

                <p className="text-white/60 mt-4">
                    Actualiza la información de tu prenda.
                </p>
            </div>

            {error && (
                <div className="max-w-5xl mx-auto mb-6 bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="max-w-5xl mx-auto mb-6 bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-green-200">
                    Cambios guardados correctamente
                </div>
            )}

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

                <div className="bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-700/50 p-8">

                    <div className="space-y-6">

                        <div>
                            <label className="block text-white font-medium mb-2">
                                Nombre
                            </label>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
                            />
                        </div>

                        <div>
    <label className="block text-white font-medium mb-2">
        Marca
    </label>

    <select
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
    >
        <option value="">Selecciona marca</option>

        {uniqueBrands.map((b) => (
            <option key={b} value={b}>
                {b}
            </option>
        ))}
    </select>
</div>

                        <div>
                            <label className="block text-white font-medium mb-2">
                                Tipo
                            </label>

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
                            >
                                {garmentTypes.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
    <label className="block text-white font-medium mb-2">
        Color
    </label>

    <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
    >
        <option value="">Selecciona color</option>

        {uniqueColors.map((c) => (
            <option key={c} value={c}>
                {c}
            </option>
        ))}
    </select>
</div>

                        <div>
                            <label className="block text-white font-medium mb-2">
                                Descripción
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl px-4 py-3 bg-slate-800 border border-slate-700 text-white min-h-32"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => void handleSubmit()}
                                disabled={saving}
                                className="w-full py-3 rounded-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold transition"
                            >
                                {saving
                                    ? 'Guardando...'
                                    : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-700/50 p-6 flex items-center justify-center">

                    <img
                        src={garment.image_url}
                        alt={garment.name}
                        className="max-h-150 object-contain rounded-2xl"
                    />
                </div>
            </div>
        </section>
    </main>
);
}
