'use client';

import { useState } from 'react';

import { useGarmentStore } from '@/src/lib/zustand/garmentStore';
import { useGarments } from '@/src/app/common/hooks/useGarments';
import {
    garmentTypes,
    garmentBrands,
    garmentColors,
    getMockGarments,
    getGarmentColors,
    getGarmentImageUrl,
    getFallbackGarmentImage,
} from '@/src/util/garments.util';

import GarmentCard from '../../common/components/GarmentCard';
import { garmentService } from '../../common/services/garment.service';

const mockGarments = getMockGarments();

export default function RegisterGarmentPage() {
    const { garments, loading, error, refetch } = useGarments();
    const { addGarment } = useGarmentStore();

    // Form state
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            setImagePreview(null);
            setImageName(null);
            return;
        }

        setImageName(file.name);
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setName('');
        setBrand('');
        setType('');
        setColor('');
        setDescription('');
        setImagePreview(null);
        setSelectedFile(null);
        setImageName(null);
    };

    // Extract unique brands and colors from garments
    const uniqueBrands = Array.from(new Set(garments.map((g) => g.brand?.name).filter(Boolean))).sort();
    const allColors = garments.flatMap((g) => getGarmentColors(g));
    const uniqueColors = Array.from(new Set(allColors)).sort();

    const brandOptions = Array.from(new Set([...garmentBrands, ...uniqueBrands]));
    const colorOptions = Array.from(new Set([...garmentColors, ...uniqueColors]));

    const buildPayload = async (): Promise<Record<string, unknown>> => {
        const base: Record<string, unknown> = {
            name: name.trim(),
            type: type.trim(),
        };

        if (brand.trim()) base.brand = brand.trim();
        if (color.trim()) base.color = color.trim();
        if (description.trim()) base.description = description.trim();

        // If there is a selected file, we'll send FormData in handleSubmit instead.
        base.image_url = imagePreview || getFallbackGarmentImage(type.trim(), name.trim());
        return base;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        setSaveError(null);

        if (!name.trim()) {
            setSaveError('El nombre es requerido');
            return;
        }
        if (!type.trim()) {
            setSaveError('El tipo es requerido');
            return;
        }

        try {
            setIsSaving(true);
            const payload = await buildPayload();

            // If user provided a file, send FormData so backend can receive the image file.
            let created;
            if (selectedFile) {
                const form = new FormData();
                form.append('name', String(payload.name || ''));
                form.append('type', String(payload.type || ''));
                if (payload.brand) form.append('brand', String(payload.brand));
                if (payload.color) form.append('color', String(payload.color));
                if (payload.description) form.append('description', String(payload.description));
                form.append('image', selectedFile, selectedFile.name);

                created = await garmentService.createGarment(form, imagePreview || undefined);
            } else {
                created = await garmentService.createGarment(payload, imagePreview || undefined);
            }
            addGarment(created);
            await refetch();
            setSaveSuccess(true);
            resetForm();
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al crear la prenda';
            setSaveError(message);
            console.error('Create garment error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pb-12 pt-15">
            <section className="px-8 md:px-16 py-14">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm">Registrar prenda</p>
                        <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">
                            Registrar una nueva prenda
                        </h2>
                    </div>
                    <p className="text-white/80 text-base md:text-lg max-w-sm md:mt-8 leading-relaxed">
                        Completa los campos y sube una foto de la prenda para registrarla en tu armario.
                    </p>
                </div>

                <div className="rounded-3xl bg-slate-800/50 backdrop-blur border border-slate-700/50 p-10">
                    {saveError && (
                        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 p-3 text-red-300 rounded">
                            {saveError}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 p-3 text-yellow-200 rounded">
                            No se pudieron cargar las prendas existentes: {error}. Usa los valores predeterminados para
                            marca y color.
                        </div>
                    )}
                    {saveSuccess && (
                        <div className="mb-4 bg-green-500/10 border border-green-500/20 p-3 text-green-200 rounded">
                            Prenda creada correctamente
                        </div>
                    )}

                    <form
                        onSubmit={(e) => void handleSubmit(e)}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-4">
                                <label
                                    htmlFor="garment-image-upload"
                                    className="w-64 h-64 rounded-xl bg-linear-to-br from-blue-700 to-sky-600 flex items-center justify-center overflow-hidden shadow-inner cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-white/80 w-full h-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-16 w-16"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="mt-2">Selecciona una imagen</span>
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="garment-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="garment-image-upload"
                                    className="mt-2 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    Seleccionar imagen desde el escritorio
                                </label>
                                {imageName && <p className="text-sm text-white/70">Archivo: {imageName}</p>}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-medium mb-2">Nombre:</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
                                        placeholder="Escribe aquí..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Marca:</label>
                                    <select
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
                                    >
                                        <option value="">Selecciona marca</option>
                                        {brandOptions.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Tipo:</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
                                    >
                                        <option value="">Tipo</option>
                                        {garmentTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Colores:</label>
                                    <select
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white"
                                    >
                                        <option value="">Selecciona color</option>
                                        {colorOptions.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-white font-medium mb-2">Descripción (opcional):</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full rounded-xl px-4 py-3 bg-slate-800 border border-slate-700 text-white min-h-30"
                                        placeholder="Descripción de la prenda..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white rounded-full font-bold shadow-lg transition-all duration-200"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Prenda'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-12">
                    <h3 className="text-white font-semibold mb-4">Prendas existentes</h3>
                    <p className="text-white/70 mb-6">
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
                ) : (
                    <>
                        {garments.length === 0 && (
                            <div className="rounded-3xl bg-slate-950/80 p-10 text-center text-white/70 mb-6">
                                Mostrando prendas predeterminadas con imágenes de ejemplo.
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(garments.length > 0 ? garments : mockGarments).map((garment) => (
                                <GarmentCard
                                    key={garment.id}
                                    id={String(garment.id)}
                                    label={garment.type || garment.garment_type?.name || ''}
                                    name={garment.name}
                                    brandName={garment.brand?.name}
                                    colors={getGarmentColors(garment)}
                                    image={getGarmentImageUrl(garment)}
                                    imageAlt={String(garment.name || garment.type || '')}
                                    isFavorited={false}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
