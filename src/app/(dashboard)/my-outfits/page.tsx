'use client';

import { useRouter } from 'next/navigation';

export default function MyOutfitsPage() {
    const router = useRouter();

    // TEMPORAL
    const outfits = [
        {
            id: 1,
            name: 'Casual Friday',
            garments: [1, 2, 3, 4],
        },
        {
            id: 2,
            name: 'University Day',
            garments: [1, 2, 3],
        },
        {
            id: 3,
            name: 'Night Out',
            garments: [1, 2, 3, 4, 5],
        },
    ];

    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
            <section className="px-8 md:px-16 py-14 pt-28">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm">
                            Mis outfits
                        </p>

                        <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight">
                            Administra tus outfits
                        </h1>
                    </div>

                    <button
                        onClick={() => router.push('/create-outfit')}
                        className="px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition"
                    >
                        + Crear Outfit
                    </button>
                </div>

                {/* Summary */}
                <div className="mb-12">
                    <div className="max-w-xs rounded-3xl bg-slate-800/50 backdrop-blur border border-slate-700/50 p-8">
                        <p className="text-white/60 text-sm uppercase tracking-wider">
                            Total de outfits
                        </p>

                        <h2 className="text-white text-5xl font-bold mt-3">
                            {outfits.length}
                        </h2>
                    </div>
                </div>

                {/* Empty State */}
                {outfits.length === 0 ? (
                    <div className="rounded-3xl bg-slate-800/50 backdrop-blur border border-slate-700/50 p-12 text-center">
                        <h3 className="text-white text-2xl font-bold mb-4">
                            Aún no has creado outfits
                        </h3>

                        <p className="text-white/60 mb-8">
                            Combina tus prendas favoritas y crea tu primer
                            outfit.
                        </p>

                        <button
                            onClick={() => router.push('/create-outfit')}
                            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                            Crear Outfit
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {outfits.map((outfit) => (
                            <div
                                key={outfit.id}
                                className="rounded-3xl bg-slate-800/50 backdrop-blur border border-slate-700/50 p-8 hover:border-blue-500/50 transition"
                            >
                                <div className="mb-8">
                                    <h3 className="text-white text-2xl font-bold mb-3">
                                        {outfit.name}
                                    </h3>

                                    <p className="text-white/60">
                                        {outfit.garments.length} prendas
                                        asociadas
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        router.push(
                                            `/my-outfits/${outfit.id}`
                                        )
                                    }
                                    className="w-full py-3 rounded-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition"
                                >
                                    Ver Outfit
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}