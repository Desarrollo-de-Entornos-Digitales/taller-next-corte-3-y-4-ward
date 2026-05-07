'use client';

import Link from 'next/link';

export default function AddGarmentCard() {
    return (
        <Link
            href="/register-garment"
            className="group relative flex h-full min-h-[260px] w-full flex-col overflow-hidden rounded-[29px] bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 p-6 text-white transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/40"
        >
            <div className="flex h-full flex-col justify-between gap-4">
                <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-sky-100 shadow-sm shadow-sky-500/20">
                    Add garment
                </div>
                <div className="flex h-full flex-col items-start justify-center gap-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-bold text-white/90">
                        +
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Nueva prenda</h3>
                        <p className="text-sm text-slate-200/90">Ve al registro y consume el endpoint.</p>
                    </div>
                </div>
                <div className="inline-flex items-center justify-between rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-100 transition group-hover:bg-white/15">
                    <span>Ir ahora</span>
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                        Go
                    </span>
                </div>
            </div>
        </Link>
    );
}
