'use client';

import { useState } from 'react';
import FavoriteButton from './FavoriteButton';

interface GarmentCardProps {
    image?: string;
    imageAlt?: string;
    label: string;
    onFavorite?: (isFavorited: boolean) => void;
    isFavorited?: boolean;
    className?: string;
}

export default function GarmentCard({
    image,
    imageAlt = 'Garment',
    label,
    onFavorite,
    isFavorited = false,
    className = '',
}: GarmentCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`group relative w-full max-w-sm overflow-hidden rounded-[29px] backdrop-blur-sm transition-all duration-300 cursor-pointer ${className}`}
            style={{
                background: isHovered
                    ? 'radial-gradient(ellipse 66.06% 66.06% at 49.77% 50.00%, #3C6AEC 0%, #000022 100%)'
                    : 'radial-gradient(ellipse 86.28% 86.66% at 6.16% -0.00%, #3C6AEC 0%, #000022 100%)',
                boxShadow:
                    '0px 5.87px 5.87px rgba(0, 0, 0, 0.25), 1.47px 1.47px 14.68px rgba(247, 253, 254, 0.60) inset',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container */}
            <div className="flex flex-col h-full">
                {/* Header with Label and Favorite Button */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <div className="inline-flex px-3.5 py-1 bg-white/25 rounded-full shadow-md">
                        <span className="text-white font-bold text-base">{label}</span>
                    </div>
                    <FavoriteButton isFavorited={isFavorited} onToggle={onFavorite} />
                </div>

                {/* Image Section */}
                <div className="relative w-full aspect-square overflow-hidden px-6 pb-6">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        {image ? (
                            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="text-sm">No image</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
