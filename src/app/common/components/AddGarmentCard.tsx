'use client';

import Link from 'next/link';

export default function AddGarmentCard() {
    return (
        <Link
            href="/register-garment"
            className="group relative w-full max-w-sm overflow-hidden rounded-[29px] transition-all duration-300 cursor-pointer"
            style={{
                background: 'radial-gradient(ellipse 86.28% 86.66% at 6.16% -0.00%, #3C6AEC 0%, #000022 100%)',
                boxShadow: '0px 5.87px 5.87px rgba(0, 0, 0, 0.25), 1.47px 1.47px 14.68px rgba(247, 253, 254, 0.60) inset',
            }}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 pb-4">
                    <div className="inline-flex px-3.5 py-1 bg-white/25 rounded-full shadow-md">
                        <span className="text-white font-bold text-base">Add garment</span>
                    </div>
                </div>

                <div className="relative w-full aspect-square overflow-hidden px-6 pb-6">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-6xl font-bold text-white/90">
                            +
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
