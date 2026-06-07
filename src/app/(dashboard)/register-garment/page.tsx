'use client';

import { useEffect, useState } from 'react';
import Banner from '../../common/components/Banner';
import GarmentCard from '../../common/components/GarmentCard';
import { garmentService, Garment } from '../../common/services/garment.service';
import { useGarmentStore } from '@/src/lib/zustand/garmentStore';
import { garmentTypes } from '@/src/util/garments.util';

export default function RegisterGarmentPage() {
    const [garments, setGarments] = useState<Garment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addGarment } = useGarmentStore();

    // Form state
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchGarments = async () => {
            try {
                const data = await garmentService.getGarments();
                setGarments(data);
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch garments');
            } finally {
                setLoading(false);
            }
        };

        fetchGarments();
    }, []);

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setImagePreview(String(reader.result));
        reader.readAsDataURL(imageFile);
    }, [imageFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageFile(file);
            // También crear un preview para mostrar inmediatamente
            const reader = new FileReader();
            reader.onload = () => setImagePreview(String(reader.result));
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setName('');
        setBrand('');
        setType('');
        setColor('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e && e.preventDefault();
        setSaveError(null);

        if (!name.trim()) {
            setSaveError('El nombre es requerido');
            return;
        }
        if (!type.trim()) {
            setSaveError('El tipo es requerido');
            return;
        }
        if (!imageFile) {
            setSaveError('La imagen de la prenda es requerida');
            return;
        }

        try {
            setIsSaving(true);
            const form = new FormData();
            form.append('name', name);
            form.append('brand', brand);
            form.append('type', type);
            form.append('color', color);
            form.append('description', description);
            form.append('image', imageFile);

            const created = await garmentService.createGarment(form);
            setGarments((prev) => [created, ...prev]);
            // Also add to Zustand store
            addGarment(created);
            setSaveSuccess(true);
            resetForm();
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setSaveError(err?.message || 'Error al crear la prenda');
            console.error('Create garment error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pb-12">
            <section className="px-8 md:px-16 py-14">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm">Registrar prenda</p>
                        <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">Registrar una nueva prenda</h2>
                    </div>
                    <p className="text-white/80 text-base md:text-lg max-w-sm md:mt-8 leading-relaxed">
                        Completa los campos y sube una foto de la prenda para registrarla en tu armario.
                    </p>
                </div>

                <div className="rounded-3xl bg-slate-800/50 backdrop-blur border border-slate-700/50 p-10">
                    {saveError && (
                        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 p-3 text-red-300 rounded">{saveError}</div>
                    )}
                    {saveSuccess && (
                        <div className="mb-4 bg-green-500/10 border border-green-500/20 p-3 text-green-200 rounded">Prenda creada correctamente</div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-64 h-64 rounded-xl bg-linear-to-br from-blue-700 to-sky-600 flex items-center justify-center overflow-hidden shadow-inner cursor-pointer hover:shadow-lg transition-shadow">
                                {imagePreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                ) : (
                                    <label className="flex flex-col items-center justify-center text-white/80 cursor-pointer w-full h-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="mt-2">Sube una imagen</span>
                                    </label>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 text-sm text-white/70 cursor-pointer" />
                        </div>

                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-medium mb-2">Nombre:</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white" placeholder="Escribe aquí..." />
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Marca:</label>
                                    <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white" placeholder="Marca" />
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Tipo:</label>
                                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white">
                                        <option value="">Tipo</option>
                                        {garmentTypes.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Colores:</label>
                                    <input value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-full px-4 py-3 bg-slate-800 border border-slate-700 text-white" placeholder="Color" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-white font-medium mb-2">Descripción (opcional):</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl px-4 py-3 bg-slate-800 border border-slate-700 text-white min-h-30" placeholder="Descripción de la prenda..."></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center">
                                <button type="submit" disabled={isSaving} className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white rounded-full font-bold shadow-lg transition-all duration-200">
                                    {isSaving ? 'Guardando...' : 'Guardar Prenda'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-12">
                    <h3 className="text-white font-semibold mb-4">Prendas existentes</h3>
                    {loading ? (
                        <div className="rounded-3xl bg-slate-950/80 p-6 text-center text-white">Cargando prendas...</div>
                    ) : garments.length === 0 ? (
                        <div className="rounded-3xl bg-slate-950/80 p-6 text-center text-white/70">Aún no hay prendas.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {garments.map((g) => (
                                <GarmentCard id={g.id} key={g.id} label={g.type} image={g.image} imageAlt={g.name || g.type} isFavorited={false} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
